'use strict';
module.exports = (sequelize, DataTypes) => {
  const CommentLike = sequelize.define('CommentLike', {
    userId: DataTypes.INTEGER,
    postId: DataTypes.INTEGER,
    commentId: DataTypes.INTEGER
  }, {
    freezeTableName: true,
    tableName: 'CommentLikes',
    underscored: true,
  });
  CommentLike.associate = (models) => {
    // associations can be defined here
  };
  return CommentLike;
};