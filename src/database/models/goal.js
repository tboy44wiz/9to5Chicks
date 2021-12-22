module.exports = (sequelize, DataTypes) => {
  const Goal = sequelize.define('Goal', {
    userId: DataTypes.INTEGER,
    goalTitle: DataTypes.STRING,
    goalDescription: DataTypes.STRING,  // remove this later
    actions: DataTypes.TEXT,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE
  }, {
    freezeTableName: true,
    tableName: 'Goals',
    underscored: true,
  });
  Goal.associate = (models) => {
    // associations can be defined here
    Goal.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
      onUpdate: 'CASCADE'
    });
    Goal.hasMany(models.GoalAction, {
      foreignKey: 'goalId',
      as: 'goalAction',
      onUpdate: 'CASCADE'
    });
  };
  return Goal;
};