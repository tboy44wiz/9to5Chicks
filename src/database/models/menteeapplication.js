module.exports = (sequelize, DataTypes) => {
  const MenteeApplication = sequelize.define('MenteeApplication', {
    userId: DataTypes.INTEGER,
    question1: DataTypes.TEXT,
    question2: DataTypes.TEXT,
    question3: DataTypes.TEXT
  }, {
    freezeTableName: true,
    tableName: 'MenteeApplications',
    underscored: true,
  });
  MenteeApplication.associate = function(models) {
    // associations can be defined here
  };
  return MenteeApplication;
};