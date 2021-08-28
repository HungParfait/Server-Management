require('dotenv').config()
const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@clusterstack.cyazk.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
        console.log('successfully connect to server')
    } catch (error) {
        console.log(error);
    }
}

module.exports = { connect };