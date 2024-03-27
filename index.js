const dotenv = require('dotenv');
dotenv.config();
const { PubSub } = require('@google-cloud/pubsub');
const { Pool } = require('pg');
const nodemailer = require('nodemailer');
const mailgun = require("mailgun-js");
const randomstring = require('randomstring');
const functions = require('@google-cloud/functions-framework');
const base64 = require('base-64');
const pubSubClient = new PubSub();
const User = require('./config').users;

const subscriptionName = 'verify_email-sub';
const subscription = pubSubClient.subscription(subscriptionName);

const mailgunClient = mailgun({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
});

async function sendVerificationEmail(pubsubMessage) {
    try{
        const messageData = JSON.parse(Buffer.from(pubsubMessage, 'base64').toString());
        console.log("Sending verification email...");
        console.log("messageData:", messageData);
        // const decoded = base64.decode(messageData.token);
        const userId = messageData.split(":")[0];
        const email = messageData.split(":")[1];
        console.log("userId:", userId);
        console.log("email:", email);
    
        const data = {
        from: "tarunsankhla21@gmail.com",
        to: "tarunsankhla21@gmail.com",
        subject: "Verify Your Email Address",
        text: `Click the link to verify your email address:` + `http://tarunsankhla.me:3000/verify-email?token=${pubsubMessage}`,
        };

        await User.update({
            verification_email_timestamp: new Date()
        }, {
            where: {
                id: userId
            }
        }).then(() => {
            logger.info("user updated");
            return res.status(204).send()
        }).catch((e) => {
            logger.trace("error:", e);
            logger.error("error:", e);
            return res.status(400).send();
        });
    
      await mailgunClient.messages().send(data);
      console.log("Verification email sent successfully.");
    } catch (error) {
      console.error("Error sending verification email:", error);
      throw new Error("Failed to send verification email");
    }
}

functions.cloudEvent('processNewUserMessage', cloudEvent => {
    console.log(cloudEvent.data);
    const pubsubMessage = cloudEvent.data.message.data;
   
    (async()=>{
        await sendVerificationEmail(pubsubMessage);
    })();
});
