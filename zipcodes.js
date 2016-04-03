var express = require('express');
var fs = require('fs');
var fsp = require('fs-promise');
var request = require('request-promise');
var cheerio = require('cheerio');
var app = express();
var db = require('diskdb');
var promise = require('promise');

db.connect(__dirname + '/database', ['zipcodes']);

url = 'https://www.zipcodeapi.com/rest/tp7SmgPN77yBdPxYWWtxVTRUiGquTFUn42fqi5eqcM1qCyoyvS5rLXl3DLyxrtVv/city-zips.json/';

var getUrl = function (city, state) {
  return url + '/' + city + '/' + state;
}

var getZipcodeFromDb = function (city, state) {
  return db.zipcodes.find({name: city + '_' + state});
}

var saveZipcodes = function (city, state, zipcodes) {
  db.zipcodes.save({
                     name: city + '_' + state,
                     zipcodes: zipcodes
                   });
}

var getZipcodesFromApi = function (city, state) {
  return request(getUrl(city, state)).then(function (response) {
    var zipcodes = JSON.parse(response)['zip_codes'];

    console.log('zipocdes', zipcodes);

    saveZipcodes(city, state, zipcodes)
    return zipcodes;
  }).catch(function (err) {
    if (err) {
      console.log('error', err)
    }
  })
}

var getZipcode = function (city, state) {
  var zipcodes = getZipcodeFromDb(city, state);

  if (zipcodes.length) {
    return new Promise(function (resolve, error) {
      resolve(zipcodes[0].zipcodes);
    });
  } else {
    return getZipcodesFromApi(city, state);
  }
}

exports = module.exports = getZipcode;