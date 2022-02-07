import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import db from '../database.js';

export async function register (req, res)  {
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
}

export async function login(req, res)  {
  const { email, password } = req.body;
  try {
      
    const user = await db.collection("users").findOne({email});

    
    if (!user) {
      return res.sendStatus(401);
   
    }
    
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = uuid();
  
       await db.collection('session').insertOne({ token, userId: user._id });
      
      res.send({token});
    } else {
      res.sendStatus(401);
    }
  } catch (erro) {
    console.log(erro);
    res.sendStatus(500);
  }
}