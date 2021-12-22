module.exports = (sequelize, DataTypes) => {
  const Plan = sequelize.define('Plan', {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    planCode: DataTypes.STRING,
    planType: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    interval: DataTypes.STRING,
    invoiceLimit: DataTypes.INTEGER,
    currency: DataTypes.STRING
  }, {
    freezeTableName: true,
    tableName: 'Plans',
    underscored: true,
  });
  Plan.associate = function(models) {
    // associations can be defined here
  };
  return Plan;
};