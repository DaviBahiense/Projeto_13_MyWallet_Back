import db from '../database.js';
import dayjs from 'dayjs'

export async function user (req, res)  {
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
  }
  
  export async function entrace (req, res)  {
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
  }

  export async function deleteItem(req, res) {

    const { id } = req.params
    const authorization = req.headers.authorization;
    const token = authorization?.replace('Bearer ', '');
    
    const session = await db.collection("session").findOne({ token });
    if (!session) {
      return res.sendStatus(401);
    }
    const user = await db.collection("users").findOne({ _id: session.userId });
    if (!user) {
      return res.sendStatus(401);
    }
    const exclude = user.movimentation[id]
    console.log(exclude)
    try {
      await db.collection("users").deleteOne({
        exclude
      })
      res.sendStatus(200);

    } catch (error) {
        res.sendStatus(error)
    }
}
  