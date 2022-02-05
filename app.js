import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb'
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import dayjs from 'dayjs'

dotenv.config();


const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;
mongoClient.connect(() => {
    db = mongoClient.db("my-wallet");
});

const app = express();
app.use(express.json());
app.use(cors());


app.post('/register', async (req, res) => {
    const user = req.body
    
    const hashPass = bcrypt.hashSync(user.password, 1);
    
  try {
    await db.collection("users").insertOne({
      ...user,
      password: hashPass
    });

    res.sendStatus(201)
  } catch (erro) {
    console.log(erro);
    res.sendStatus(500);
  }
})

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db.collection("users").findOne({email});

    if (!user) {
      return res.sendStatus(401);
    }

    if (user && bcrypt.compareSync(password, user.password)) {
      const token = uuid();
  
      await db.collection('session').insertOne({ token, userId: user._id });
      console.log({token})
      res.send({token});
    } else {
      res.sendStatus(401);
    }
  } catch (erro) {
    console.log(erro);
    res.sendStatus(500);
  }
})

app.get("/user", async (req, res) => {
  const authorization = req.headers.authorization;
  const token = authorization?.replace('Bearer ', '');

  try {
    const session = await db.collection("session").findOne({ token });
    if (!session) {
      return res.sendStatus(401);
    }

    const user = await db.collection("users").findOne({ _id: session.userId });
    if (!user) {
      return res.sendStatus(401);
    }

    res.send(user)
  } catch (erro) {
    console.log(erro);
    res.sendStatus(500);
  }
});

app.put('/entrace', async (req, res) => {
  const movimentation ={
    ...req.body,
    day: dayjs().format('DD-MM')
  }
  const authorization = req.headers.authorization;
  const token = authorization?.replace('Bearer ', '');
try {
  const session = await db.collection("session").findOne({ token });
  if (!session) {
    return res.sendStatus(401);
  }

  const user = await db.collection("users").findOne({ _id: session.userId });
  if (!user) {
    return res.sendStatus(401);
  }

  await db.collection("users").updateOne({
    _id: user._id
  }, {
    $push: { movimentation }
  })

  res.sendStatus(201)
} catch (erro) {
  console.log(erro);
  res.sendStatus(500);
}
})



app.listen(5000, () => {
    console.log('Server is litening on port 5000.');
  })