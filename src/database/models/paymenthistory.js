module.exports = (sequelize, DataTypes) => {
  const PaymentHistory = sequelize.define('PaymentHistory', {
    userId: DataTypes.INTEGER,
    reason: DataTypes.ENUM('registration', 'event'),
    eventId: DataTypes.INTEGER,
    amount: DataTypes.INTEGER,
    transactionId: DataTypes.STRING,
    bank: DataTypes.STRING,
    customerId: DataTypes.STRING,
    customerEmail: DataTypes.STRING,
    reference: DataTypes.STRING,
    status: DataTypes.STRING //pending, successful, failed
  }, {
    freezeTableName: true,
    tableName: 'PaymentHistories',
    underscored: true,
  });
  PaymentHistory.associate = (models) => {
    // associations can be defined here
  };
  return PaymentHistory;
};