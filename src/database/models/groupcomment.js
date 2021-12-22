module.exports = (sequelize, DataTypes) => {
  const GroupComment = sequelize.define('GroupComment', {
    groupPostId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    comment: DataTypes.TEXT
  }, {
    freezeTableName: true,
    tableName: 'GroupComments',
    underscored: true,
  });
  GroupComment.associate = (models) => {
    // associations can be defined here
    GroupComment.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
      onUpdate: 'CASCADE'
    });
    GroupComment.hasMany(models.GroupCommentLike, {
      foreignKey: 'groupCommentId',
      as: 'groupCommentLike',
      onUpdate: 'CASCADE'
    });
    GroupComment.hasMany(models.GroupCommentReply, {
      foreignKey: 'groupCommentId',
      as: 'groupCommentReply',
      onUpdate: 'CASCADE'
    });
  };
  return GroupComment;
};