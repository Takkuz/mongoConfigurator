const mongo = require('./mongo')

mongo.$promise
.then(() => {
  console.log('I\'m your app')
})
