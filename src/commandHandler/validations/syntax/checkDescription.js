module.exports = (command) => {
    const { commandObject: { description }, commandName } = command;

    if(!description) {
        throw new Error(commandName, `The command is missing a description. Please provide one!`);
    }

    if(description.length > 100) {
        throw new Error(commandName, `The command description is too long. It needs to be between 1-100 characters long!`);
    }

    if(description.length < 1) {
        throw new Error(commandName, 'The command description is too short. It needs to be between 1-100 characters long!');
    }

}