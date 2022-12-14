const customCmdSchema = require('../models/customCmdSchema');

class CustomCommands {
    _customCommands = new Map();

    constructor(commandHandler) {
        this._commandHandler = commandHandler;
        this.loadCommands();
    }

    async loadCommands() {
        const results = await customCmdSchema.find({});

        for (const result of results) {
            const {_id, response } = result;
            this._customCommands.set(_id, response);
        }
    }

    async create(guildId, commandName, description, response) {
        const _id = `${guildId}-${commandName}`;

        this._customCommands.set(_id, response);

        this._commandHandler.slashCommands.create(commandName, null, description, null, [], guildId);

        await customCmdSchema.findOneAndUpdate({
            _id
        },{
            _id,
            response
        },{
            upsert: true
        });
    }

    async delete(guildId, commandName) {
        const _id = `${guildId}-${commandName}`;
        this._customCommands.delete(_id);
        this._commandHandler.slashCommands.delete(commandName, guildId);
        await customCmdSchema.deleteOne({_id});
    }

    async run(commandName, interaction) {
        const { guild } = interaction;
        if (!guild) return;

        const _id = `${guild.id}-${commandName}`;
        const response = this._customCommands.get(_id);
        if (!response) return;

        interaction.reply(response).catch(() => {});
    }
}

module.exports = CustomCommands;