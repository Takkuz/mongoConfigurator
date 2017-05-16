module.exports = {
  mongo: {
    url: 'mongodb://localhost:27017/test',
    username: 'myTester',
    password: 'xyz123',

    collections: [
      {
        name: 'users',
        indexes: [
          { name: 'email', key: { email: 1 }, options: { unique: true } }
        ]
      },
      {
        name: 'chat',
        indexes: [
          { name: 'rcptId', key: { rcptId: 1 }, options: { unique: true } }
        ]
      }
    ]
  }
}
