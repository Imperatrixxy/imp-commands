module.exports = (command, usage) => {
    const {instance, commandObject } = command;
    const { user } = usage;

    const { botOwners } = instance;

    if (commandObject.ownerOnly && !botOwners.includes(user.id)) return false;

    return true;
}