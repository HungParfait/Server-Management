require('dotenv').config()
const redis = require("redis");
const { promisify } = require("util");

const redisClient = redis.createClient(
  {
    url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`
}
);

redisClient.on("error", function(error) {
  console.error(error);
});

const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.setex).bind(redisClient);

module.exports = { redisClient, getAsync, setAsync }