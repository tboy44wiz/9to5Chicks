module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn(
      'Events',
      'location_type',
      {
        type: Sequelize.STRING,
        allowNull: true
      }
    ),
    queryInterface.addColumn(
      'Events',
      'virtual_link',
      {
        type: Sequelize.STRING,
        allowNull: true
      }
    ),
  ]),

  down: queryInterface => Promise.all([
    queryInterface.removeColumn('Events', 'locationType'),
    queryInterface.removeColumn('Events', 'virtualLink'),
  ])
};
