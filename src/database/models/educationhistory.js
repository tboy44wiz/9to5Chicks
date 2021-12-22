module.exports = (sequelize, DataTypes) => {
  const EducationHistory = sequelize.define('EducationHistory', {
    userId: DataTypes.INTEGER,
    school: DataTypes.STRING,
    degree: DataTypes.STRING,
    fos: DataTypes.STRING, // field of study
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE
  }, {
    freezeTableName: true,
    tableName: 'EducationHistories',
    underscored: true,
  });
  EducationHistory.associate = (models) => {
    // associations can be defined here
  };
  return EducationHistory;
};