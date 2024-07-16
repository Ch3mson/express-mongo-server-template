import { Router } from 'express';
import usersRouter from './users.mjs'
import productsRouter from './products.mjs'
import authRouter from './auth.mjs';
import cartRouter from './cart.mjs'

const router = Router();


// use this to group routeres so they're not bloating the outside index.mjs
router.use(usersRouter);
router.use(productsRouter);
router.use(authRouter);
router.use(cartRouter)


export default router;