module.exports = (command) => {
    const { instance, commandName, commandObject } = command;
  
    if (commandObject.ownerOnly !== true || instance.botOwners.length) {
      return;
    }
  
    throw new Error(`"${commandName}" is a owner only command, but no owners were specified.`);
  }
  