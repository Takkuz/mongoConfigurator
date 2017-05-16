const mongo = require('mongodb').MongoClient
const config = require('./config').mongo

const log = console

// Create a function to use in a promise to check indexes
function checkIndexes (configIndexes,collection) {
  // Return a function to use in forEach to iterate
  function createIndexChecker (configIndex) {
    return function (collectionIndexes) {
      let found = false
      let promise = Promise.resolve()
      for (let el of collectionIndexes) {
        if (el.name === configIndex.name) { found = true; break }
      }
      // If index not found create it
      if (found) {
        if (configIndex.forceUpdate) {
          promise = collection.dropIndex(configIndex.name)
        } else if (configIndex.forceDelete) {
          return collection.dropIndex(configIndex.name)
        } else { return promise }
      }
      return promise.then(() => collection.createIndex(configIndex.key, configIndex.options))
    }
  }

  // Iterate through all indexes in config
  const promises = []
  configIndexes.forEach(
    (el) => promises.push(
      Promise.resolve(collection.indexes())
      .then(createIndexChecker(el))
    )
  )
  return Promise.all(promises)
}

function searchFor (configCollection,collectionsList,db) {
  // Search for config collection inside of existing collections list
  let collection
  for (let el in collectionsList) {
    if (el.name === configCollection.name) {
      collection = db.collection(configCollection.name); break
    }
  }

  // If collection found search for index
  if (collection) {
    return checkIndexes(configCollection.indexes,collection)
  }
  // Else create collection
  return Promise.resolve(db.createCollection(configCollection.name))
  .then(collection => checkIndexes(configCollection.indexes, collection))
}

function checkCollections (db) {
  return Promise.resolve()
  .then(() => db.listCollections().toArray())
  .then(collectionsList => {
    var promises = []
    // Looping through all configured collections to find, update or create existing collections.
    config.collections.forEach(el => promises.push(searchFor(el,collectionsList,db)))
    return Promise.all(promises)
  })
  .then(() => db)
}

function mongoModule (collectionName) {
  return mongoModule.$db.collection(collectionName)
}

function runModule () {
  mongoModule.$promise = Promise.resolve()
  .then(() => mongo.connect(config.url))
  .then(db => db.authenticate(config.username,config.password).then(() => db))
  .then(db => checkCollections(db))
  .then(db => {
    log.info('MongoDB connected succesfully')
    mongoModule.$db = db

    return db
  })
  .catch(function (err) {
    log.error('Error while connecting to MongoDB')
    log.info(err)
    return Promise.reject(err)
  })
}

runModule()
// MongoModule will be extened with database mongo object
module.exports = mongoModule
