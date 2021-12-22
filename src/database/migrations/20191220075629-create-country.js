module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Countries', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      iso: {
        allowNull: true,
        type: Sequelize.STRING
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      nice_name: {
        allowNull: true,
        type: Sequelize.STRING
      },
      iso3: {
        allowNull: true,
        type: Sequelize.STRING
      },
      num_code: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      phone_code: {
        allowNull: true,
        type: Sequelize.INTEGER
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
  down: queryInterface => queryInterface.dropTable('Countries')
};