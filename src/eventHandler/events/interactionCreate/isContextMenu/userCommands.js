module.exports = async (interaction, instance) => {
    const { commandHandler } = instance;
    const { commands } = commandHandler;

    const command = commands.get(interaction.commandName.toLowerCase());

    if(!command) return;

    const { deferReply } = command.commandObject;

    if (deferReply) {
        await interaction.deferReply({
            ephemeral: deferReply === 'ephemeral'
        });
    }

    const response = await commandHandler.runCommand(
        command,
        [],
        interaction
    );

    if (!response) return;
    
    if (deferReply) {
        interaction.editReply(response).catch(() => {});
    } else {
        interaction.reply(response).catch(() => {});
    }
}