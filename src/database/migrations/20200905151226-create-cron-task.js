'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('CronTasks', {
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
      subject: {
        type: Sequelize.STRING
      },
      html: {
        type: Sequelize.TEXT
      },
      type: {
        type: Sequelize.ARRAY(Sequelize.STRING)
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
      status: {
        type: Sequelize.STRING,
        defaultValue: 'pending'
      },
      scheduled: {
        type: Sequelize.STRING
      },
      emails: {
        allowNull: true,
        type: Sequelize.ARRAY(Sequelize.STRING)
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
    return queryInterface.dropTable('CronTasks');
  }
};
