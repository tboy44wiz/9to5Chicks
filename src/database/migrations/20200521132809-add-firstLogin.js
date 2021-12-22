module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn(
      'Users',
      'first_login',
      {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
      }
    ),
  ]),

  down: queryInterface => Promise.all([
    queryInterface.removeColumn('Users', 'first_login'),
  ])
};
