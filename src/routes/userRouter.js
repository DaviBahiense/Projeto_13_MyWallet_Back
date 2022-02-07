import { Router } from 'express';
import { user, entrace } from '../controllers/userController.js';

const userRouter = Router();
userRouter.get("/user", user);
userRouter.put("/entrace", entrace);
export default userRouter;