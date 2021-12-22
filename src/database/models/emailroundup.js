'use strict';
module.exports = (sequelize, DataTypes) => {
  const EmailRoundUp = sequelize.define('EmailRoundUp', {
    userId: DataTypes.INTEGER,
    emailSubject: DataTypes.STRING,
    emailBody: DataTypes.STRING,
    scheduled: DataTypes.STRING,
    year: DataTypes.STRING,
    month: DataTypes.STRING,
    day: DataTypes.STRING,
    hour: DataTypes.STRING,
    minute: DataTypes.STRING,
    emails: DataTypes.ARRAY(DataTypes.STRING),
    adminPost: {
      type: DataTypes.TEXT,
      set: function (val) {
        return this.setDataValue('adminPost', JSON.stringify(val));
      },
    },
    usersPost: {
      type: DataTypes.TEXT,
      set: function (val) {
        return this.setDataValue('usersPost', JSON.stringify(val));
      },
    },
    announcementPost: {
      type: DataTypes.TEXT,
      set: function (val) {
        return this.setDataValue('announcementPost', JSON.stringify(val));
      },
    },
    eventPost: {
      type: DataTypes.TEXT,
      set: function(val) {
        return this.setDataValue('eventPost', JSON.stringify(val));
      }
    },
    status: DataTypes.STRING,
  }, {
    freezeTableName: true,
    tableName: 'EmailRoundUps',
    underscored: true,
  });
  EmailRoundUp.associate = function(models) {
    // associations can be defined here
  };
  return EmailRoundUp;
};
