import mailer from '../config/Mailer';
import NodeMailer from '../config/NodeMailer';
import template from './emailTemplate';
import db from '../database/models';

const { EmailNotification } = db;

/**
 * @class EmailNotifications
 */
class EmailNotifications {
  /**
   *
   * @param {object} req Request Object
   * @param {object} user User
   * @param {string} resetToken Reset Token
   * @returns {function} returns a function
   */
  static async sendPasswordResetMail(req, user, resetToken) {
    const dbMessage = await EmailNotification.findOne({ where: { type: 'resetPassword' }});
    const { message: resetMessage, image } = dbMessage;
    const subject = 'Password Recovery';
    const emailBody = `
      <h3 class="username">Hello ${user.firstName},</h3>
      <p class="message">
      ${resetMessage}
      </p>
      <a class="btn" href="http://${req.headers.host}/${resetToken}">
        Reset password
      </a>`;
    const content = template(subject, emailBody, image);
    mailer.sendMail(user.email, subject, content);
  }

  /**
   * @param {*} email
   * @param {*} link
   * @param {*} name
   * @returns {*} sends an email to a new user
   */
  static async signupEmail(email, link, name) {
    const dbMessage = await EmailNotification.findOne({ where: { type: 'signup' }});
    const { message: signupMessage, image } = dbMessage;
    const title = 'Welcome to 9to5Chick';
    const body = `<p>Dear ${name},</p>
    <p>
        Welcome to the 9to5chick inner circle! We are excited to have you! <br/><br/>
    
        9to5chick is a career development hub dedicated to equipping Africa’s most ambitious career women with the skills to thrive in the workplace. <br/><br/>
        
        We believe career women can shatter glass ceilings! Through a cocktail
        of savvy career development tools and resources we are giving women the tools
        to take the lead in developing careers they love. <br/><br/>
        
        We know you can’t do this alone, that’s why we have created an inner circle community to help you thrive in your career <br/><br/>
        
        In this community, you will not only receive amazing career tips and resources, but you will be able to build a real inner circle based on the things you enjoy doing every day! <br/><br/>
        
        To get you started, here’ s a list of things to do.
        <br/><br/><br/>
        <p class="info">
        5 Things to Do First <br/><br/>
        
        Complete your registration. Click Verify Account to confirm your email address <a href="${link}" target="_blank">Verify Account</a> If you have problems, please paste the above URL into your web browser.
        <br/><br/><br/>
        
        Pimp your profile. If you haven’t already, go to your Profile Page to add a mini-bio and a quick introduction. It should take you less than a minute and you’ll immediately start to see folks like you in your feed. Don't forget to upload your profile pictures. Meet members with the same primary profession and/interest by sharing what you do. <br/><br/>
        
        Post One Thing You’re Excited About Right Now. Sharing your first post is easy. Just, click on the feed section and write the one thing you’re most excited about and what you look forward to. <br/><br/>
        
        Explore Discovery. Our platform is easy to navigate. Find your tribe and squad by following the lifestyle categories that appeal to you. You can engage, ask questions and discuss based on the lifestyle topic. There are also webinars and career resources for you in the resources tab
        <br/><br/>

        Proud of being an ambitious achieving 9to5chick? Create your own digital flyer and share with your friends and network on social media too.
        <a href="https://getdp.co/9to5Chick" target="_blank">https://getdp.co/9to5Chick</a>
        <br/><br/>

        Please share this registration link within your network.  <a href="https://app.9to5chick.com/plan_page" target="_blank">https://app.9to5chick.com/plan_page</a>
        </p>
        See you in the app! <br/><br/>
        
        The 9to5chick welcome team
      </p>`;
    // <p class="message">Click the link below to confirm your registration</p>
    // <a class="btn" href="${link}">Confirm email</a>
    const message = template(title, body, image);
    mailer.sendMail(email, title, message);
    // NodeMailer.send(email, title, message)
  }

  static async activateAccount(email, link, name, password) {
    const dbMessage = await EmailNotification.findOne({ where: { type: 'activateMentor' }});
    const { message: activateMessage, image } = dbMessage;
    const title = 'Welcome to 9to5Chick';
    const body = `<p>Dear ${name},</p>
    <p class="message"> 
      <br/><br/>
      Thank you for being a supporter of the 9to5chick brand. 
      <br/><br/>
      We are grateful that we can count on your support as we transition to this new exciting phase of our journey.
      <br/><br/>
      To say thank you for all you have done for us, we are extending to you a 30day free membership to our platform.
      <br/><br/>
      We hope that you will enjoy every aspect of our app. We are super pleased to have you on board.
      <br/><br/>
      Login with your email and password: ${password}, remember to change your password. Click below to confirm your email address: <a href="${link}" target="_blank">Verify Account</a>.
      <br/><br/>
      If you have problems, please paste the above URL into your web browser. </p>`;
    const message = template(title, body, image);
    mailer.sendMail(email, title, message);
  }

    /**
   * @param {*} email
   * @param {*} firstName
   * @param {*} lastName
   * @param {*} anonymous
   * @returns {*} sends an email to a new user
   */
  static async inviteFriends(email, firstName, lastName, anonymous) {
    const dbMessage = await EmailNotification.findOne({ where: { type: 'invite' }});
    const { message: inviteMessage, image } = dbMessage;
    let title = 'A dear friend sends an invitation';
    if (anonymous === true){
      title = 'A dear friend sends an invitation';
    } else {
      title = `${firstName}  ${lastName} sends you an invitation`;
    }
    const body = `<p>
      Hello! We are thrilled to have you here.
      <br/><br/>
      Have you seen our massive career opportunity? We are specially inviting you to join our tribe of super women ready to shatter the glass ceiling and access savvy career development tools and resources.
      <br/><br/>
      We know you can’t do this alone, that’s why we are inviting you to our inner circle community to help you thrive in your career.
      <br/><br/>
      Join <a href="https://app.9to5chick.com/plan_page" target="_blank">here</a>.
      <br/><br/>
      See you in the app!
      <br/><br/>
      The 9to5chick welcome team
    `;
    const message = template(title, body, image);
    mailer.sendMail(email, title, message);
  }
}

export default EmailNotifications;
