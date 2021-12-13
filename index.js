const express = require('express');
require('dotenv')

const PORT = 3000;

const app = express();

const userRoutes = require('./routes/userRoutes.routes.js');

app.use(express.json());

app.use('/user', userRoutes)

app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));