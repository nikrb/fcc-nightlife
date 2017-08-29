const express = require('express');
const yelp = require( '../models/MY.js');

const router = new express.Router();

router.get('/yelp', (req, res) => {
  yelp.search({})
  .then(function (data) {
    res.send( {success: true, data: JSON.parse(data)});
  })
  .catch(function (err) {
      console.error(err);
      res.send( { success: false, err});
  });
});

module.exports = router;
