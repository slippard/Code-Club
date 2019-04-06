import { Bot } from "./bot";
import * as mongoose from 'mongoose';
import { data } from './config';

/* Export Mongo Collection Connection */
export const db = mongoose.connection;
mongoose.connect(data.dburl, { useNewUrlParser: true });

db.once('open', () => console.log('Connected to mongo database.'));
db.on('error', (err: any) => console.log('Error connecting to mongo db: ' + err));

/* Attempt to launch Client */
try { 
  new Bot(data.token).login()
} catch (error) {
  console.log('Login failed: ' + error);
}