module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Goals', {
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
      goal_title: {
        allowNull: false,
        type: Sequelize.STRING
      },
      goal_description: {
        allowNull: true,
        type: Sequelize.STRING
      },
      actions: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      start_date: {
        allowNull: true,
        type: Sequelize.DATE
      },
      end_date: {
        allowNull: true,
        type: Sequelize.DATE
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Goals')
};