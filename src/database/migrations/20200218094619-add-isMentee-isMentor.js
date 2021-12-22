module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn(
      'Users',
      'is_mentee',
      {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
      }
    ),
    queryInterface.addColumn(
      'Users',
      'is_mentor',
      {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
      }
    ),
  ]),

  down: queryInterface => Promise.all([
    queryInterface.removeColumn('Users', 'is_mentee'),
    queryInterface.removeColumn('Users', 'is_mentor'),
  ])
};
