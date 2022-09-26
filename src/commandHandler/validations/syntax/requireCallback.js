module.exports = (command) => {
    const { commandObject, commandName } = command;

    if(!commandObject.execute) {
        throw new Error(`The "${commandName}" command is missing an execute function.`);
    }
}