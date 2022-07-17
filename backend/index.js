"use strict";
require("dotenv").config();
var path = require("path");

var cors = require("cors");

var db = require("./models/index");

const express = require("express");

const cron = require("node-cron");

const { auth } = require("./service/middlewares/index");

const { mailSender } = require("./service/mailSender");

const { checkStatusContinuous } = require("./service/ServerService");

var oas3Tools = require("oas3-tools");

var serverPort = process.env.PORT || 3000;

// swaggerRouter configuration
var options = {
  routing: {
    controllers: path.join(__dirname, "./controllers"),
  },
};

var expressAppConfig = oas3Tools.expressAppConfig(
  path.join(__dirname, "api/openapi.yaml"),
  options
);

var openApiApp = expressAppConfig.getApp();

const app = express();

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  express.urlencoded({
    extended: false,
  })
);


for (let i = 2; i < openApiApp._router.stack.length; i++) {
  app._router.stack.push(openApiApp._router.stack[i]);
}

db.connect();
//gui mail
cron.schedule(
  "0 14 15 * * *",
  () => {
    mailSender();
  },
  {
    scheduled: true,
    timezone: "Asia/Bangkok",
  }
);

cron.schedule("0 0 * * * *", () => {
  checkStatusContinuous();
});

// Initialize the Swagger middleware
app.listen(serverPort, function () {
  console.log(
    "Your server is listening on port %d (http://localhost:%d)",
    serverPort,
    serverPort
  );
  console.log(
    "Swagger-ui is available on http://localhost:%d/docs",
    serverPort
  );
});
