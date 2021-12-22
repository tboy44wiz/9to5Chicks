module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
     },
    userId: DataTypes.INTEGER,
    postId: DataTypes.INTEGER,
    comment: DataTypes.TEXT
  }, {
    freezeTableName: true,
    tableName: 'Comments',
    underscored: true,
  });
  Comment.associate = (models) => {
    // associations can be defined here
    Comment.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
      onUpdate: 'CASCADE'
    });
    Comment.hasMany(models.CommentLike, {
      foreignKey: 'commentId',
      as: 'commentLike',
      onUpdate: 'CASCADE'
    });
    Comment.hasMany(models.CommentReply, {
      foreignKey: 'commentId',
      as: 'commentReply',
      onUpdate: 'CASCADE'
    });
  };
  return Comment;
};