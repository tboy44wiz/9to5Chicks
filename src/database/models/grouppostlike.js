module.exports = (sequelize, DataTypes) => {
  const GroupPostLike = sequelize.define('GroupPostLike', {
    userId: DataTypes.INTEGER,
    groupPostId: DataTypes.INTEGER
  }, {
    freezeTableName: true,
    tableName: 'GroupPostLikes',
    underscored: true,
  });
  GroupPostLike.associate = (models) => {
    // associations can be defined here
    GroupPostLike.belongsTo(models.GroupPost, {
      foreignKey: 'groupPostId',
      as: 'groupPost',
      onUpdate: 'CASCADE'
    });
  };
  return GroupPostLike;
};