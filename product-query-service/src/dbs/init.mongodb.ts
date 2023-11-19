import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();
const host = process.env.MONGO_HOST;
const port = process.env.MONGO_PORT;
const db = process.env.MONGO_DB_NAME;
const connectUri = `mongodb://${host}:${port}/${db}`;

class Mongodb {
  static instance: Mongodb;
  constructor() {
    this.connect();
  }
  connect() {
    mongoose
      .connect(connectUri)
      .then((_) => {
        console.log('Connect Mongodb Successfully!');
      })
      .catch((err) => {
        console.log(err);
        console.log('Error Connect Mongodb!');
      });
  }

  static getInstance() {
    if (!Mongodb.instance) {
      Mongodb.instance = new Mongodb();
    }
    return Mongodb.instance;
  }
}

export default Mongodb;
