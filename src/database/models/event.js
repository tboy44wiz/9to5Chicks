module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    userId: DataTypes.INTEGER,
    type: DataTypes.STRING,
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    country: DataTypes.STRING,
    state: DataTypes.STRING,
    lga: DataTypes.STRING,
    location: DataTypes.STRING,
    paidEvent: DataTypes.BOOLEAN,
    price: DataTypes.INTEGER,
    paymentLink: DataTypes.STRING,
    eventDate: DataTypes.DATE,
    cta: DataTypes.STRING,
    status: DataTypes.STRING,
    startTime: DataTypes.STRING,
    endTime: DataTypes.STRING,
    eventBanner: DataTypes.STRING, // should add country, lga, state
    locationType: DataTypes.STRING,
    virtualLink: DataTypes.STRING,
  }, {
    freezeTableName: true,
    tableName: 'Events',
    underscored: true,
  });
  Event.associate = (models) => {
    // associations can be defined here
    Event.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
      onUpdate: 'CASCADE'
    });
    Event.hasMany(models.Attendee, {
      foreignKey: 'eventId',
      as: 'attendee',
      onUpdate: 'CASCADE'
    });
    Event.hasMany(models.PaymentHistory, {
      foreignKey: 'eventId',
      as: 'paymentHistory',
      onUpdate: 'CASCADE'
    });
  };
  return Event;
};