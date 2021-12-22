module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Messages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      sender_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      recipent_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      text: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      image: {
        allowNull: true,
        type: Sequelize.STRING
      },
      status: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false
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
  down: queryInterface => queryInterface.dropTable('Messages')
};