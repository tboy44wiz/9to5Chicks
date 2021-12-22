'use strict';
module.exports = (sequelize, DataTypes) => {
  const CronTask = sequelize.define('CronTask', {
    userId: DataTypes.INTEGER,
    subject: DataTypes.STRING,
    html: DataTypes.TEXT,
    type: DataTypes.ARRAY(DataTypes.STRING),
    year: DataTypes.STRING,
    month: DataTypes.STRING,
    day: DataTypes.STRING,
    hour: DataTypes.STRING,
    minute: DataTypes.STRING,
    status: DataTypes.STRING,
    scheduled: DataTypes.STRING,
    emails: DataTypes.ARRAY(DataTypes.STRING),
  }, {
    freezeTableName: true,
    tableName: 'CronTasks',
    underscored: true,
  });
  CronTask.associate = function(models) {
    // associations can be defined here
  };
  return CronTask;
};
