const { PermissionFlagsBits, ApplicationCommandOptionType: Option } = require('discord.js');

module.exports = {
    name: 'delete',
    nameLocalizations: {
        'sv-SE': 'radera',
        de: 'löschen',
    },
    description: 'Deletes X amount of messages',
    descriptionLocalizations: {
        'sv-SE': 'Raderar X antal meddelanden',
        de: 'Löscht die Anzahl X von Nachrichten'
    },
    deferReply: 'ephemeral',
    legacy: 'both',
    permissions: [
        PermissionFlagsBits.ManageMessages
    ],
    options: [
        {
            name: 'amount',
            nameLocalizations: {
                'sv-SE': 'antal',
                de: 'menge',
            },
            description: 'Amount of messages to delete, between 1 and 99',
            descriptionLocalizations: {
                'sv-SE': 'Antal meddelanden att radera, mellan 1 och 99',
            },
            type: Option.Number,
            required: true
        },
        {
            name: 'target',
            nameLocalizations: {
                'sv-SE': 'mål',
                de: 'ziel',
            },
            description: 'User whose messages you want to delete.',
            descriptionLocalizations: {
                'sv-SE': 'Användare vars meddelanden du vill radera.',
            },
            type: Option.User,
        }
    ],
    async execute({ guild, args, channel }) {
        
        const clearAmount = args[0];
        const clearTarget = guild.members.cache.get(args[1]);
        
        if (isNaN(clearAmount) || clearAmount < 1 || clearAmount > 99) {
            return 'Please input a valid amount, will you?';
        }
        
        const messages = await channel.messages.fetch();
        
        const filtered = [];
        if(clearTarget) {
            let i = 0;
            messages.filter((msg) => {
                if(msg.author.id === clearTarget.id && clearAmount > i) {
                    filtered.push(msg);
                    i++;
                }
            });
        }

        const deleted = await channel.bulkDelete(filtered.length ? filtered : clearAmount, true);
        return `Deleted ${deleted.size} messages${clearTarget ? ` made by ${clearTarget}.` : '.'}`;
    }
}

