module.exports = (sequelize, DataTypes) => {
  const EmailNotification = sequelize.define('EmailNotification', {
    type: DataTypes.STRING,
    message: DataTypes.TEXT,
    image: DataTypes.STRING
  }, {
    freezeTableName: true,
    tableName: 'EmailNotifications',
    underscored: true,
  });
  EmailNotification.associate = function(models) {
    // associations can be defined here
  };
  return EmailNotification;
};