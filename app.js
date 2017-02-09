//var express = require('express');
//var app = express();
//var http = require('http');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var logfmt = require('logfmt');
// var server = http.createServer(app);
 //var io = require('socket.io').listen(server);

/*server.listen(port, function() {
	console.log("Listening on " + port);
});*/
/*io.set('transports', [
    'websocket'
  , 'jsonp-polling'
  , 'htmlfile'
  , 'xhr-polling'
  , 'flashsocket'
]);*/
//var port = process.env.PORT || 3000; // if no port is detected, default to 3000
//server.listen(port);

// routing
/*
app.get('/', function (request, response) {
	response.sendFile(__dirname + '/index.html');
});
*/
app.use(logfmt.requestLogger());

app.get('/', function (request, response) {
	//response.send("ARI Makelim Push Server");
	response.sendFile(__dirname + '/index.html');
	//console.log("**** request: " + request);
	//console.log("**** response: " + response);
	
});

//app.use(logfmt.requestLogger());
// routing
app.get('/notifyclient/:id', function (request, response){
	var socket=null;
	var usersession = request.params.id;
	var ok = false;
	if(connections && connections!==null && connections[usersession] != null){
		socket = connections[usersession];
		if (socket.expired) {
			var message = "Session has expired. (E102)";
			response.writeHead(404, {"Content-Type": "text/plain"});
			response.end(message);
		} else {
		//for now the message is hard coded as success.
		socket.volatile.emit('updatecart', usersession, 'Update_Success');
		response.writeHead(200, {"Content-Type": "text/plain"});
		response.end("fired updatecart uid:"+usersession+"\n");
		}
	}else{
		var message = "Session not registered. (E100)";
		response.writeHead(404, {"Content-Type": "text/plain"});
		response.end(message);
		/*
		response.writeHead(404, {"Content-Type": "text/plain"});
		response.end("Testing by Ahmadou: User not connected. Repeat call.\n");
		*/
	}
});
//List all sessions
app.get('/listSessions293', function (request, response) {
	var items = 0;
	response.writeHead(200, {"Content-Type": "text/plain"});
	
	if (connections) {
		for (var connection in connections) {
			response.write(connection + "\n");
			items++;
		};
	} 
	
	if (items == 0) {
		response.write("No sessions registered.");
	} else {
		response.write("There are " + items + " active sessions.");
	}
	
	response.end();
});
// usernames which are currently connected to the chat
//var usernames = {};

//Get port
var port = Number(process.env.PORT || 3000); // if no port is detected, default to 5000
http.listen(port, function() {
	console.log("Listening on " + port);
});
// list of connections
var connections={};
// 'this' is the socket
io.on('connection', function (socket) {
	
	socket.on('disconnect', function() {
		if (this.usersession != "undefined") {
			delete connections[this.usersession];
		}
		console.log("**** disconnected session: " + this.usersession);
	});
	
	socket.on('error', function(err) {
		console.log("**** session error: " + this.usersession + "\n    error: " + err);
	});
	
	socket.on('close', function() {
		console.log("**** closed socket: " + this.usersession);
	});
	
	socket.on('connection_failed', function() {
		console.log("**** connection to browser failed for session: " + this.usersession);
	});
	
	// listen for client session registration and echo registration success 
	socket.on('register', function(usersession, callback) {
		if (callback != null) {
			callback('ok');
		}
		socket.usersession = usersession;
		socket.expired = false;
		connections[usersession] = socket;
		
		console.log("**** registered session: " + usersession);
		// when the client emits 'adduser', this listens and executes
	//socket.on('adduser', function(usersession){
		// we store the username in the socket session for this client
		//socket.usersession = usersession;
		// add the client's username to the global list
		//connections[usersession] = socket;
		// echo to client they've connected
		//socket.emit('updatechat', 'SERVER', 'you are connected');
	//});
		
		/* cleanup 
		for (var connection in connections) {
			console.log(connection);
		} */
	});
	
	socket.on('unregister', function() {
		console.log("**** unregistered session: " + this.usersession);
		socket.disconnect();
	});
	
});
/*
io.sockets.on('connection', function (socket) {

	// when the client emits 'adduser', this listens and executes
	socket.on('adduser', function(usersession){
		// we store the username in the socket session for this client
		socket.usersession = usersession;
		// add the client's username to the global list
		connections[usersession] = socket;
		// echo to client they've connected
		socket.emit('updatechat', 'SERVER', 'you are connected');
	});

	// when the user disconnects.. perform this
	socket.on('disconnect', function(){
		// remove the username from global usernames list
		delete connections[socket.usersession];
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
//});

