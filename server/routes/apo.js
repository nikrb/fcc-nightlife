const express = require('express');
const yelp = require( '../models/MY.js');

const router = new express.Router();

router.get('/yelp', (req, res) => {
  yelp.search({})
  .then( (result) => {
    const promises = [];
    result.jsonBody.businesses.forEach( (b,i) => {
      const p = new Promise( (resolve,reject) => {
        yelp.reviews( b.id)
        .then( (rev) => {
          b.reviews = rev.jsonBody.reviews;
          resolve( b);
        })
        .catch( (e) => {
          reject( e);
        });
      });
      promises.push( p);
    });
    Promise.all( promises)
    .then( (data) => {
      // console.log( data);
      res.send( {success:true, data});
    })
    .catch( (e) => {
      res.send( {success:false, e});
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
