module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      first_name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      last_name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING
      },
      api_token: {
        allowNull: true,
        type: Sequelize.STRING
      },
      on_boarding_step: {
        allowNull: true,
        type: Sequelize.STRING
      },
      hobbies: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      job_sector: {
        allowNull: true,
        type: Sequelize.STRING
      },
      job_title: {
        allowNull: true,
        type: Sequelize.STRING
      },
      language: {
        allowNull: true,
        type: Sequelize.STRING
      },
      dob: {
        allowNull: true,
        type: Sequelize.STRING
      },
      city: {
        allowNull: true,
        type: Sequelize.STRING
      },
      country: {
        allowNull: true,
        type: Sequelize.STRING
      },
      i_can_access: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      i_can_offer: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      interests: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      avatar: {
        allowNull: true,
        type: Sequelize.STRING
      },
      role: {
        allowNull: true,
        type: Sequelize.STRING
      },
      remember_token: {
        allowNull: true,
        type: Sequelize.STRING
      },
      status: {
        allowNull: true,
        type: Sequelize.ENUM('active', 'inactive', 'unverified'),
        defaultValue: 'unverified'
      },
      email_verified_at: {
        allowNull: true,
        type: Sequelize.DATEONLY
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
  down: queryInterface => queryInterface.dropTable('Users')
};