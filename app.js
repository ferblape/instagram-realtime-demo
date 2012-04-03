var express = require('express'),
    util = require('util');

var port = process.env.PORT || 3000;

var app = express.createServer();

app.use(express.bodyParser());

app.get('/', function(req, res){
    res.send('Hello World');
});

app.get('/callback', function(request, response){
  if(request.param("hub.challenge") != null){
    response.send(request.param("hub.challenge"));
  } else {
    console.log("ERROR on suscription request: %s", util.inspect(request));
  }
});

app.post('/callback', function(request, response){
  console.log(request.body);
});

app.listen(port, function(){
  console.log("Listening in port %d", port);
});

