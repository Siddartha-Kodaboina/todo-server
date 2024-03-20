const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    // type: 'OAuth2',
    user: 'stevesiddu49@gmail.com',
    pass: 'vzxvgwdvjhpbodor',
  },
});

const sendEmail = async (to, subject, text) => {
    console.log("In send email");
  const mailOptions = {
    from: 'stevesiddu49@gmail.com',
    to,
    subject,
    text,
  };
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
