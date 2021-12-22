'use strict';
module.exports = (sequelize, DataTypes) => {
  const GoalAction = sequelize.define('GoalAction', {
    userId: DataTypes.INTEGER,
    goalId: DataTypes.INTEGER,
    goalDescription: DataTypes.STRING,
    status: DataTypes.BOOLEAN
  }, {
    freezeTableName: true,
    tableName: 'GoalActions',
    underscored: true,
  });
  GoalAction.associate = (models) => {
    // associations can be defined here
    GoalAction.belongsTo(models.Goal, {
      foreignKey: 'goalId',
      as: 'goal',
      onUpdate: 'CASCADE'
    });
  };
  return GoalAction;
};