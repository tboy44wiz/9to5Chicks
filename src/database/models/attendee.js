module.exports = (sequelize, DataTypes) => {
  const Attendee = sequelize.define('Attendee', {
    userId: DataTypes.INTEGER,
    eventId: DataTypes.INTEGER,
    status: DataTypes.STRING // going, notGoing, interested
  }, {
    freezeTableName: true,
    tableName: 'Attendees',
    underscored: true,
  });
  Attendee.associate = (models) => {
    // associations can be defined here
    Attendee.belongsTo(models.Event, {
      foreignKey: 'eventId',
      as: 'event',
      onUpdate: 'CASCADE'
    });
    Attendee.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
      onUpdate: 'CASCADE'
    });
  };
  return Attendee;
};