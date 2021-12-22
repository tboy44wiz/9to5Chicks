module.exports = (sequelize, DataTypes) => {
  const Note = sequelize.define('Note', {
    mentorId: DataTypes.INTEGER,
    menteeId: DataTypes.INTEGER,
    note: DataTypes.TEXT,
    attachment: DataTypes.STRING
  }, {
    freezeTableName: true,
    tableName: 'Notes',
    underscored: true,
  });
  Note.associate = (models) => {
    // associations can be defined here
    Note.belongsTo(models.User, {
      foreignKey: 'mentorId',
      as: 'mentor',
      onUpdate: 'CASCADE'
    });
    Note.belongsTo(models.User, {
      foreignKey: 'menteeId',
      as: 'mentee',
      onUpdate: 'CASCADE'
    });
  };
  return Note;
};