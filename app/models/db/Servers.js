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
    history: [
        {
        username_old: {
            type: String,
        },
        password_old: {
            type: String,
        },
        port_old: {
            type: String,
        },
        change_time: {
            type: Date,
            default: Date.now
        },
        status_old: {
            type: Boolean,
        }
    },

]
}, {
    timestamps: true
});

module.exports = mongoose.model('servers', Server);
