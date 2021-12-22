module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Friends', {
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
      friend_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      chat_history: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM('pending', 'accepted', 'rejected'),
        defaultValue: 'pending'
      },
      invites: {
        type: Sequelize.ENUM('sent', 'accepted'),
        allowNull: true,
        defaultValue: 'sent',
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
  down: queryInterface => queryInterface.dropTable('Friends')
};