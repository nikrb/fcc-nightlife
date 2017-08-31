const express = require('express');
const Bar = require( 'mongoose').model('Bar');

const router = new express.Router();

router.delete( '/going', (req, res) => {
  const {bar_id, user_email} = req.body;
  Bar.findOne( {id: bar_id}, function( err, bar){
    if( bar){
      const going = bar.going.filter( g => g.email !== user_email);
      let found = going.length !== bar.going.length;
      bar.going = going;
      bar.save();
      res.json( {success:true});
    } else {
      res.json( {success:false});
    }
  });
});
router.post('/going', (req, res) => {
  const {bar_id, user_email} = req.body;
  Bar.findOne( {id: bar_id}, function( err, bar){
    if( err){
      res.json( {success: false, error:err});
    } else {
      if( bar){
        const fu = bar.going.filter( u => u.email === user_email);
        if( fu.length){
          res.json( {success: false, message: "already going"});
        } else {
          bar.going.push( {email:user_email});
          bar.save();
          res.json( {success:true});
        }
      } else {
        const new_bar = new Bar({id: bar_id, going:[{email:user_email}]});
        new_bar.save( (err) => {
          if( err){
            res.json( {success: false, error: err})
          } else {
            res.json( {success:true});
          }
        });
      }
    }
  });
});

module.exports = router;
