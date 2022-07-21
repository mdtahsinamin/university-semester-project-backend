const formData = require("form-data");
const Mailgun = require("mailgun.js");

const sendMail = async (options) => {
  const API_KEY = process.env.SMTP_API_KEY;
  const DOMAIN = process.env.SMTP_DOMAIN;

  const mailgun = new Mailgun(formData);
  const client = mailgun.client({ username: "api", key: API_KEY });

  const messageData = {
    from: process.env.SMTP_USER,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  client.messages
    .create(DOMAIN, messageData)
    .then((res) => {})
    .catch((err) => {});
};

module.exports = sendMail;
