// // // import nodemailer from "nodemailer"

// // // const transporter = nodemailer.createTransport({
// // //   service:"gmail",
// // //   host: "smtp.gmail.com",
// // //   port: 587,
// // //   secure: false,
// // //   socketTimeout:false,
// // //   auth: {
// // //     user: "ahsananees709@gmail.com",
// // //     pass: "reugafcnzaldijfn",
// // //     },
// // //     tls:{
// // //         rejectUnAuthorized:true
// // //     }
// // // });

// // // // async..await is not allowed in global scope, must use a wrapper
// // // async function emailSend(subject, text, html, to) {

// // //   // send mail with defined transport object
// // //   const info = await transporter.sendMail({
// // //     // from: '"Ahsan Anees 👻" <ahsananees709@gmail.com>', // sender address
// // //     // to: "ahsan.flower1@gmail.com", // list of receivers
// // //     // subject: "Hello ✔", // Subject line
// // //     // text: "Hello world?", // plain text body
// // //     // html: "<b>Hello world?</b>", // html body
// // //     from: from || '"Ahsan Anees 👻" <ahsananees709@gmail.com>',
// // //     to: to || "ahsan.flower1@gmail.com",
// // //     subject: subject || "Hello ✔",
// // //     text: text || "Hello world?",
// // //     html: html || "<b>Hello world?</b>",
// // //   });

// // //   console.log("Message sent: %s", info.messageId);
// // //   // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
// // // }

// // // // main().catch(console.error);

// // // export default emailSend

// // import nodemailer from "nodemailer";

// // // Function to send email
// // async function sendEmail(subject, text, html, from, to) {
// //   // Create a transporter using nodemailer
// //   const transporter = nodemailer.createTransport({
// //     service:"gmail",
// //     host: "smtp.gmail.com",
// //     port: 587,
// //     secure: false,
// //     socketTimeout:false,
// //     auth: {
// //       user: "ahsananees709@gmail.com",
// //       pass: "reugafcnzaldijfn",
// //       },
// //       tls:{
// //           rejectUnAuthorized:true
// //       }
// //   });

// //   try {
// //     // Send mail with defined transport object
// //     const info = await transporter.sendMail({
// //       from: from || '"Ahsan Anees 👻" <ahsananees709@gmail.com>',
// //       to: to || "ahsan.flower1@gmail.com",
// //       subject: subject || "Hello ✔",
// //       text: text || "Hello world?",
// //       html: html || "<b>Hello world?</b>",
// //     });

// //     console.log("Message sent: %s", info.messageId);
// //     return info;
// //   } catch (error) {
// //     console.error("Error sending email:", error);
// //     throw error;
// //   }
// // }

// // sendEmail()

// import nodemailer from "nodemailer"

// const transporter = nodemailer.createTransport({
//   service:"gmail",
//   // host: "smtp.gmail.com",
//   port: 465,
//   secure: true,
//   logger: true,
//   debug: true,
//   secureConnection:false,
//   // socketTimeout:false,
//   auth: {
//     user: "ahsananees709@gmail.com",
//     pass: "reugafcnzaldijfn",
//     },
//     tls:{
//         rejectUnAuthorized:true
//     }
// });

// // async..await is not allowed in global scope, must use a wrapper
// async function main(subject,text,html,to) {

//   // send mail with defined transport object
//   const info = await transporter.sendMail({
//     from: '"Ahsan Anees 👻" <ahsananees709@gmail.com>', // sender address
//     to: to|| "ahsan.flower1@gmail.com", // list of receivers
//     subject:subject|| "Hello ✔", // Subject line
//     text:text|| "Hello world?", // plain text body
//     html:html|| "<b>Hello world?</b>", // html body
//   });

//   console.log("Message sent: %s", info.messageId);
//   // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
// }

// await main("Welcome to Our Platform", `Hello Ahsan`, `<p>Hello Ahsan Anees</p><p>Thank you for registering with us!</p><p>Your OTP for registration is <strong> 546783</strong>.</p>`, "ahsan.flower1@gmail.com");

// // main().catch(console.error);


// Use at least Nodemailer v4.1.0
import nodemailer from "nodemailer"

// Generate SMTP service account from ethereal.email
nodemailer.createTestAccount((err, account) => {
    if (err) {
        console.error('Failed to create a testing account. ' + err.message);
        return process.exit(1);
    }

    console.log('Credentials obtained, sending message...');

    // Create a SMTP transporter object
    let transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
      secure: account.smtp.secure,
          logger: true,
  debug: true,
      socketTimeout: 300000,
        auth: {
            user: account.user,
            pass: account.pass
        }
    });

    // Message object
    let message = {
        from: 'Sender Name <ahsananees709@gmail.com>',
        to: 'Recipient <ahsan.flower1@gmail.com>',
        subject: 'Nodemailer is unicode friendly ✔',
        text: 'Hello to myself!',
        html: '<p><b>Hello</b> to myself!</p>'
    };

    transporter.sendMail(message, (err, info) => {
        if (err) {
            console.log('Error occurred. ' + err.message);
            return process.exit(1);
        }

        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
});