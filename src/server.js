const express = require('express');
const cors = require('cors');

const route = require('./routes/route');

const app = express();

app.use(express.json());
app.use(cors());

app.use('/', route);

module.exports = app;

/**
 *  Utilizar Api Google 
 *  - Places API
 *  - API Distance Matrix
 *  - Geocoding API
 * **/