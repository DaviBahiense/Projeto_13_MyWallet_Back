import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import { MongoClient } from 'mongodb'
import joi from 'joi'

dotenv.config();


const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;
mongoClient.connect(() => {
    db = mongoClient.db("my-wallet");
});

const app = express();
app.use(express.json());
app.use(cors());




app.listen(5000, () => {
    console.log('Server is litening on port 5000.');
  })