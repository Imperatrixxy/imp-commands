module.exports = (command) => {
    const { commandObject, commandName } = command;
    const { permissions } = commandObject;

    if(!permissions) return;

    if(!Array.isArray(permissions)) {
        throw new Error(
            `The 'permissions' value of "${commandName}" is not in an array.`
        );
    }

    for(const permission of permissions) {
        if (typeof permission !== 'bigint'){
            throw new Error(
                `"${permission}" in the 'permissions' property of "${commandName}" is not a valid permission.`
            );
        }
    }
}