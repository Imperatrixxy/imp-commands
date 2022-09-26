const { Schema, model, models } = require('mongoose');

const customCmdSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    response: {
        type: String,
        required: true
    }
});

const name = 'custom-commands';
module.exports = models[name] || model(name, customCmdSchema);