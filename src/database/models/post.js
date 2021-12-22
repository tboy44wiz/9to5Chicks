module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    id: {
     type: DataTypes.INTEGER,
     autoIncrement: true,
     primaryKey: true
    },
    userId: DataTypes.INTEGER,
    postText: DataTypes.TEXT,
    postImage: DataTypes.STRING,
    iceBreaker: DataTypes.BOOLEAN,
    question: DataTypes.BOOLEAN
  }, {
    freezeTableName: true,
    tableName: 'Posts',
    underscored: true,
  });
  Post.associate = (models) => {
    // associations can be defined here
    Post.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
      onUpdate: 'CASCADE'
    });
    Post.hasMany(models.Comment, {
      foreignKey: 'postId',
      as: 'comment',
      onUpdate: 'CASCADE'
    });
    Post.hasMany(models.Like, {
      foreignKey: 'postId',
      as: 'like',
      onUpdate: 'CASCADE'
    });
  };
  return Post;
};