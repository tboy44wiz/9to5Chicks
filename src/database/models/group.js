module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define('Group', {
    name: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    avatar: DataTypes.STRING,
    description: DataTypes.TEXT,
    isOpen: DataTypes.BOOLEAN, // closed or open group
    groupBanner: DataTypes.STRING, // banner image
  }, {
    freezeTableName: true,
    tableName: 'Groups',
    underscored: true,
  });
  Group.associate = (models) => {
    // associations can be defined here
    Group.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
      onUpdate: 'CASCADE'
    });
    Group.hasMany(models.GroupMember, {
      foreignKey: 'groupId',
      as: 'groupMember',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
    Group.hasMany(models.GroupPost, {
      foreignKey: 'groupId',
      as: 'groupPost',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  };
  return Group;
};