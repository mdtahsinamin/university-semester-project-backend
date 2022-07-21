const client = require("twilio")(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendMessage = async (phoneNumber) => {
  console.log(phoneNumber);
  client.messages
    .create({
      body: "Your Order is delivered",
      from: "+18703002745",
      messagingServiceSid: "MGe585152384e3dbe0019f780b5717ed03",
      to: `+880${phoneNumber}`,
    })
    .then((message) => {
      res.status(200).json({
        success: true,
      });
    });
};

module.exports = sendMessage;
