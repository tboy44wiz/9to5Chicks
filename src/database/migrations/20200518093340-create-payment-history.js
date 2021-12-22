module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('PaymentHistories', {
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
      event_id: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      reason: {
        allowNull: false,
        type: Sequelize.ENUM('registration', 'event')
      },
      amount: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      transaction_id: {
        allowNull: true,
        type: Sequelize.STRING
      },
      bank: {
        allowNull: true,
        type: Sequelize.STRING
      },
      customer_id: {
        allowNull: true,
        type: Sequelize.STRING
      },
      customer_email: {
        allowNull: true,
        type: Sequelize.STRING
      },
      reference: {
        allowNull: true,
        type: Sequelize.STRING
      },
      status: {
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('PaymentHistories')
};