import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);
/* let db;
mongoClient.connect(() => {
    db = mongoClient.db("my-wallet");
});
 */

await mongoClient.connect()
const db = mongoClient.db('my-wallet')
export default db;