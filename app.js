var express = require('express'),
  exphbs  = require('express-handlebars'),
  request = require("request"),
  url = require('url');

var helpers = require("./helpers")

var port = process.env.PORT || 4000;
var rootDir = __dirname;

// handlebars config
var hbs = exphbs.create({
  defaultLayout: 'main',
  helpers : helpers
});

var app = express();

// express config
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.set('views', rootDir + '/views');
app.use(express.static('public'));

// serve skeleton from node_modules
app.use('/css', express.static(__dirname + '/node_modules/skeleton-css/css/'));

var convertURL = function(completeURL) {
  var parsed = url.parse(completeURL);
  // TODO: solid url parsing
  var urls = [];
  parsed.pathname.split("/view").forEach(function(d){
    if(d) {
      var jsonUrl = parsed.protocol + "//" + parsed.host + "/" + d.split("/")[1] + ".json";
      urls.push(jsonUrl)
    }
  })
  return urls
}

function fetchJSON(url, callback) {
  console.log("fetching %s", url);
  request(url, function(err, res, body) {
    if(err) throw err
    callback (JSON.parse(body))
  });
}

app.get('/', function (req, res) {
  res.render('home')
})

app.get('/p/', function (req, res) {

   var url = req.query.url;
   // TODO validate URI

   var urls = convertURL(url);
   var url = urls[urls.length-1];
   //TODO: pass whole array
   fetchJSON(url, function(data){
    console.log(data);
    res.render('parser', {
      title : data.title,
      url : url,
      story : data.story,
      data : data
    });
  })


});

app.listen(port, function () {
  console.log('Example app listening on port %d !', port);
});
