module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Plans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: true,
        type: Sequelize.STRING
      },
      description: {
        allowNull: true,
        type: Sequelize.STRING
      },
      plan_code: {
        allowNull: true,
        type: Sequelize.STRING
      },
      plan_type: {
        allowNull: true,
        type: Sequelize.STRING
      },
      amount: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      interval: {
        allowNull: true,
        type: Sequelize.STRING
      },
      invoice_limit: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      currency: {
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Plans')
};