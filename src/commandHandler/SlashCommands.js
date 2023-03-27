const { ApplicationCommandType } = require("discord.js");

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
            
            if(option.choices || previous.choices){
                if(!option.choices?.length !== !previous.choices?.length) return true;

                for(let i = 0; i < option.choices.length; i++) {
                    const choice = option.choices[i];
                    const oldChoice = previous.choices[i];

                    if(
                        choice.name !== oldChoice.name ||
                        choice.value !== oldChoice.value
                    ) return true;
                }
            }
            

            if(!option.options && !previous.options) continue;

            if(
                option.options?.length !== previous.options?.length ||
                this.compareOptions(option.options, previous.options)
            ) return true;
        }

        return false;
    }

    async create(name, nameLocalizations, type, description, descriptionLocalizations, defaultMemberPermissions, dmPermission, options, guildId) {

        const commands = await this.getCommands(guildId);
        const oldCommand = commands.cache.find((cmd) => cmd.name === name);
        defaultMemberPermissions = defaultMemberPermissions.bitfield;

        if (oldCommand) {
            let updateCmd = false;
            const {
                description: oldDescription,
                defaultMemberPermissions: oldDefaultPerms,
                dmPermission: oldDMPermission,
                options: oldOptions
            } = oldCommand;

            if (!type || type === ApplicationCommandType.ChatInput) {
                if(description !== oldDescription) updateCmd = true;
            }

            if(
                oldDMPermission !== null &&
                dmPermission !== oldDMPermission
            ) updateCmd = true;

            if (
                defaultMemberPermissions !== oldDefaultPerms.bitfield ||
                options.length !== oldOptions.length ||
                this.compareOptions(options, oldOptions)
            ) updateCmd = true;
            
            if (updateCmd) {
                console.log(`Updating the ${name} command...`);

                await commands.edit(oldCommand.id, {
                    nameLocalizations,
                    type,
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
            type,
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