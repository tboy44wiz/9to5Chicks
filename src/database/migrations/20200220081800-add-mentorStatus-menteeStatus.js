module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn(
      'Mentorships',
      'mentee_status',
      {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 'pending'
      }
    ),
    queryInterface.addColumn(
      'Mentorships',
      'mentor_status',
      {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 'pending'
      }
    ),
  ]),

  down: queryInterface => Promise.all([
    queryInterface.removeColumn('Mentorships', 'mentee_status'),
    queryInterface.removeColumn('Mentorships', 'mentor_status'),
  ])
};
