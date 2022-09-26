module.exports = (command) => {
    const { commandObject, commandName } = command;
    const { deferReply } = commandObject;

    if( deferReply && typeof deferReply !== 'boolean' && deferReply !== 'ephemeral' ) {
        throw new Error(
            `The "${commandName}" command has an invalid value for the "deferReply" property. Please use a boolean value, or the string "ephemeral".`
        );
    }
}