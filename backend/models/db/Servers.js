const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Server = new Schema({
    IP: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    port: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('servers', Server);
