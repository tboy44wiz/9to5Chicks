module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn(
      'Posts',
      'ice_breaker',
      {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
      }
    ),
  ]),

  down: queryInterface => Promise.all([
    queryInterface.removeColumn('Posts', 'ice_breaker'),
  ])
};
