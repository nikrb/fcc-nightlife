require( 'dotenv').config();
const Yelp = require( 'yelp-api-v3');

const yelp = new Yelp({
  app_id: process.env.yelp_app_id,
  app_secret: process.env.yelp_app_secret
});

const search = ( {term="food", location="90210", price="1,2,3", limit=3}) => {
  return yelp.search( {term,location, price, limit });
};

module.exports = {search};
