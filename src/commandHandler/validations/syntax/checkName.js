const { ApplicationCommandType: Type } = require('discord.js');

module.exports = (command) => {
    const { commandObject: { type }, commandName } = command;

    const illegalChars = /[^-_\p{L}\p{N}\p{sc=Deva}\p{sc=Thai}]/u;
   
    if(commandName.length > 32) {
        throw new Error(commandName, 'The command name is too long. It needs to be between 1-32 characters long!');
    }
    if(commandName.length < 1) {
        throw new Error(commandName, 'The command name is too short. Please keep it between 1-32 characters!');
    }

    if (type === Type.Message || type === Type.User) return;

    if(illegalChars.test(commandName)) {
        throw new Error(commandName, 'The command name has characters in it which is not allowed by Discord API.');
    }
}