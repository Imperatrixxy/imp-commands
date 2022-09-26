module.exports = (command) => {
    const { commandObject } = command;
    const { dmPermission } = commandObject;

    if(!dmPermission) return;

    if(
        typeof dmPermission !== 'boolean' ||
        typeof dmPermission !== 'null'
    ) {
        throw new Error(command.commandName, '"dmPermission" type needs to be either boolean or null');
    }
}