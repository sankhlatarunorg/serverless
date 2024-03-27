const dotenv = require('dotenv');
dotenv.config();
const { PubSub } = require('@google-cloud/pubsub');
const { Pool } = require('pg');
const mailgun = require("mailgun-js");
const functions = require('@google-cloud/functions-framework');
const base64 = require('base-64');
const pubSubClient = new PubSub();
const {v1} = require('@google-cloud/pubsub');
const subClient = new v1.SubscriberClient();
const User = require('./config').users;

const subscriptionName = 'verify_email-sub';
// const subscription = pubSubClient.subscription(subscriptionName);

const mailgunClient = mailgun({
    apiKey: "1bced3227e7a983b058f73bf7aee74cb-309b0ef4-daed13f6",
    domain: "mail.tarunsankhla.me"
});

async function sendVerificationEmail(pubsubMessage) {
    try {
        const messageData = JSON.parse(Buffer.from(pubsubMessage, 'base64').toString());
        console.log("Sending verification email...");
        console.log("messageData:", messageData);

        const userId = messageData.split(":")[0];
        const email = messageData.split(":")[1];
        console.log("userId:", userId);
        console.log("email:", email);

        const data = {
            from: "tarunsankhla21@gmail.com",
            to: email,
            subject: "Verify! Your Account at WebApp",
            text: `Click the link to verify your email address: ` + `http://tarunsankhla.me:3000/verifyaccount?token=${pubsubMessage}`,
        };

        await User.update({
            verification_email_timestamp: new Date()
        }, {
            where: {
                id: userId
            }
        }).then(() => {
            console.log("Verification email timestamp updated successfully.");
        }).catch((e) => {
            console.log("error:", e)
        });

        await mailgunClient.messages().send(data);
        console.log("Verification email sent successfully.");
    } catch (error) {
        console.error("Error sending verification email:", error);
        throw new Error("Failed to send verification email");
    }
}

async function synchronousPull(projectId, subscriptionNameOrId) {

    console.log(`projectId: ${projectId}`);
    console.log(`subscriptionNameOrId: ${subscriptionNameOrId}`);
    const formattedSubscription = subscriptionNameOrId.indexOf('/') >= 0
        ? subscriptionNameOrId
        : subClient.subscriptionPath(projectId, subscriptionNameOrId);

    console.log(`\nStart pulling messages from ${formattedSubscription}.`);

    const request = {
        subscription: formattedSubscription,
        maxMessages: 10,
    };
    console.log("request:", request);
    const [response] = await subClient.pull(request);

    console.log(`Received ${response.receivedMessages.length} messages.`);

    const ackIds = [];
    for (const message of response.receivedMessages || []) {
        console.log(`Received message: ${message.message.data}`);
        if (message.ackId) {
            ackIds.push(message.ackId);
        }
    }

    if (ackIds.length !== 0) {
        const ackRequest = {
            subscription: formattedSubscription,
            ackIds: ackIds,
        };
        console.log("ackRequest:", ackRequest);
        await subClient.acknowledge(ackRequest);
    }

    console.log('Done.');

}

functions.cloudEvent('processNewUserMessage', async (cloudEvent, context) => {
    console.log(cloudEvent.data);
    const pubsubMessage = cloudEvent.data.message.data;

    (async () => {
        await sendVerificationEmail(pubsubMessage);

        console.log("Acknowledging the message...");
        await synchronousPull("csye6225tarundev", "cloud_function_subscription");
        console.log("Message acknowledged successfully.");
        // console.log("context:", context);
        // const pubsubMessageId = context.eventId;
        // const pubsubTopic = context.resource.name;
        // console.log("pubsubMessageId:", pubsubMessageId);
        // console.log("pubsubTopic:", pubsubTopic);
        // const subscriptionName = pubsubTopic.substring(pubsubTopic.lastIndexOf('/') + 1);
        // console.log("subscriptionName:", subscriptionName);
        // const subscription = pubSubClient.subscription(subscriptionName);
        // console.log("subscription:", subscription);
        // await subscription.ack(pubsubMessageId);
    })();
});
