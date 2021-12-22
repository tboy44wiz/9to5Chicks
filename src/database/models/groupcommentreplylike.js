'use strict';
module.exports = (sequelize, DataTypes) => {
  const GroupCommentReplyLike = sequelize.define('GroupCommentReplyLike', {
    userId: DataTypes.INTEGER,
    groupCommentReplyId: DataTypes.INTEGER,
    groupCommentId: DataTypes.INTEGER
  }, {
    freezeTableName: true,
    tableName: 'GroupCommentReplyLikes',
    underscored: true,
  });
  GroupCommentReplyLike.associate = function(models) {
    // associations can be defined here
  };
  return GroupCommentReplyLike;
};