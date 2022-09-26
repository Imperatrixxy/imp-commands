module.exports = (command) => {
    const { instance, commandName, commandObject } = command;

    if(commandObject.devOnly !== true || instance.devServers.length) return;
    
    throw new Error(`Command "${commandName}" is set as a developer only command, but no dev servers were specified.`);
}