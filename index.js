const dotenv = require('dotenv');
dotenv.config();
const User = require('./config').users;
const formData = require('form-data');
const Mailgun = require('mailgun.js');


const mailgunFormData = new Mailgun(formData);
const mailgunClient = mailgunFormData.client({
  username: 'api',
  key:  `${process.env.MAILGUN_API_KEY}`,
});

exports.processNewUserMessage = async (event, context) => {
  console.log("trying");
  try {
    console.log("extracting message from pubsub");
    const pubSubmessage = event.data
      ? Buffer.from(event.data, 'base64').toString()
      : '{}';
    console.log("event.data:", event.data);
    console.log("pubSubmessage:", pubSubmessage);
    const payload = JSON.parse(pubSubmessage);
    console.log("payload:", payload);
    // const userEmailAddress = payload.username;
    // const userId=payload.id;
    const userId = payload.split(":")[0];
    const email = payload.split(":")[1];
    const verificationLink=`https://${process.env.EMAIL_DOMAIN}/verifyaccount?id=${userId}`;
    console.log(verificationLink);

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: [email],  
      subject: 'Email Verification',
      text: 'Please verify your email address.',
      html: `<p>Verify your email address: <a href="${verificationLink}">link</a></p>`,
    };


    const response = await mailgunClient.messages.create(process.env.DOMAIN, mailOptions);
    console.log('Email Succefully sent:', response);
    console.log('Email Succefully sent:', response);
    if (response.id) {
 
    //   const user = await User.findOne({ where: { username: userEmail } });
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
    } else {
      console.log('Email sending failed.');
    }
  } catch (error) {
    console.error('Failed to send email:', error);
  }
};
