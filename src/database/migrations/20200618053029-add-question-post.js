module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn(
      'Posts',
      'question',
      {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
      }
    ),
  ]),

  down: queryInterface => Promise.all([
    queryInterface.removeColumn('Posts', 'question'),
  ])
};
