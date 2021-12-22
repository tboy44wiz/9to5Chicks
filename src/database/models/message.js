module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    senderId: DataTypes.INTEGER,
    recipentId: DataTypes.INTEGER,
    text: DataTypes.TEXT,
    image: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    freezeTableName: true,
    tableName: 'Messages',
    underscored: true,
  });
  Message.associate = (models) => {
    // associations can be defined here
    Message.belongsTo(models.User, {
      foreignKey: 'senderId',
      as: 'sender',
      onUpdate: 'CASCADE'
    });
    Message.belongsTo(models.User, {
      foreignKey: 'recipentId',
      as: 'recipent',
      onUpdate: 'CASCADE'
    });
  };
  return Message;
};