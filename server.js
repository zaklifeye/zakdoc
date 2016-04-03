var express = require('express');
var fs = require('fs');
var request = require('request-promise');
var cheerio = require('cheerio');
var app = express();
var getZipcode = require('./zipcodes');

var port = process.env.PORT || 8082;

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.render('index');
});

app.get('/zipcodes', function (req, res) {
  var city = req.query.city;
  var state = req.query.state;
  getZipcode(city, state).then(function (zipcodes) {
    res.send(zipcodes)
  })
});

app.get('/scrape', function (req, res) {
  // The URL we will scrape from - in our example Anchorman 2.


  url = 'https://www.zocdoc.com/search/searchresults?SpecialtyId=98' +
    '&IsSearchingByName=false' +
    '&Address=98177' +
    '&InsuranceId=-1' +
    '&InsurancePlanId=-1' +
    '&ProcedureId=12' +
    '&ProcedureChanged=false' +
    '&Gender=-1' +
    '&DayFilter=0' +
    '&LanguageId=-1' +
    '&LanguageChanged=false' +
    '&TimeFilter=AnyTime' +
    '&PatientTypeChild=' +
    '&SortSelection=0' +
    '&HospitalId=-1' +
    '&DirectoryType=&' +
    'Offset=80' +
    '&ReferrerType=' +
    '&SubmitSearchClicked=false' +
    '&_=1459686567526';

  // The structure of our request call
  // The first parameter is our URL
  // The callback function takes 3 parameters, an error, response status code and the html

  request(url).then(function(response) {

    // First we'll check to make sure no errors occurred when making the request
    var body = response.slice(8, response.length);
    body = JSON.parse(body);
    var pagination = body.pagination;
    var doctors = body.model.Doctors;

    console.log("in request", doctors);

    //if (!error) {
      // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality

      //var $ = cheerio.load(html);

      // Finally, we'll define the variables we're going to capture

      var title, release, rating;
      var json = {title: "", release: "", rating: ""};
    //}
    //res.render('index');
    res.send(doctors);
  }).catch(function (err) {
    if (err) {
      console.log('error', err)
    }
  })
})

app.listen(port, function () {
  console.log('Our app is running on http://localhost:' + port);
});
exports = module.exports = app;