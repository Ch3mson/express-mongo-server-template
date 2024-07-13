import { Router } from 'express';
import usersRouter from './users.mjs'
import productsRouter from './products.mjs'

const router = Router();


// use this to group routeres so they're not bloating the outside index.mjs
router.use(usersRouter);
router.use(productsRouter);

export default router;