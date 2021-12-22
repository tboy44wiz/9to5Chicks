'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('EmailRoundUps', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      email_subject: {
        type: Sequelize.STRING
      },
      email_body: {
        type: Sequelize.STRING
      },
      scheduled: {
        type: Sequelize.STRING
      },
      year: {
        allowNull: true,
        type: Sequelize.STRING
      },
      month: {
        allowNull: true,
        type: Sequelize.STRING
      },
      day: {
        allowNull: true,
        type: Sequelize.STRING
      },
      hour: {
        allowNull: true,
        type: Sequelize.STRING
      },
      minute: {
        allowNull: true,
        type: Sequelize.STRING
      },
      emails: {
        allowNull: true,
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      admin_post: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      users_post: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      announcement_post: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      event_post: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'pending'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('EmailRoundUps');
  }
};
