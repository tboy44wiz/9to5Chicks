module.exports = {
  up: queryInterface => queryInterface.bulkInsert('EmailNotifications', [
    {
      type: 'signup',
      message: 'Thanks for getting started with 9to5chick! We need a little more information to complete your registration, including confirmation of your email address.'
    },
    {
      type: 'resetPassword',
      message: 'Someone(hopefully you), requested a password reset for your Barefoot-Nomad account. Kindly click on the button below to reset password.'
    },
    {
      type: 'activateMentor',
      message: 'Thanks for accepting been a mentor.'
    },
    {
      type: 'invite',
      message: 'Join 9to5chick community and make connections.'
    },
  ]),
  down: queryInterface => queryInterface.bulkDelete('EmailNotifications', null, {})
};