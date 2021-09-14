const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const History = new Schema({
    serverId: {
        type: String,
        require: true,
        unique: true,
    },
    history: [{
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
    }, ]
})

module.exports = mongoose.model('history', History);