module.exports = (sequelize, DataTypes) => {
  const Announcement = sequelize.define('Announcement', {
    userId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    message: DataTypes.TEXT,
    condition: DataTypes.TEXT,
    link: DataTypes.STRING
  }, {
    freezeTableName: true,
    tableName: 'Announcements',
    underscored: true,
  });
  Announcement.associate = function(models) {
    // associations can be defined here
  };
  return Announcement;
};