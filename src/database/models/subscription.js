module.exports = (sequelize, DataTypes) => {
  const Subscription = sequelize.define('Subscription', {
    userId: DataTypes.INTEGER,
    planCode: DataTypes.STRING,
    planId: DataTypes.INTEGER,
    customerCode: DataTypes.STRING,
    customerId: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    subscriptionCode: DataTypes.STRING,
    status: DataTypes.STRING,
    nextPaymentDate: DataTypes.DATE
  }, {
    freezeTableName: true,
    tableName: 'Subscriptions',
    underscored: true,
  });
  Subscription.associate = function(models) {
    // associations can be defined here
    Subscription.belongsTo(models.Plan, {
      foreignKey: 'planId',
      as: 'plan',
      onUpdate: 'CASCADE'
    });
  };
  return Subscription;
};