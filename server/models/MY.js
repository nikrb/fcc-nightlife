require( 'dotenv').config();
const Yelp = require( 'yelp-fusion');
let access_token = 0;
Yelp.accessToken( process.env.yelp_app_id, process.env.yelp_app_secret)
.then( (response) => {
  access_token = response.jsonBody.access_token;
});

const search = ( {term="food",location="90210", limit=3, offset=0}) => {
  if( access_token){
    console.log( term, location, limit, offset);
    const client = Yelp.client( access_token);
    return client.search( { term, location, limit, offset });
  } else {
    console.error( "no access_token");
    process.exit(1);
  }
};
const reviews = ( id) => {
  const client = Yelp.client( access_token);
  return client.reviews( id);
};

module.exports = {search, reviews};
