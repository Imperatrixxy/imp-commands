const db = require('mongoose')
const CommandHandler = require('./commandHandler/CommandHandler');
const Cooldowns = require('./util/Cooldowns');
const EventHandler = require('./eventHandler/EventHandler');
const path = require('path');

class ImpCommands {
    constructor({
        client,
        mongoUri,
        commandsDir,
        events = {},
        devServers = [],
        botOwners = [],
        cooldownConfig = {},
        disableDefaultCommands = [],
        validations,
    }) {
        if (!client) {
            throw new Error('A client is required!');
        }
        this._devServers = devServers;
        this._botOwners = botOwners;
        this._cooldowns = new Cooldowns({
            instance: this,
            ...cooldownConfig
        });
        this._disableDefaultCommands = disableDefaultCommands.map(cmd => cmd.toLowerCase());
        
        this._validations = {};

        if (validations?.syntax){
            this._validations.syntax = path.join(process.cwd(), validations.syntax);
        }
        if (validations?.runtime) {
            this._validations.runtime = path.join(process.cwd(), validations.runtime);
        }

        if (mongoUri) {
            this.connectToMongo(mongoUri);
        }

        if (commandsDir) {
            this._commandHandler = new CommandHandler(
                this,
                path.join(process.cwd(), commandsDir),
                client
            );
        }

        this._eventHandler = new EventHandler(
            this,
            events,
            client
        );
    }

    get devServers() {
        return this._devServers;
    }

    get botOwners() {
        return this._botOwners;
    }

    get cooldowns() {
        return this._cooldowns;
    }

    get disableDefaultCommands() {
        return this._disableDefaultCommands;
    }

    get commandHandler() {
        return this._commandHandler;
    }

    get eventHandler() {
        return this._eventHandler;
    }

    get validations() {
        return this._validations;
    }

    connectToMongo(mongoUri) {
        db.connect(mongoUri, {
            keepAlive: true
        });
    }
}

module.exports.ImpCommands = ImpCommands;