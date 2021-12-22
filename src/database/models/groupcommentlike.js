module.exports = (sequelize, DataTypes) => {
  const GroupCommentLike = sequelize.define('GroupCommentLike', {
    userId: DataTypes.INTEGER,
    groupPostId: DataTypes.INTEGER,
    groupCommentId: DataTypes.INTEGER
  }, {
    freezeTableName: true,
    tableName: 'GroupCommentLikes',
    underscored: true,
  });
  GroupCommentLike.associate = (models) => {
    // associations can be defined here
  };
  return GroupCommentLike;
};