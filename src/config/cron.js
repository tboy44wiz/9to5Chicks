import schedule from 'node-schedule';
import cron from 'node-cron';
import db from '../database/models';
import Response from '../helpers/Response';
import mailer from './Mailer';

const {
  CronTask,
  EmailRoundUp,
} = db;

/*const cronScheduler = () => {
  // var date = new Date(2020, 8, 5, 16, 5, 0);

  const j = schedule.scheduleJob("2 * * * *", function(){
    console.log('Go to db and confirm tasks');
  });
  return j
};*/

const cronReminder = () => {
  return cron.schedule('*/5 * * * *', async() => {
    console.log('running a task 5 minutes');

    //  Find all records in the CronTask table that has a status of "pending" and trigger cron task on them.
    const cronTask = await CronTask.findAll({
      raw: true,
      where: {
        status: "pending",
      }
    });

    if (!cronTask.length) {
      return console.log("No scheduled task found.")
    }

    cronTask.map((mTask) => {
      //  Send Mail.
      cron.schedule(`${mTask.minute} ${mTask.hour} ${mTask.day} * *`, () => {
        //const content = template(subject, html || null);
        mailer.sendBroadcastMail(mTask.emails, mTask.subject, mTask.html)
          .then(r => {
            const statusUpdated = CronTask.update(
              { status: "completed" },
              { where: { id: mTask.id } }
            );

            if (!statusUpdated) {
              return console.log("Error!, updating Broadcast Mail.");
            }
          })
          .catch((error) => {
            return console.log("Failed to send mail.");
          })
      });

      console.log('Mail Notifications sent successfully');
    });




    const emailRoundUps = await EmailRoundUp.findAll({
      raw: true,
      where: {
        status: "pending",
      }
    });

    if (!emailRoundUps.length) {
      return console.log("No scheduled task found.")
    }

    emailRoundUps.map((mTask) => {
      //  Send Mail.
      cron.schedule(`${mTask.minute} ${mTask.hour} ${mTask.day} * *`, () => {

        mailer.sendEngagementMail(mTask.emails, mTask.emailSubject, mTask.emailBody, mTask.adminPost, mTask.usersPost, mTask.announcementPost, mTask.eventPost)
          .then(r => {
            const statusUpdated = CronTask.update(
              { status: "completed" },
              { where: { id: mTask.id } }
            );

            if (!statusUpdated) {
              return console.log("Error!, updating Broadcast Mail.");
            }
          })
          .catch((error) => {
            return console.log("Failed to send mail.");
          });
      });

      console.log('Mail Notifications sent successfully');
    });

  });
}

/*module.exports = {
  cronScheduler,
  cronReminder,
};*/
export default cronReminder;
