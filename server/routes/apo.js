const express = require('express');
const Bar = require( 'mongoose').model('Bar');
const yelp = require( '../models/MY.js');

const router = new express.Router();

router.get('/yelp', (req, res) => {
  const {location,term,user_email, limit, offset} = req.query;
  console.log( "user email:", user_email);
  console.log( "limit and offset:", limit, offset);
  let total = 0;
  yelp.search({location,term,limit,offset})
  .then( (result) => {
    const promises = [];
    total = result.jsonBody.total;
    result.jsonBody.businesses.forEach( (b,i) => {
      const p = new Promise( (resolve,reject) => {
        yelp.reviews( b.id)
        .then( (rev) => {
          b.reviews = rev.jsonBody.reviews;
          Bar.findOne( {id: b.id}, (err,bar) => {
            if( err) {
              console.error( `bar[${b.id}] not found`);
            } else {
              if( bar){
                b.going = bar.going.length;
                b.is_going = bar.going.reduce( (acc,c) => {
                  return (c.email === user_email?true:acc);
                }, false);
              }
            }
            resolve( b);
          });
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
      res.send( {success:true, data, total});
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

router.get( '/going', (req,res) => {
  const bar_id = req.body;
  Bar.findOne( {_id, bar_id}, function( err, bar){
    res.json( {success:true, going:bar.going.length});
  });
});

module.exports = router;
