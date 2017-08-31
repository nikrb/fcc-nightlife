const mongoose = require( 'mongoose');

const BarSchema = new mongoose.Schema({
  id: {
    type: String,
    index: { unique: true}
  },
  going: {
    type: [{ email: String}]
  }
});

module.exports = mongoose.model('Bar', BarSchema);
