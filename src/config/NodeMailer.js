// import nodemailer from 'nodemailer';

// let transport = nodemailer.createTransport({
//   host: 'smtp.mailtrap.io',
//   port: 2525,
//   auth: {
//      user: '49d4657c6c424d',
//      pass: '3d92a42cf586c9'
//   }
// });




// class NodeMailer {
//   static send(to, subject, content) {
//     const message = {
//       from: process.env.EMAIL,
//       to,
//       html: content,
//       subject
//     }

//     return transport.sendMail(message, function(err, info) {
//       if (err) {
//         console.log(err)
//       } else {
//         console.log(info);
//       }
//     })
//   }
// }

// export default NodeMailer;