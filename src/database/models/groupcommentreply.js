'use strict';
module.exports = (sequelize, DataTypes) => {
  const GroupCommentReply = sequelize.define('GroupCommentReply', {
    userId: DataTypes.INTEGER,
    groupCommentId: DataTypes.INTEGER,
    comment: DataTypes.TEXT
  }, {
    freezeTableName: true,
    tableName: 'GroupCommentReplies',
    underscored: true,
  });
  GroupCommentReply.associate = function(models) {
    // associations can be defined here
    GroupCommentReply.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
      onUpdate: 'CASCADE'
    });
    GroupCommentReply.hasMany(models.GroupCommentReplyLike, {
      foreignKey: 'groupCommentReplyId',
      as: 'groupCommentReplyLike',
      onUpdate: 'CASCADE'
    });
  };
  return GroupCommentReply;
};