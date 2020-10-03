const express = require('express');
const route = express.Router();

const placesController = require('../controllers/PlacesController');

route.get('/', (req, res) => {
    res.json({Message: 'Hello World!'});
});

route.get('/places/search', placesController.searchPlace);

module.exports = route;