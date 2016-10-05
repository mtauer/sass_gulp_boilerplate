var path = require('path');
var express = require('express');
var app = express();

var port = 3000;
var staticPath = path.join(__dirname, '/public');

app.use(express.static(staticPath));
app.listen(port, function() {
  console.log('listening to port ' + port)
});
