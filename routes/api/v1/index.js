const express = require('express');
const apiRouter = express.Router();

apiRouter.get("/", (req, res) => {
  res.status(204).send();
});

module.exports = apiRouter;