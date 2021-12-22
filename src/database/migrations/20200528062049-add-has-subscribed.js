module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn(
      'Users',
      'has_subscribed',
      {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
      }
    ),
    queryInterface.addColumn(
      'Users',
      'chick_type',
      {
        type: Sequelize.STRING,
        allowNull: true,
      }
    ),
  ]),

  down: queryInterface => Promise.all([
    queryInterface.removeColumn('Users', 'has_subscribed'),
    queryInterface.removeColumn('Users', 'chick_type'),
  ])
};
