module.exports = (sequelize, DataTypes) => {
  const Mentorship = sequelize.define('Mentorship', {
    mentorId: DataTypes.INTEGER,
    menteeId: DataTypes.INTEGER,
    status: DataTypes.STRING, // pending, assigned, accepted || rejected
    menteeStatus: DataTypes.STRING, // pending, accepted, rejected
    mentorStatus: DataTypes.STRING // pending, accepted. rejected
  }, {
    freezeTableName: true,
    tableName: 'Mentorships',
    underscored: true,
  });
  Mentorship.associate = (models) => {
    // associations can be defined here
    Mentorship.belongsTo(models.User, {
      foreignKey: 'mentorId',
      as: 'mentor',
      onUpdate: 'CASCADE'
    });
    Mentorship.belongsTo(models.User, {
      foreignKey: 'menteeId',
      as: 'mentee',
      onUpdate: 'CASCADE'
    });
  };
  return Mentorship;
};