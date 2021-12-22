module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Announcements', {
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
      title: {
        allowNull: true,
        type: Sequelize.STRING
      },
      message: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      condition: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      link: {
        allowNull: true,
        type: Sequelize.STRING
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
  down: queryInterface => queryInterface.dropTable('Announcements')
};