var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var path = require('path');


var port = process.env.PORT || 4000;
var app = express();


app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(express.static(__dirname + '/view/dist/view/'));

app.use(function(req, res) {
   res.sendFile(path.join(__dirname, '/view/dist/view', 'index.html'));
});


app.get('*', function(req, res){
   res.send('This is Server Side Page');
});


app.listen(port, function(){
 console.log('Listening on port ' + port);
});