const express = require('express');
const yelp = require( '../models/MY.js');

const router = new express.Router();

router.get('/yelp', (req, res) => {
  yelp.search({})
  .then( (result) => {
    // console.log( result);
    result.jsonBody.businesses.forEach( (b,i) => {
      yelp.reviews( b.id)
      .then( (rev) => {
        b.reviews = rev.jsonBody.reviews;
        // const data = result.jsonBody;
        // data.businesses[0].reviews = rev.jsonBody.reviews;
        // console.log( rev);
        if( i === result.jsonBody.businesses.length-1){
          res.send( {success:true, data: result.jsonBody});
        }
      });
    });
  })
  // .then(function (data) {
  //   res.send( {success: true, data: JSON.parse( data)});
  // })
  .catch(function (err) {
      console.error(err);
      res.send( { success: false, err});
  });
});

module.exports = router;
