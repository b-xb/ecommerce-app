const express = require('express');
const apiRouter = express.Router();

const productsRouter = require('./products.js');
apiRouter.use('/products', productsRouter);

const ordersRouter = require('./orders.js');
apiRouter.use('/orders', ordersRouter);

const usersRouter = require('./users.js');
apiRouter.use('/users', usersRouter);

const authRouter = require('./auth.js');
apiRouter.use('/auth', authRouter);

apiRouter.get("/", (req, res) => {
  res.status(204).send();
});

module.exports = apiRouter;