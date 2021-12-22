module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn(
      'Users',
      'cover_image',
      {
        type: Sequelize.STRING,
        allowNull: true,
      }
    ),
  ]),

  down: queryInterface => Promise.all([
    queryInterface.removeColumn('Users', 'cover_image'),
  ])
};
