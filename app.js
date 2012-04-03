var express = require('express'),
    util = require('util'),
    app = express.createServer(),
    instagram = require('./src/instagram_client.js');

var port = (process.env.PORT || 3000),
    instagramClient = new instagram.Client(process.env.instagram_client_id);

app.use(express.bodyParser());

app.get('/', function(request, response){
  response.sendfile(__dirname + '/views/index.html', function(err, data){
    if(err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }
    response.writeHead(200);
    response.end(data);
  });
});

app.get('/callback', function(request, response){
  if(request.param("hub.challenge") != null){
    response.send(request.param("hub.challenge"));
  } else {
    console.log("ERROR on suscription request: %s", util.inspect(request));
  }
});

app.post('/callback', function(request, response){
  // request.body is a JSON already parsed
  instagramClient.searchAndPublish(request.body);
  response.writeHead(200);
});

app.listen(port, function(){
  console.log("Listening in port %d", port);
});

