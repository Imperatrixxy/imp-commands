module.exports = (command) => {
    const { commandObject, commandName } = command;
    const { legacy } = commandObject;

    if( legacy && typeof legacy !== 'boolean' && legacy.toLowerCase() !== 'both' ) {
        throw new Error(
            `The "${commandName}" command has an invalid value for the "legacy" property. Please use a boolean value, or the string "both".`
        );
    }
}