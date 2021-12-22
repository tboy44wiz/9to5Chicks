module.exports = {
  up: (queryInterface, Sequelize) =>  queryInterface.createTable('Subscriptions', {
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
      plan_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      plan_code: {
        allowNull: true,
        type: Sequelize.STRING
      },
      customer_code: {
        allowNull: true,
        type: Sequelize.STRING
      },
      customer_id: {
        allowNull: true,
        type: Sequelize.STRING
      },
      amount: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      subscription_code: {
        allowNull: true,
        type: Sequelize.STRING
      },
      status: {
        allowNull: true,
        type: Sequelize.STRING
      },
      next_payment_date: {
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Subscriptions')
};