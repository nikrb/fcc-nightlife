const express = require('express');
const Bar = require( 'mongoose').model('Bar');

const router = new express.Router();

router.post('/going', (req, res) => {
  const {bar_id, user_email} = req.body;
  Bar.find( {id: bar_id}, function( err, docs){
    if( err){
      res.json( {success: false, error:err});
    } else {
      if( docs.length){
        let bar = docs[0];
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
