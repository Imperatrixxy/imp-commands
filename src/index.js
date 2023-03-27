const db = require('mongoose');
const CommandHandler = require('./commandHandler/CommandHandler');
const Cooldowns = require('./util/Cooldowns');
const EventHandler = require('./eventHandler/EventHandler');
const path = require('path');
const replyType = require('./util/replyType');
const isLegacy = require('./util/isLegacy');
const FeatureHandler = require('./util/FeatureHandler');

class ImpHandler {
    constructor(stuff) {
        this.init(stuff)
    }

    async init({
        client,
        mongoUri,
        commandsDir,
        featuresDir,
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
            await this.connectToMongo(mongoUri);
        }

        if (commandsDir) {
            this._commandHandler = new CommandHandler(
                this,
                path.join(process.cwd(), commandsDir),
                client
            );
        }

        if (featuresDir) {
            new FeatureHandler(
                this,
                path.join(process.cwd(), featuresDir),
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

    async connectToMongo(mongoUri) {
        await db.connect(mongoUri, {
            keepAlive: true
        });
    }
}

module.exports = ImpHandler;
module.exports.replyType = replyType;
module.exports.isLegacy = isLegacy;