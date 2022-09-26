const { cooldownTypes } = require('../../../util/Cooldowns');

module.exports = (command) => {
    const { commandObject, commandName } = command;

    if (!commandObject.cooldowns) return;

    let counter = 0;
    for (const type of cooldownTypes) {
        if(commandObject.cooldowns[type]) ++counter;
    }

    if (counter === 0) {
        throw new Error(
            `The "${commandName}" command does have a cooldown object, but no cooldown types were specified. Please provide one of the following: ${cooldownTypes}.`
        );
    }

    if (counter > 1) {
        throw new Error(
            `The "${commandName}" command has multiple cooldown types. There can be only one.`
        );
    }
}