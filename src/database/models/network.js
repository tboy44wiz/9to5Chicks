module.exports = (sequelize, DataTypes) => {
  const Network = sequelize.define('Network', {
    userId: DataTypes.INTEGER,
    memberId: DataTypes.INTEGER,
    connected: DataTypes.INTEGER
  }, {
    freezeTableName: true,
    tableName: 'Networks',
    underscored: true,
  });
  Network.associate = (models) => {
    // associations can be defined here
  };
  return Network;
};