module.exports = {
  mongo: {
    url: 'mongodb://myTester:xyz123@localhost:27017/test',

    collections: [
      {
        name: 'users',
        indexes: [
          { name: 'email_1', key: { email: 1 }, options: { unique: true }, forceUpdate: true },
          { name: 'displayName_1', forceDelete: true }
        ]
      },
      {
        name: 'chat',
        indexes: [
          { name: 'rcptId_1', key: { rcptId: 1 }, options: { unique: true }, forceUpdate: true }
        ]
      }
    ]
  }
}
