require('dotenv').config()
const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect(process.env.DB_CONNECTION_STRING || 'mongodb://localhost:27017/ServerManagement', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
        console.log('successfully connect to db')
    } catch (error) {
        console.log(error);
    }
}

module.exports = { connect }