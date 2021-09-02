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
      user: 'hungnd@bluecyber.vn', // generated ethereal user
      pass: 'HungSuccess', // generated ethereal password
    },
  });

  var message = {
    from: "hungnd@bluecyber.vn",
    to: "hung.nd181507@sis.hust.edu.vn",
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
