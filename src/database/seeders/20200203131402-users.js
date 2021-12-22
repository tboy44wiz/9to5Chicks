import hashHelper from '../../helpers/Hash';

module.exports = {
  up: queryInterface => queryInterface.bulkInsert('Users', [
    {
      first_name: 'Femi',
      last_name: 'Tijani',
      email: 'admin@9to5chick.com',
      password: hashHelper.hashPassword('password'),
      status: 'active',
      role: 'admin'
    },
  ]),
  down: queryInterface => queryInterface.bulkDelete('Users', null, {})
};