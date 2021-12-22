module.exports = (sequelize, DataTypes) => {
  const GroupPost = sequelize.define('GroupPost', {
    groupId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    text: DataTypes.TEXT,
    image: DataTypes.STRING
  }, {
    freezeTableName: true,
    tableName: 'GroupPosts',
    underscored: true,
  });
  GroupPost.associate = (models) => {
    // associations can be defined here
    GroupPost.belongsTo(models.Group, {
      foreignKey: 'groupId',
      as: 'group',
      onUpdate: 'CASCADE'
    });
    GroupPost.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
      onUpdate: 'CASCADE'
    });
    GroupPost.hasMany(models.GroupComment, {
      foreignKey: 'groupPostId',
      as: 'groupComment',
      onUpdate: 'CASCADE'
    });
    GroupPost.hasMany(models.GroupPostLike, {
      foreignKey: 'groupPostId',
      as: 'groupPostLike',
      onUpdate: 'CASCADE'
    });
  };
  return GroupPost;
};