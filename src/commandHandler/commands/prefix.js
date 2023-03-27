const { PermissionFlagsBits, ApplicationCommandOptionType: Type } = require("discord.js");

module.exports = {
    name: 'prefix',
    description: 'Set a legacy command prefix for this server',
    permissions: [PermissionFlagsBits.Administrator],
    options: [
        {
            name: 'prefix',
            description: 'The prefix you want to use',
            type: Type.String,
            required: true,
        }
    ],
    legacy: 'both',
    disabled: false,
    minArgs: 1,
    maxArgs: 1,
    expectedArgs: '<prefix>',
    correctSyntax: 'Correct syntax: {PREFIX}prefix {ARGS}',
    execute({instance, guild, text: prefix }) {
        instance.commandHandler.prefixHandler.set(guild.id, prefix);

        return `Set "${prefix}" as the command prefix for this server.`;
    }
}