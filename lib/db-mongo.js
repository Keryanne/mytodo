/**
 * Copyright 2016 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the “License”);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an “AS IS” BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

function DB(credentials) {
  const DB_NAME = 'todos';
  const COLLECTION_NAME = 'todos';
  const self = this;
  let db;

  self.type = function() {
    return 'Scalingo MongoDB';
  };

  self.init = () => {
    return new Promise((resolve, reject) => {
      const connectionString = process.env.SCALINGO_MONGO_URL || credentials.MONGO_URI;

      const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true
      };

      MongoClient.connect(connectionString, options, (err, mongoDb) => {
        if (err) {
          reject(err);
          console.error("Erreur de connexion MongoDB:", err);
        } else {
          db = mongoDb.db(DB_NAME).collection(COLLECTION_NAME);
          resolve();
        }
      });
    });
  };

  self.count = () => {
    return db.countDocuments();
  };

  self.search = () => {
    return db.find().toArray()
      .then(result => result.map(todo => ({
        id: todo._id,
        title: todo.title,
        completed: todo.completed,
        order: todo.order
      })))
      .catch(err => {
        console.error("Erreur sur search :", err);
        throw err;
      });
  };  

  self.create = (item) => {
    return db.insertOne(item).then(result => {
      const newItem = {
        id: result.insertedId,
        title: item.title,
        completed: item.completed,
        order: item.order
      };
      return newItem;
    });
  };

  self.read = (id) => {
    return db.findOne({ _id: new mongodb.ObjectId(id) }).then(item => {
      if (!item) return null;
      item.id = item._id;
      delete item._id;
      return item;
    });
  };

  self.update = (id, newValue) => {
    delete newValue.id;
    return db.findOneAndUpdate(
      { _id: new mongodb.ObjectId(id) },
      { $set: newValue },
      { returnDocument: 'after', upsert: true }
    ).then(result => {
      const updatedItem = result.value;
      updatedItem.id = updatedItem._id;
      delete updatedItem._id;
      return updatedItem;
    });
  };

  self.delete = (id) => {
    return db.deleteOne({ _id: new mongodb.ObjectId(id) })
      .then(() => ({ id: id }));
  };
}

module.exports = function(credentials) {
  return new DB(credentials);
}
