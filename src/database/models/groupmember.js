module.exports = (sequelize, DataTypes) => {
  const GroupMember = sequelize.define('GroupMember', {
    groupId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {
    freezeTableName: true,
    tableName: 'GroupMembers',
    underscored: true,
  });
  GroupMember.associate = (models) => {
    // associations can be defined here
    GroupMember.belongsTo(models.Group, {
      foreignKey: 'groupId',
      as: 'group',
      onUpdate: 'CASCADE'
    });
    // GroupMember.hasMany(models.GroupPost, {
    //   foreignKey: 'groupMemberId',
    //   as: 'groupPost',
    //   onUpdate: 'CASCADE'
    // });
  };
  return GroupMember;
};