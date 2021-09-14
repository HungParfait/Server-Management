require('dotenv').config()
const nodemailer = require('nodemailer')

const path = require('path')
const {
  createXLSXfile
} = require('./OthersService')

exports.mailSender = async function () {
  createXLSXfile()

  let transporter = nodemailer.createTransport({
    host: "smtp.dreamhost.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL, // generated ethereal user
      pass: process.env.PASSWORD, // generated ethereal password
    },
  });

  var message = {
    from: process.env.FROM,
    to: process.env.TO,
    subject: "Server Management Daily Report",
    html: '<p>Server Management</p>',
    attachments: [{ 
      filename: 'server.xlsx',
      path: path.join(__dirname, '../public/server.xlsx')
    }, ]
  };

  let info = await transporter.sendMail(message)
  return info 
}
