module.exports = (command) => {
    const { commandObject, commandName } = command;
    const { defaultMemberPermissions } = commandObject;

    if(!defaultMemberPermissions) return;

    if(!Array.isArray(defaultMemberPermissions)) {
        throw new Error(
            `The 'defaultMemberPermissions' value of "${commandName}" is not in an array.`
        );
    }

    for(const permission of defaultMemberPermissions) {
        if (typeof permission !== 'bigint'){
            throw new Error(
                `"${permission}" in the 'defaultMemberPermissions' property of "${commandName}" is not a valid permission.`
            );
        }
    }
}