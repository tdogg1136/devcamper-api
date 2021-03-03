const nodeGeocoder = require("node-geocoder");

//////////////////////////////////
//  GeoCoder Code for Map Functionality
//////////////////////////////////
var options = {
    provider: process.env.GEOCODER_PROVIDER,
    httpAdapter: 'https',
    apiKey: process.env.GEOCODER_API_KEY,
    formatter: null
  };
   
  var geocoder = nodeGeocoder(options);

  module.exports = geocoder;

