module.exports = (sequelize, DataTypes) => {
  const Friend = sequelize.define('Friend', {
    userId: DataTypes.INTEGER,
    friendId: DataTypes.INTEGER,
    status: DataTypes.ENUM('pending', 'accepted', 'rejected'),
    chatHistory: DataTypes.BOOLEAN,
    invites: DataTypes.ENUM('sent', 'accepted')
  }, {
    freezeTableName: true,
    tableName: 'Friends',
    underscored: true,
  });
  Friend.associate = (models) => {
    // associations can be defined here
    Friend.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
      onUpdate: 'CASCADE'
    });
    Friend.belongsTo(models.User, {
      foreignKey: 'friendId',
      as: 'friend',
      onUpdate: 'CASCADE'
    });
  };
  return Friend;
};