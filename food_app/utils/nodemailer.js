// "use strict";
const nodemailer = require("nodemailer");
const secrete = require('../../secrete')

module.exports.sendEmail = async function sendEmail(str, data) {


    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            // TODO: replace `user` and `pass` values from <https://forwardemail.net>
            user: secrete.EMAIL_USER,
            pass: secrete.GMAIL_APP_PASSWORD
        }
    })

    var Osubject, Otext, Ohtml;

    if (str == 'signup') {
        Osubject = `Thanks for signup ${data.name}`
        Ohtml = `
        <h1>Welcome to foodapp.com</h1>
        <p>Hope you are doing great</p>
        <br>
        <h3>These are your details</h3>
        <p>Name :- ${data.name} </p>
        <p>Email :- ${data.email}</p>
        `
    } else if (str == 'resetPassword') {
        Osubject = `Reset Password`
        Ohtml = `
        <h1>foodapp.com</h1>
        <p>This is your password reset link</p>
        <a href="${data.resetPasswordLink}">Reset Password</a>
        `
    }

    const info = await transporter.sendMail({
        from: '"Food App 👻" <vermasuraj000008@gmail.com>', // sender address
        to: data.email, // list of receivers
        subject: Osubject, // Subject line
        text: Otext, // plain text body
        html: Ohtml // html body
    });

    console.log("Message sent: %s", info.messageId)
}