module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Events', {
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
      type: {
        allowNull: true,
        type: Sequelize.STRING
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING
      },
      description: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      country: {
        allowNull: true,
        type: Sequelize.STRING
      },
      state: {
        allowNull: true,
        type: Sequelize.STRING
      },
      lga: {
        allowNull: true,
        type: Sequelize.STRING
      },
      location: {
        allowNull: true,
        type: Sequelize.STRING
      },
      paid_event: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      price: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      payment_link: {
        allowNull: true,
        type: Sequelize.STRING
      },
      event_date: {
        allowNull: false,
        type: Sequelize.DATE
      },
      start_time: {
        allowNull: true,
        type: Sequelize.STRING
      },
      end_time: {
        allowNull: true,
        type: Sequelize.STRING
      },
      cta: {
        allowNull: true,
        type: Sequelize.STRING
      },
      status: {
        allowNull: true,
        type: Sequelize.STRING
      },
      event_banner: {
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
  down: queryInterface => queryInterface.dropTable('Events')
};