const {
    PermissionFlagsBits,
    ApplicationCommandOptionType: Type,
  } = require('discord.js');
  const requiredPermissions = require('../../models/reqPermSchema');
  
  const clearAllPermissions = 'Clear All Permissions';
  
  module.exports = {
    name: 'reqperms',
    description: 'Sets required permissions for legacy commands',
  
    legacy: false,
    guildOnly: true,
    disabled: false,
  
    options: [
      {
        name: 'command',
        description: 'The command to set permissions to',
        type: Type.String,
        required: true,
        autocomplete: true,
      },
      {
        name: 'permission',
        description: 'The permission to set for the command',
        type: Type.String,
        required: true,
        autocomplete: true,
      },
    ],
    permissions: [PermissionFlagsBits.Administrator],
    autocomplete: (_, command, arg) => {
      if (arg === 'command') {
        return [...command.instance.commandHandler.commands.keys()];
      } else if (arg === 'permission') {
        return [clearAllPermissions, ...Object.keys(PermissionFlagsBits)];
      }
    },
  
    async execute({ instance, guild, options }) {
      const commandName = options.getString('command');
      const permName = options.getString('permission');
      console.log(permName);
  
      const command = instance.commandHandler.commands.get(commandName);
      if (!command) return `The command "${commandName}" does not exist.`;
  
      const _id = `${guild.id}-${command.commandName}`;
  
      if (!permName) {
        const document = await requiredPermissions.findById(_id);
  
        const permissions =
          document && document.permissions?.length
            ? document.permissions.join(', ')
            : 'None.';
  
        return `Here are the permissions for "${commandName}": ${permissions}`;
      }
  
      if (permName === clearAllPermissions) {
        await requiredPermissions.deleteOne({ _id });
  
        return `The command "${commandName}" no longer requires any permissions.`;
      }

      const permission = BigInt(PermissionFlagsBits[permName]);
      console.log(permission);
  
      const alreadyExists = await requiredPermissions.findOne({
        _id, permissions: { $in: [permission], },
      });
  
      if (alreadyExists) {
        await requiredPermissions.findOneAndUpdate(
          { _id, }, { _id, $pull: { permissions: permission, }, }
        );
  
        return `The command "${commandName}" no longer requires the permission "${permission}"`;
      }
  
      await requiredPermissions.findOneAndUpdate(
        { _id, }, { _id, $addToSet: { permissions: permission, }, }, { upsert: true, }
      );
  
      return `The command "${commandName}" now requires the permission "${permission}"`;
    },
  }
  