const dotenv = require('dotenv');
dotenv.config();
const { PubSub } = require('@google-cloud/pubsub');
const { Pool } = require('pg');
const nodemailer = require('nodemailer');
const mailgun = require("mailgun-js");
const randomstring = require('randomstring');
const functions = require('@google-cloud/functions-framework');

const pubSubClient = new PubSub();

const subscriptionName = 'verify_email-sub';
const subscription = pubSubClient.subscription(subscriptionName);

const mailgunClient = mailgun({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
});

// functions.http('hello-HTTP', (req, res) => {
//     console.log(req.body);
//     res.send(`Hello ${req.query.namehelloHttp || req.body.name || 'World'}!`);
// });

// functions.cloudEvent('myCloudEventFunction', cloudEvent => {
//     // Your code here
//     // Access the CloudEvent data payload via cloudEvent.data
//     console.log(cloudEvent.data);

//     (async()=>{
//         await sendVerificationEmail();
//     })();
// });
  
// subscription.on('message', async (message) => {
//     try {
//         console.log('Processing message:', message.data.toString());
//     //   await exports.handleNewUser(message);
//       message.ack();
//     } catch (error) {
//       console.error('Error processing message:', error);
//       message.nack();
//     }
// });

async function sendVerificationEmail() {
    const data = {
      from: "tarunsankhla21@gmail.com",
      to: "tarunsankhla21@gmail.com",
      subject: "Verify Your Email Address",
      text: `Click the link to verify your email address:`,
    };
  
    try {
      await mg.messages().send(data);
      console.log("Verification email sent successfully.");
    } catch (error) {
      console.error("Error sending verification email:", error);
      throw new Error("Failed to send verification email");
    }
}

functions.cloudEvent('processNewUserMessage', cloudEvent => {
console.log(cloudEvent.data);
(async()=>{
    await sendVerificationEmail();
})();
});

// functions.http('processNewUserMessage',async  (event, context) => {
//     // console.log("Request",JSON.stringify(req));
//     // const pubsubMessage = req.data;
//     // console.log('Processing new user message:', pubsubMessage);
  
//     // Parse the Pub/Sub message data (assuming it's in JSON format)
//     const user = JSON.parse(Buffer.from(event.message.data, 'base64').toString());
//     console.log('Processing new user message:', user);
//     const messageData = JSON.parse(Buffer.from(pubsubMessage, 'base64').toString());
  
//     console.log('Processing new user message:', messageData);
//     // Extract relevant information from the message
//     const userEmail = messageData.email;
//     const verificationLink = messageData.verification_link;
  
//     // Your logic to send verification email and log email sent in Cloud SQL
//     try {
//       await sendVerificationEmail(userEmail, verificationLink);
//     //   await logEmailSent(userEmail, verificationLink);
//       console.log('Verification email sent and logged successfully.');
//       res.send('Verification email sent and logged successfully.');
//     } catch (error) {
//       console.error('Error processing new user message:', error);
//       throw new Error('Failed to process new user message');
//     }
//   });
// exports.processNewUserMessage = async (event, context) => {
//     const pubsubMessage = event.data;
//     console.log('Processing new user message:', pubsubMessage);
  
//     // Parse the Pub/Sub message data (assuming it's in JSON format)
//     const messageData = JSON.parse(Buffer.from(pubsubMessage, 'base64').toString());
  
//     console.log('Processing new user message:', messageData);
//     // Extract relevant information from the message
//     const userEmail = messageData.email;
//     const verificationLink = messageData.verification_link;
  
//     // Your logic to send verification email and log email sent in Cloud SQL
//     try {
//       await sendVerificationEmail(userEmail, verificationLink);
//     //   await logEmailSent(userEmail, verificationLink);
//       console.log('Verification email sent and logged successfully.');
//     } catch (error) {
//       console.error('Error processing new user message:', error);
//       throw new Error('Failed to process new user message');
//     }
//   };
  

// const pool = new Pool({
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     host: `/cloudsql/${process.env.CLOUD_SQL_CONNECTION_NAME}`,
// });
