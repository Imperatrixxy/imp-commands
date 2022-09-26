class SlashCommands {
    constructor(client) {
        this._client = client;
    }

    async getCommands(guildId) {
        let commands;

        if (guildId) {
            const guild = await this._client.guilds.fetch(guildId);
            commands = guild.commands;
        } else {
            commands = this._client.application.commands;
        }
        
        await commands.fetch();

        return commands;
    }

    compareOptions(options, oldOptions) {
        for (let i = 0; i < options.length; ++i) {
            const option = options[i];
            const previous = oldOptions[i];

            if(
                option.name !== previous.name ||
                option.type !== previous.type ||
                option.description !== previous.description
            ) return true;
        }

        return false;
    }

    async create(name, nameLocalizations, description, descriptionLocalizations, defaultMemberPermissions, dmPermission, options, guildId) {

        const commands = await this.getCommands(guildId);
        const oldCommand = commands.cache.find((cmd) => cmd.name === name);
        defaultMemberPermissions = defaultMemberPermissions.bitfield;

        if (oldCommand) {
            const {
                nameLocalizations: oldNameLoc,
                description: oldDescription,
                defaultMemberPermissions: oldDefaultPerms,
                dmPermission: oldDMPermission,
                options: oldOptions
            } = oldCommand;

            if (
                description !== oldDescription ||
                defaultMemberPermissions !== oldDefaultPerms.bitfield ||
                dmPermission !== oldDMPermission ||
                options.length !== oldOptions.length ||
                this.compareOptions(options, oldOptions)
            ) {
                console.log(`Updating the ${name} command...`);

                await commands.edit(oldCommand.id, {
                    nameLocalizations,
                    description,
                    descriptionLocalizations,
                    defaultMemberPermissions,
                    dmPermission,
                    options,
                });
            }
            return;
        }

        console.log(`Creating the ${name} command...`);
        await commands.create({
            name,
            nameLocalizations,
            description,
            descriptionLocalizations,
            defaultMemberPermissions,
            dmPermission,
            options,
        });
    }

    async delete (commandName, guildId) {
        const commands = await this.getCommands(guildId);
        const oldCommand = commands.cache.find((cmd) => cmd.name === commandName);

        if (!oldCommand) return;

        console.log(`Deleting the ${commandName} command...`);

        await oldCommand.delete();
    }

    createOptions( {expectedArgs = '', minArgs = 0 }) {
        const options = [];

        if (expectedArgs) {
            const split = expectedArgs
                .substring(1, expectedArgs.length - 1)
                .split(/[>\]] [<\[]/);

            for (let i = 0; i < split.length; ++i) {
                const arg = split[i];

                options.push({
                    name: arg.toLowerCase().replace(/\s+/g, '-'),
                    description: arg,
                    type: 3, //STRING
                    required: i < minArgs,
                });
            }
        }

        return options;
    }
}

module.exports = SlashCommands;