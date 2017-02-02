var express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

io.set('transports', [
    'websocket'
  , 'jsonp-polling'
  , 'htmlfile'
  , 'xhr-polling'
  , 'flashsocket'
]);
//alert('test');
var port = process.env.PORT || 3000; // if no port is detected, default to 3000
server.listen(port);

// routing
app.get('/', function (request, response) {
	response.sendfile(__dirname + '/index.html');
});

// routing
app.get('/notifyclient/:id', function (request, response){
	var socket=null;
	var usersession = request.params.id;
	//alert('usersession: ' +usersession);
//alert('connections: ' +connections);
//alert('connections[usersession]: ' +connections[usersession]);
	if(connections && connections!==null && connections[usersession]){
		socket = connections[usersession];
		//for now the message is hard coded as success.
		socket.volatile.emit('updatecart', usersession, 'Update_Success');
		response.writeHead(200, {"Content-Type": "text/plain"});
		response.end("fired updatecart uid:"+usersession+"\n");
	}else{
		response.writeHead(404, {"Content-Type": "text/plain"});
		response.end("Testing by Ahmadou: User not connected. Repeat call.\n");
	}
});

// usernames which are currently connected to the chat
//var usernames = {};

// list of connections
var connections={};

io.sockets.on('connection', function (socket) {

	// when the client emits 'adduser', this listens and executes
	socket.on('adduser', function(sessionkey){
		// we store the username in the socket session for this client
		socket.sessionkey = sessionkey;
		// add the client's username to the global list
		connections[sessionkey] = socket;
		// echo to client they've connected
		socket.emit('updatechat', 'SERVER', 'you have connected');
	});

	// when the user disconnects.. perform this
	socket.on('disconnect', function(){
		// remove the username from global usernames list
		delete connections[socket.sessionkey];
	});
/*
	// when the client emits 'sendchat', this listens and executes
	socket.on('sendchat', function (data) {
		// we tell the client to execute 'updatechat' with 2 parameters
		io.sockets.emit('updatechat', socket.username, data);
	});

	// when the client emits 'adduser', this listens and executes
	socket.on('adduser', function(username){
		// we store the username in the socket session for this client
		socket.username = username;
		// add the client's username to the global list
		usernames[username] = username;
		// echo to client they've connected
		socket.emit('updatechat', 'SERVER', 'you have connected');
		// echo globally (all clients) that a person has connected
		socket.broadcast.emit('updatechat', 'SERVER', username + ' has connected');
		// update the list of users in chat, client-side
		io.sockets.emit('updateusers', usernames);
	});

	// when the user disconnects.. perform this
	socket.on('disconnect', function(){
		// remove the username from global usernames list
		delete usernames[socket.username];
		// update list of users in chat, client-side
		io.sockets.emit('updateusers', usernames);
		// echo globally that this client has left
		socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
	});
	
	*/
});