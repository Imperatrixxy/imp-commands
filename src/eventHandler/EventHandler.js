const { InteractionType } = require('discord.js')
const path = require('path');
const getFiles = require('../util/getFiles');

class EventHandler {
    _eventCallbacks = new Map();

    constructor(instance, events, client) {
        this._instance = instance;
        if(events?.dir) {
            this._eventsDir = path.join(process.cwd(), events.dir);
        } else this._eventsDir = undefined;
        this._client = client;

        delete events.dir;
        this._events = events;

        this._builtInEvents = {
            interactionCreate: {
                isButton: (interaction) => interaction.isButton(),
                isCommand: (interaction) =>
                    interaction.type === InteractionType.ApplicationCommand ||
                    interaction.type === InteractionType.ApplicationCommandAutocomplete,
                isContextMenu: (interaction) => interaction.isContextMenuCommand(),
            },
            messageCreate: {
                isHuman: (message) => !message.author.bot,
            },
            ready: {},
        }

        this.readFiles();
        this.registerEvents();
    }

    async readFiles() {
        const defaultEvents = getFiles(path.join(__dirname, './events'), true);
        const folders = this._eventsDir ? getFiles(this._eventsDir, true) : [];

        for (const folderPath of [ ...defaultEvents, ...folders ]) {
            const event = folderPath.split(/[\/\\]/g).pop();
            const files = getFiles(folderPath);

            const functions = this._eventCallbacks.get(event) || [];

            for (const file of files) {
                const isBuiltIn = !folderPath.includes(this._eventsDir);
                const func = require(file);
                const result = [func];

                const split = file.split(event)[1].split(/[\/\\]/g);
                const methodName = split[split.length - 2];
                
                if (
                    isBuiltIn &&
                    this._builtInEvents[event] &&
                    this._builtInEvents[event][methodName]
                ) {
                    result.push(this._builtInEvents[event][methodName]);
                } else if (this._events[event] && this._events[event][methodName]) {
                    result.push(this._events[event][methodName]);
                }

                functions.push(result);
            }

            this._eventCallbacks.set(event, functions);
        }
    }
    
    registerEvents() {
        const instance = this._instance;

        for (const eventName of this._eventCallbacks.keys()) {
            const functions = this._eventCallbacks.get(eventName);

            this._client.on(eventName, async function() {
                for (const [func, dynamicValidation] of functions) {
                    if (dynamicValidation && !(await dynamicValidation(...arguments))) {
                        continue;
                    }
                    func(...arguments, instance);
                }
            })
        }
    }
}

module.exports = EventHandler;