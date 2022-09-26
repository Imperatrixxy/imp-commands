module.exports = (command, usage) => {
    const {instance, commandObject } = command;
    const { guild } = usage;

    if (commandObject.devOnly !== true) return true;

    return instance.devServers.includes(guild?.id);
}