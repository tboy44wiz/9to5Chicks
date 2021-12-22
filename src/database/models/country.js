module.exports = (sequelize, DataTypes) => {
  const Country = sequelize.define('Country', {
    iso: DataTypes.STRING,
    name: DataTypes.STRING,
    niceName: DataTypes.STRING,
    iso3: DataTypes.STRING,
    numCode: DataTypes.INTEGER,
    phoneCode: DataTypes.INTEGER
  }, {
    freezeTableName: true,
    tableName: 'Countries',
    underscored: true,
  });
  Country.associate = (models) => {
    // associations can be defined here
  };
  return Country;
};