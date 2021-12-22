module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('MenteeApplications', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      question1: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      question2: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      question3: {
        allowNull: true,
        type: Sequelize.TEXT
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
    }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('MenteeApplications')
};