module.exports = (sequelize, DataTypes) => {
  const CommentReply = sequelize.define('CommentReply', {
    userId: DataTypes.INTEGER,
    commentId: DataTypes.INTEGER,
    comment: DataTypes.TEXT
  }, {
    freezeTableName: true,
    tableName: 'CommentReplies',
    underscored: true,
  });
  CommentReply.associate = (models) => {
    // associations can be defined here
    CommentReply.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
      onUpdate: 'CASCADE'
    });
    CommentReply.hasMany(models.CommentReplyLike, {
      foreignKey: 'commentReplyId',
      as: 'commentReplyLike',
      onUpdate: 'CASCADE'
    });
  };
  return CommentReply;
};