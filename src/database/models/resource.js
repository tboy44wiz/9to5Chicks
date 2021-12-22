module.exports = (sequelize, DataTypes) => {
  const Resource = sequelize.define('Resource', {
    userId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    image: DataTypes.STRING,
    link: DataTypes.STRING,
    type: DataTypes.STRING,
    text: DataTypes.TEXT
  }, {
    freezeTableName: true,
    tableName: 'Resources',
    underscored: true,
  });
  Resource.associate = (models) => {
    // associations can be defined here
  };
  return Resource;
};