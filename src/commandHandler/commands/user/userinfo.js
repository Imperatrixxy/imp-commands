const { ApplicationCommandType, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    name: 'User Info',
    type: ApplicationCommandType.User,
    permission: [PermissionFlagsBits.ManageGuild],
    async execute({interaction, guild}) {
        const target = await guild.members.fetch(interaction.targetId);
        let { user } = target;
        await user.fetch();

        const targetRoles = target.roles.cache
            .filter((role) => role.id !== guild.id)
            .sort((a,b) => b.position - a.position)
            .map((role) => role.toString()).join(" ");

        const response = new EmbedBuilder()
            .setTitle(target.nickname ? target.nickname : user.tag)
            .setDescription(`<@${target.id}>`)
            .setColor(user.hexAccentColor ? user.hexAccentColor : '#0099FF')
            .setThumbnail(target.displayAvatarURL({ size: 512 }))
            .setImage(user.bannerURL({ size: 1024 }))
            .setFooter({ text: 'ID: ' + user.id })
            .addFields(
                { name: 'Member since', value: `<t:${parseInt(target.joinedTimestamp / 1000)}:R>`, inline: true },
                { name: 'Account created', value: `<t:${parseInt(user.createdTimestamp / 1000)}:R>`, inline: true },
                { name: 'User roles', value: `${targetRoles || "No assigned roles" }` },
            );

        if( target.nickname ) response.setAuthor( {name:user.tag, iconURL: user.avatarURL({ size: 512 }) });

        return { embeds: [response], ephemeral: true };
    }
}