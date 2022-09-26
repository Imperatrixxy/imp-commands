module.exports = (command) => {
    const { commandName } = command;

    if(commandName.length > 32) {
        throw new Error(commandName, 'The command name is too long. It needs to be between 1-32 characters long!');
    }
    if(commandName.length < 1) {
        throw new Error(commandName, 'The command name is too short. Please keep it between 1-32 characters!');
    }
}