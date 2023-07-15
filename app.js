const express = require('express');
require('dotenv').config();

const app = express();

module.exports = app;

const PORT = process.env.PORT || 4001;

const apiRouter = require('./routes/api/v1');
app.use('/api/v1',apiRouter);

// This conditional is here for testing purposes:
if (!module.parent) {
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
}