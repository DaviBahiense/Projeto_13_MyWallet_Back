import { Router } from 'express';
import { user, entrace, deleteItem } from '../controllers/userController.js';

const userRouter = Router();
userRouter.get("/user", user);
userRouter.put("/entrace", entrace);
userRouter.delete('/carteira/:id', deleteItem)
export default userRouter;