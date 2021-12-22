module.exports = (sequelize, DataTypes) => {
  const FlagPost = sequelize.define('FlagPost', {
    userId: DataTypes.INTEGER,
    postId: DataTypes.INTEGER
  }, {
    freezeTableName: true,
    tableName: 'FlagPosts',
    underscored: true,
  });
  FlagPost.associate = function(models) {
    // associations can be defined here
  };
  return FlagPost;
};