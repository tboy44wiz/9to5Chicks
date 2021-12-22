module.exports = (sequelize, DataTypes) => {
  const CommentReplyLike = sequelize.define('CommentReplyLike', {
    userId: DataTypes.INTEGER,
    commentReplyId: DataTypes.INTEGER,
    commentId: DataTypes.INTEGER
  }, {
    freezeTableName: true,
    tableName: 'CommentReplyLikes',
    underscored: true,
  });
  CommentReplyLike.associate = (models) => {
    // associations can be defined here
  };
  return CommentReplyLike;
};