require( 'dotenv').config();
const Yelp = require( 'yelp-fusion');

const search = ( {term="food",location="90210", limit=3, offset=0}) => {
  if( process.env.yelp_app_id){
    console.log( term, location, limit, offset);
    const client = Yelp.client( process.env.yelp_app_id);
    return client.search( { term, location, limit, offset });
  } else {
    console.error( "no access_token");

  }
};
const reviews = ( id) => {
  const client = Yelp.client( process.env.yelp_app_id);
  return client.reviews( id);
};

module.exports = {search, reviews};
