const path = require('path');

const getFiles = require('../util/getFiles');
const Command = require('./Command');
const SlashCommands = require('./SlashCommands');
const { cooldownTypes } = require('../util/Cooldowns');
const CustomCommands = require('./CustomCommands');
const { PermissionsBitField } = require('discord.js');

class CommandHandler {

    _commands = new Map();
    _validations = this.getValidations(
        path.join(__dirname, 'validations', 'runtime')
    );
    _customCommands = new CustomCommands(this);

    constructor(instance, commandsDir, client) {
        this._instance = instance;
        this._commandsDir = commandsDir;
        this._slashCommands = new SlashCommands(client);
        this._client = client;

        this._validations = [
            ...this._validations,
            ...this.getValidations(instance.validations?.runtime),
        ];
        
        this.readFiles();
    }

    get client() {
        return this._client;
    }

    get commands() {
        return this._commands;
    }

    get slashCommands() {
        return this._slashCommands;
    }

    get customCommands() {
        return this._customCommands;
    }

    async readFiles() {
        const defaultCommands = getFiles(path.join(__dirname, './commands'));
        const files = getFiles(this._commandsDir);
        const validations = [
            ...this.getValidations(path.join(__dirname, 'validations', 'syntax')),
            ...this.getValidations(this._instance.validations?.syntax),
        ];

        for (let file of [...defaultCommands, ...files]) {
            const commandObject = require(file);
            
            let fileName = file.split(/[\/\\]/).pop();
    
            let commandName = commandObject.name ? commandObject.name : fileName.split('.')[0];

            const command = new Command(this._instance, commandName, commandObject);

            const {
                nameLocalizations,
                description,
                descriptionLocalizations,
                devOnly,
                dmPermission = false,
                disabled,
                init = () => {}
            } = commandObject;

            if (disabled || this._instance.disableDefaultCommands.includes(commandName.toLowerCase())) {
                if (devOnly) {
                    for (const guildId of this._instance.devServers) {
                        this._slashCommands.delete(command.commandName, guildId);
                    }
                } else {
                    this._slashCommands.delete(command.commandName);
                }

                continue;
            }

            for (const validation of validations) {
                validation(command);
            }

            await init(this._client, this._instance);

            this._commands.set(commandName, command);

            let { defaultMemberPermissions } = commandObject;

            if(defaultMemberPermissions) {
                defaultMemberPermissions = new PermissionsBitField(defaultMemberPermissions);
            } else defaultMemberPermissions = new PermissionsBitField();

            const options = commandObject.options || this._slashCommands.createOptions(commandObject);

            if (devOnly === true) {
                for (const guildId of this._instance.devServers) {
                    this._slashCommands.create(
                        commandName,
                        nameLocalizations,
                        description,
                        descriptionLocalizations,
                        defaultMemberPermissions,
                        dmPermission,
                        options,
                        guildId
                    );
                }
            } else this._slashCommands.create(
                commandName,
                nameLocalizations,
                description,
                descriptionLocalizations,
                defaultMemberPermissions,
                dmPermission,
                options
            );

        }

    }

    async runCommand(command, args, interaction) {

        const { execute, cooldowns } = command.commandObject;
        const { guild, member, user } = interaction;

        const usage = {
            instance: command.instance,
            interaction,
            args,
            text: args.join(' '),
            guild,
            member,
            user,
         }

        for (const validation of this._validations) {
            if ( !await validation(command, usage) ) {
                return;
            }
        }

        if (cooldowns) {
            let cooldownType;

            for(const type of cooldownTypes) {
                if(cooldowns[type]) {
                    cooldownType = type;
                    break;
                }
            }

            const cooldownUsage = {
                cooldownType,
                userId: user.id,
                actionId: `command_${command.commandName}`,
                guildId: guild?.id,
                duration: cooldowns[cooldownType],
                errorMessage: cooldowns.errorMessage
            }

            const result = this._instance.cooldowns.canRunAction(cooldownUsage);

            if (typeof result === 'string') return result;

            await this._instance.cooldowns.start(cooldownUsage);

            usage.cancelCooldown = () => {
                this._instance.cooldowns.cancelCooldown(cooldownUsage);
            }

            usage.updateCooldown = (expires) => {
                this._instance.cooldowns.updateCooldown(cooldownUsage, expires);
            }
        }

        return await execute(usage);
    }

    getValidations(folder) {
        if (!folder) return [];

        const validations = getFiles(folder)
            .map( (filePath) => require(filePath) );
        
        return validations;
    }
}

module.exports = CommandHandler;