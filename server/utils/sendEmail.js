const nodemailer = require("nodemailer");

module.exports = ({ to, from, subject, text, html }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.APP_EMAIL,
      pass: process.env.APP_PASSWORD,
    },
    from: {
      name: "ToEdu App",
      address: "admin@toedu.app",
    },
  });

  const mailOptions = {
    from: {
      name: "ToEdu School",
      address: "admin@toedu.app",
    },
    to,
    subject,
    text,
    html,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      throw new Error("Coudn't send email: " + error);
    }
    return info.response;
  });
};
