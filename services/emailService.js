const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    // type: 'OAuth2',
    user: process.env.REMAINDER_EMAIL_USERNAME,
    pass: process.env.REMAINDER_EMAIL_PASSWORD,
  },
});

// const sendEmail = async (to, subject, text) => {
//     console.log("In send email");
//   const mailOptions = {
//     from: 'stevesiddu49@gmail.com',
//     to,
//     subject,
//     text,
//   };
//   await transporter.sendMail(mailOptions);
// };
const sendEmail = async (to, subject, html) => {
    const mailOptions = {
      from: 'stevesiddu49@gmail.com',
      to,
      subject,
      html,
    };
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
