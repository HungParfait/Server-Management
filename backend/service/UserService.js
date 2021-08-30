'use strict';

require('dotenv').config()

const User = require('../models/db/Users');

const jwt = require('jsonwebtoken')

const bcrypt = require('bcryptjs');

var utils = require('../utils/writer')


/**
 * Used to log in a user
 * Used to log in a user
 *
 * email String email
 * password String password for login
 * returns Success
 **/
exports.userLoginPOST = async function (email, password) {
  try {
    const user = await User.findOne({
      email: email
    })
    
    if (!user) {
      return utils.respondWithCode(404, {
        code: 404,
        message: 'User do not exist'
      });
    } else {
      const isPassCorrect = bcrypt.compareSync(password, user.password);

      if (!isPassCorrect) {
        return utils.respondWithCode(404, {
          code: 404,
          message: 'Incorrect Password'
        });
      }

      const token = jwt.sign({
        _id: user._id
      }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '2h'
      });

      const obj = {
        username: user.user_name,
        email: user.email,
        token
      }
      return utils.respondWithCode(200, obj)

    }
  } catch (error) {
    return utils.respondWithCode(500, error);
  }
}


/**
 * register users
 *
 * body User_register_body 
 * returns Success
 **/
exports.userRegisterPOST = async function (body) {
  const {
    email,
    password,
    username
  } = body

  try {
    const user = await User.findOne({
      email: email
    })
    if (user) {
      return utils.respondWithCode(403, {
        code: 403,
        message: 'Existing User'
      });
    }

    const hashPassword = bcrypt.hashSync(password, 12);

    const newUser = new User({
      user_name: username,
      email: email,
      password: hashPassword,
    });
    await newUser.save();

    const token = jwt.sign({
      _id: newUser._id
    }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '2h'
    });

    const obj = {
      username: newUser.user_name,
      email: newUser.email,
      token
    }
    return utils.respondWithCode(200, obj)

  } catch (error) {

    return utils.respondWithCode(500, error);
  }
}