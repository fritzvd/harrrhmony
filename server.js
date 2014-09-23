
var express = require('express')
var app = express();
app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/'))
// app.get('/', function(request, response) {
//     response.send('Hello World!')
// })
app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'))
})

// var io = require('webrtc.io').listen(8000);

// this is a simple wrapper around socket.io, so you can define your own events
// like so:
// io.sockets.on('connection', function(socket) {
//   socket.on('chat', function(nick, message) {
//     socket.broadcast.emit('chat', nick, message);
//   });
// });
