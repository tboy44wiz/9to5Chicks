module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    apiToken: DataTypes.STRING,
    onBoardingStep: DataTypes.STRING,
    hobbies: DataTypes.TEXT,
    jobSector: DataTypes.STRING,
    jobTitle: DataTypes.STRING,
    language: DataTypes.STRING,
    dob: DataTypes.STRING,
    city: DataTypes.STRING,
    country: DataTypes.STRING,
    iCanAccess: DataTypes.TEXT,
    iCanOffer: DataTypes.TEXT,
    interests: DataTypes.TEXT,
    avatar: DataTypes.STRING,
    rememberToken: DataTypes.STRING,
    status: DataTypes.STRING, // unverified, active, inactive(blocked)
    role: DataTypes.STRING,
    isMentee: DataTypes.STRING,
    isMentor: DataTypes.STRING,
    coverImage: DataTypes.STRING,
    firstLogin: DataTypes.BOOLEAN,
    hasSubscribed: DataTypes.BOOLEAN,
    chickType: DataTypes.STRING
  }, {
    freezeTableName: true,
    tableName: 'Users',
    underscored: true,
    scopes: {
      withoutPassword: {
        attributes: { exclude: ['password'] },
      }
    }
  });
  User.associate = (models) => {
    // associations can be defined here
    // User.hasMany(models.Friend, {
    //   foreignKey: ['userId', 'friendId'],
    //   // otherKey: 'friendId',
    //   as: 'friend',
    //   onUpdate: 'CASCADE'
    // });
    User.hasMany(models.Post, {
      foreignKey: 'userId',
      as: 'post',
      onUpdate: 'CASCADE'
    })
    User.hasMany(models.Friend, {
      foreignKey: 'userId',
      as: 'friend',
      onUpdate: 'CASCADE'
    });
    User.hasMany(models.WorkHistory, {
      foreignKey: 'userId',
      as: 'workHistory',
      onUpdate: 'CASCADE'
    });
    User.hasMany(models.EducationHistory, {
      foreignKey: 'userId',
      as: 'educationHistory',
      onUpdate: 'CASCADE'
    });
    User.hasMany(models.Goal, {
      foreignKey: 'userId',
      as: 'goal',
      onUpdate: 'CASCADE'
    });
    User.hasOne(models.Mentorship, {
      foreignKey: 'menteeId',
      as: 'mentee',
      onUpdate: 'CASCADE'
    });
    User.hasMany(models.Mentorship, {
      foreignKey: 'mentorId',
      as: 'mentor',
      onUpdate: 'CASCADE'
    });
    User.hasOne(models.MenteeApplication, {
      foreignKey: 'userId',
      as: 'menteeApplication',
      onUpdate: 'CASCADE'
    });
    User.hasMany(models.PaymentHistory, {
      foreignKey: 'userId',
      as: 'paymentHistory',
      onUpdate: 'CASCADE'
    });
    User.hasOne(models.Subscription, {
      foreignKey: 'userId',
      as: 'subscription',
      onUpdate: 'CASCADE'
    });
  };
  return User;
};