var express = require('express'),
  exphbs  = require('express-handlebars'),
  path = require('path');

var port = process.env.PORT || 4000;
var rootDir = __dirname;

var app = express();

// express config
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.set('views', rootDir + '/views');
app.use(express.static('public'));

// serve skeleton from node_modules
app.use('/css', express.static(__dirname + '/node_modules/skeleton-css/css/'));

app.get('/', function (req, res) {
  res.render('home');
});

app.listen(port, function () {
  console.log('Example app listening on port %d !', port);
});
