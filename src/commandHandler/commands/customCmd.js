const { PermissionFlagsBits, ApplicationCommandOptionType: Type } = require('discord.js');

module.exports = {
    name: 'customcmd',
    description: 'Set up custom commands',
    legacy: false,
    defaultMemberPermissions: [PermissionFlagsBits.Administrator],
    options: [
        {
            name: 'create',
            description: 'Create a custom command',
            type: Type.Subcommand,
            options: [
                {
                    name: 'name',
                    description: 'Specify the command name',
                    type: Type.String,
                    required: true,
                },
                {
                    name: 'description',
                    description: 'Add a command description',
                    type: Type.String,
                    required: true,
                },
                {
                    name: 'response',
                    description: 'Specify what you want the bot to reply with',
                    type: Type.String,
                    required: true,
                },
            ]
        },
        {
            name: 'delete',
            description: 'Delete a custom command',
            type: Type.Subcommand,
            options: [
                {
                    name: 'name',
                    description: 'Specify the command name',
                    type: Type.String,
                    required: true,
                }
            ]
        }
    ],
    async execute ({ interaction, instance, guild, options }) {
        const method = options.getSubcommand();

        if (method === 'create'){
            const commandName = options.getString('name').toLowerCase();
            const description = options.getString('description');
            const response = options.getString('response');

            await instance.commandHandler.customCommands.create(
                guild.id,
                commandName,
                description,
                response
            );

            return `Custom command "${commandName}" has been created.`;
        }

        if (method === 'delete'){
            const commandName = options.getString('name');
            await instance.commandHandler.customCommands.delete(
                guild.id,
                commandName
            );

            return `Custom command "${commandName}" has been deleted.`;
        }
    }
}