import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

const { SENDGRID_API_KEY } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);
/**
 * @class Mailer
 */
class Mailer {
  /**
   *
   * @param {object} to Recipient Email
   * @param {string} subject Email Subject
   * @param {string} content Email Content
   * @returns {function} returns a function
   */
  static sendMail(to, subject, content) {
    const message = {
      from: process.env.EMAIL,
      to,
      subject,
      html: html(subject, content)
    };
    return sgMail.send(message, (error, result) => {
      if (error) {
        //Do something with the error
        console.log(error)
      }
      else {
        //Celebrate
        console.log('success')
      }
    });

    // if (process.env.NODE_ENV !== 'test') {
    //   return sgMail.send(message);
    // }
    // return sgMail.send(message)
    //   .then(() => {
    //     //Celebrate
    //     console.log('success')
    //     return "success"
    //   })
    //   .catch(error => {
    //     //Log friendly error
    //     console.error(error.toString());
    //     //Extract error msg
    //     const {message, code, response} = error;
    //     return message;
    //     //Extract response msg
    //     const {headers, body} = response;
    //   });
  }

  static sendBroadcastMail(to, subject, html) {
    const message = {
      to,
      from: {
        email: "info@goldensofttech.com",
        name: "9to5Chick"
      },
      subject,
      html
    };


    return sgMail.sendMultiple(message);
    /*return sgMail.sendMultiple(message, (error, result) => {
      if (error) {
        //Do something with the error
        console.log(">>>>>>>>>>>>>", error.response.body )
      }
      else {
        //Celebrate
        console.log('success')
      }
    });*/
  };

  static sendEngagementMail(to, subject,  emailBody, adminPost, usersPost, announcementPost, eventPost) {
    const message = {
      to,
      /*from: {
        email: process.env.EMAIL,
        name: "9to5Chick"
      },*/
      from: {
        email: "info@goldensofttech.com",
        name: "9to5Chick"
      },
      subject,
      html: html(subject,  emailBody, adminPost, usersPost, announcementPost, eventPost)
    };

    return sgMail.sendMultiple(message);
    /*return sgMail.sendMultiple(message, (error, result) => {
      if (error) {
        //Do something with the error
        console.log(">>>>>>>>>>>>>", error.response.body )
      }
      else {
        //Celebrate
        console.log('success')
      }
    });*/
  };
}

const html = (subject,  emailBody, adminPost, usersPost, announcementPost, eventPost) => {

  const mappedAdminPost =  adminPost.map((eachItem) => {
    return `<div class="post__card">
        <img src=${eachItem.postImage} class="post__image" alt="PostImage" />
        <p>${eachItem.postText}</p>
        <p>
          For more details, <a href="https://app.9to5chick.com/" target="_blank" class="text_decoration">read more<a/>.
        </p>
    </div>`
  });

  const mappedAnnouncementPost =  announcementPost.map((eachItem) => {
    return `<div class="post__card">
        <h4>${eachItem.title}</h4>
        <p>${eachItem.message}</p>
        <p>
          For more details, <a href="https://app.9to5chick.com/" target="_blank" class="text_decoration">read more<a/>.
        </p>
    </div>`
  });

  const mappedEventPost =  eventPost.map((eachItem) => {
    return `<div class="post__card">
        <img src=${eachItem.eventBanner} class="post__image" alt="PostImage">
        <h4>${eachItem.title}</h4>
        <p>${eachItem.description}</p>
        <p>
          For more details, <a href="https://app.9to5chick.com/" target="_blank" class="text_decoration">read more<a/>.
        </p>
    </div>`
  });


  const nMappedAdminPost = (mappedAdminPost.length) ? (
    '<h3>Posts by Admin</h3>\n' + mappedAdminPost
  ) : '';

  const nMappedEventPost = (mappedEventPost.length) ? (
    '<h3>Events</h3>\n' + mappedEventPost
  ) : '';

  const nMappedAnnouncementPost = (mappedAnnouncementPost.length) ? (
    '<h3>Announcement</h3>\n' + mappedAnnouncementPost
  ) : '';

  return `
    <html lang="en">
      <head>
          <title>Email Verification</title> 
          <style>
              body {
                  width: 100%;
              }
              a {
                  color: #ff5900 !important;
                  text-decoration: none;
              }
              h3 {
                font-size: 24px;
                text-align: center;
                text-decoration: underline;
                color: #f8167f !important;
              }
              h4 {
                font-size: 20px;
                text-align: center;
                color: #f8167f !important;
              }
              p {
                  font-size: 16px;
                  text-align: justify;
              }
              .container {
                  margin: 0 auto;
                  width: 80%;
                  background-color: #ffffff;
                  color: #404040;
                  padding: 20px;
              }
              .text_gray {
                  color: gray;
              }
              .btn_custom {
                  color: #1382fc !important;
                  font-size: 18px;
                  font-weight: bold;
              }
              .text_decoration {
                  text-decoration: none;
                  color: #f8167f !important;
                  font-size: 14px;
              }
              .email__body {
                  color: gray;
                  font-size: 20px;
              }
              .post__card {
                border: 1px solid #cdcdcd;
                border-radius: 4px;
                font-size: 16px;
                padding: 10px;
              }
              .post__image {
                height: auto;
                width: 100%;
              }
          </style>   
      </head>
      
      <body>
          <div class="container">
                 <p class="email__body">${ emailBody }</p>
                 
                 <div>
                    ${nMappedAdminPost}
                 </div>
                 
                 <br />
                
                 <div>
                    ${nMappedEventPost}
                 </div>
                 
                 <br />
                 
                 <div>
                    ${nMappedAnnouncementPost}
                 </div>
                 
          <div>
      </body>    
    </html>   
  `
}


export default Mailer;
