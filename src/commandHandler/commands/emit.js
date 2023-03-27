const { PermissionFlagsBits, ApplicationCommandOptionType: Option} = require('discord.js');

module.exports = {
    name: 'emit',
    description: 'event emitter',
    devOnly: true,
    deferReply: 'ephemeral',
    permissions: [ PermissionFlagsBits.Administrator ],
    options: [
        {
            name: 'member',
            description: 'Guild member events',
            type: Option.String,
            required: true,
            choices: [
                {
                    name: 'guildMemberAdd',
                    value: 'guildMemberAdd'
                },
                {
                    name: 'guildMemberRemove',
                    value: 'guildMemberRemove'
                },
                {
                    name: 'guildCreate',
                    value: 'guildCreate'
                },
            ]
        }
    ],
    execute({options, client, member}) {
        const choices = options.getString('member');

        switch(choices) {
            case 'guildMemberAdd' : {
                client.emit('guildMemberAdd', member);
                return 'Gasp! You just "joined" the server!';
            }
            case 'guildMemberRemove' : {
                client.emit('guildMemberRemove', member);
                return 'Gasp! You just "left" the server!';
            }
            case 'guildCreate' : {
                client.emit('guildCreate', member);
                return 'Gasp! I just "joined" the server!';
            }
        }
    }
}