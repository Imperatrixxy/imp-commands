const path = require('path');

const getFiles = require('../util/getFiles');
const Command = require('./Command');
const SlashCommands = require('./SlashCommands');
const { cooldownTypes } = require('../util/Cooldowns');
const CustomCommands = require('./CustomCommands');
const { PermissionsBitField } = require('discord.js');
const PrefixHandler = require('./PrefixHandler');

class CommandHandler {

    _commands = new Map();
    _validations = this.getValidations(
        path.join(__dirname, 'validations', 'runtime')
    );
    _prefixes = new PrefixHandler();
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

    get prefixHandler() {
        return this._prefixes;
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
                type,
                description,
                descriptionLocalizations,
                devOnly,
                permissions,
                dmPermission = false,
                disabled,
                legacy,
                aliases = [],
                init = () => {}
            } = commandObject;

            if (disabled || this._instance.disableDefaultCommands.includes(commandName.toLowerCase())) {
                if(!legacy || legacy.toLowerCase() === 'both'){
                    if (devOnly) {
                        for (const guildId of this._instance.devServers) {
                            this._slashCommands.delete(command.commandName, guildId);
                        }
                    } else {
                        this._slashCommands.delete(command.commandName);
                    }
                }

                continue;
            }

            for (const validation of validations) {
                validation(command);
            }

            await init(this._client, this._instance);

            const names = [command.commandName, ...aliases];

            for (const name of names) {
                this._commands.set(name, command);
            }

            if (!legacy || legacy.toLowerCase() === 'both') {
                let defaultMemberPermissions;

                if(permissions) {
                    defaultMemberPermissions = new PermissionsBitField(permissions);
                } else defaultMemberPermissions = new PermissionsBitField();

                const options = commandObject.options || this._slashCommands.createOptions(commandObject);

                if (devOnly === true) {
                    for (const guildId of this._instance.devServers) {
                        this._slashCommands.create(
                            commandName,
                            nameLocalizations,
                            type,
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
                    type,
                    description,
                    descriptionLocalizations,
                    defaultMemberPermissions,
                    dmPermission,
                    options
                );
            }
        }

    }

    async runCommand(command, args, interaction, message) {

        const { execute, cooldowns, legacy } = command.commandObject;

        if(message && legacy === false) return;
        
        const guild = message ? message.guild : interaction?.guild;
        const member = message ? message.member : interaction?.member;
        const user = message ? message.user : interaction?.user;
        const channel = message ? message.channel : interaction?.channel;
        const options = interaction ? interaction.options : null;


        const usage = {
            instance: command.instance,
            client: this._client,
            interaction,
            message,
            args,
            text: args.join(' '),
            guild,
            member,
            user,
            channel,
            options
         }

        for (const validation of this._validations) {
            if (!(await validation(command, usage, this._prefixes.get(guild?.id)))) {
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