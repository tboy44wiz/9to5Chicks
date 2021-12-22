module.exports = (sequelize, DataTypes) => {
  const WorkHistory = sequelize.define('WorkHistory', {
    userId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    company: DataTypes.STRING,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    workStatus: DataTypes.BOOLEAN
  }, {
    freezeTableName: true,
    tableName: 'WorkHistories',
    underscored: true,
  });
  WorkHistory.associate = (models) => {
    // associations can be defined here
  };
  return WorkHistory;
};