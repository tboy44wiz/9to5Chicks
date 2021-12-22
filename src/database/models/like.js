module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    userId: DataTypes.INTEGER,
    postId: DataTypes.INTEGER
  }, {
    freezeTableName: true,
    tableName: 'Likes',
    underscored: true,
  });
  Like.associate = (models) => {
    // associations can be defined here
    Like.belongsTo(models.Post, {
      foreignKey: 'postId',
      as: 'post',
      onUpdate: 'CASCADE'
    });
    Like.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
      onUpdate: 'CASCADE'
    });
  };
  return Like;
};
