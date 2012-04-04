# Instagram realtime demo

This Node.js application implements a client of [Instagram realtime API](http://instagram.com/developer/realtime/):

  - it receives notifications of new activity in a given geography (in this case, the center of Madrid, Spain),
  - and, if the notification is valid, the last photo of the geography is fetched from the traditional API,
  - and, if this photo is valid, it is send through a websocket channel named 'photos',
  - then, a websocket in the frontend view (`index.html`) gets the photo and represents it in a map

Each of these two functionalities is performed in the files:

  - `app.js`: which contains the main Node.js application
  - `index.html`: which renders the map and gets notifications through a websocket from the Node.js application

To see the project on-line visit this URL: (http://instagram-realtime-demo.herokuapp.com/).

## Special thanks

- [@denegro](http://denegro.com) for the HTML and the CSS
- [@cartodb](http://cartodb.com) for the styling of the map
- [@heroku](http://heroku.com) for hosting the application and making the deploy in such a trivial thing
