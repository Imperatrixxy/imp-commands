const { EmbedBuilder, PermissionFlagsBits, ApplicationCommandOptionType: Type } = require('discord.js');

module.exports = {
    name: 'post',
    disabled: true,
    deferReply: 'ephemeral',
    description: 'Post a message from JSON data',
    permissions: [
        PermissionFlagsBits.ManageMessages,
    ],
    options: [
        {
            name: 'data',
            description: 'Pass in the JSON object here',
            type: Type.String,
            required: true,
        },
    ],
    async execute ({channel, interaction, options }) {

        const embedData = options.getString('data');

        try {
            const json = JSON.parse(embedData);
            channel.send({ embeds: [json] });
        } catch(error) {
            const errorEmbed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription("Something was wrong with your JSON code...")
                .addFields(
                    { name: 'JSON Code', value: embedData, inline: false },
                    { name: 'Error', value: error.message, inline: false }
                );
            interaction.editReply({ embeds: [errorEmbed] });
            return;
        }
        return "Done!";
    }
}