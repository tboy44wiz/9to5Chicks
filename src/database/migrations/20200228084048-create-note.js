module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Notes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      mentor_id: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      mentee_id: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      note: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      attachment: {
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
  down: queryInterface => queryInterface.dropTable('Notes')
};