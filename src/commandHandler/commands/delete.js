const { CommandInteraction, PermissionFlagsBits, ApplicationCommandOptionType: Type } = require('discord.js');

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
    defaultMemberPermissions: [
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
            type: Type.Number,
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
            type: Type.User,
        }
    ],
    /**
     * 
     * @param {CommandInteraction} interaction
     */
    async execute({ interaction }) {
        const clearAmount = interaction.options.getNumber('amount');
        const clearTarget = interaction.options.getMember('target');
        const { channel } = interaction;
        
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

