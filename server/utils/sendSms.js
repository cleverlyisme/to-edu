const client = require("twilio")(
    process.env.TWILIO_ACCOUNT_KEY,
    process.env.TWILIO_AUTH_TOKEN
);

module.exports = (to, body) =>
    client.messages.create({
        body,
        from: process.env.TWILIO_PHONE_NUMBER,
        to,
    });
