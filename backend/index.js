'use strict';
require('dotenv').config()
var path = require('path');

var cors = require('cors')

var db = require('./models/index')

const express = require('express')

const cron = require('node-cron')

const {
    auth
} = require('./service/middlewares/index')

const {
    mailSender
} = require('./service/mailSender')

const { checkStatusContinuous } = require('./service/ServerService')

var oas3Tools = require('oas3-tools');

var serverPort = process.env.PORT || 3000;

// swaggerRouter configuration
var options = {
    routing: {
        controllers: path.join(__dirname, './controllers')
    },
};

var expressAppConfig = oas3Tools.expressAppConfig(path.join(__dirname, 'api/openapi.yaml'), options);

var openApiApp = expressAppConfig.getApp();

const app = express();

app.use(cors());

app.use(express.urlencoded({
    extended: false
}))

app.use(express.json())

app.use(express.static(path.join(__dirname, '/public/dist')))

app.get('/', (req, res) => {
    res.redirect('/login')
})

app.get('/view-server', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/dist/index.html'))
})

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/dist/index.html'))
})

app.get('/view-history/:id', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/dist/index.html'))
})

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/dist/index.html'))
})

app.use('/server', auth)

app.use('/check', auth)

app.use('/exportCSV', auth)

for (let i = 2; i < openApiApp._router.stack.length; i++) {
    app._router.stack.push(openApiApp._router.stack[i]);
}

db.connect()

cron.schedule('0 0 10 * * *', () => {
    mailSender()
}, {
    scheduled: true,
    timezone: "Asia/Bangkok"
})

cron.schedule('0 0 * * * *', () => {
    checkStatusContinuous()
})

// Initialize the Swagger middleware
app.listen(serverPort, function () {
    console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
    console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
});