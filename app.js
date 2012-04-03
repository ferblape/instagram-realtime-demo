var express = require('express');

var config = {
  port: function() {
    return (process.env.NODE_ENV== 'production') ? 80 : 3000;
  }
};

var app = express.createServer();

app.get('/', function(req, res){
    res.send('Hello World');
});

app.get('/callback', function(request, response){
  if(request.param("hub.challenge") != null){
    response.send(request.param("hub.challenge"));
  } else {
    console.log(JSON.parse(response.body));
  }
});

app.listen(config.port(), function(){
  console.log("Listening in port %d", config.port());
});

