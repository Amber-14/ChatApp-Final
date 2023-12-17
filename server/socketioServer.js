const { Server } = require('socket.io');

// Create a Socket.io server by passing the HTTP server object
const io = new Server(4000,{
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  },
  maxHttpBufferSize: 1e7, // Set limit to 10 MB
});

// Store the connected clients in a Map
global.clients = new Map();

//read filesName
const fs = require('fs')
const path = require('path')
const handlers = new Map();

const fullPath = path.join(__dirname, 'Handlers')
const files = fs.readdirSync(fullPath)

try { files.forEach( (file) => {
    //console.log(file)
    let fileNameWithoutExtension = file.substring(0,file.length-3);
    //console.log(fileNameWithoutExtension);
    let handler = require('./Handlers/'+ fileNameWithoutExtension);
    let actionName = file.substring(0,file.length-10);
    //console.log(actionName);
    handlers.set(actionName,handler);
}
 ) }
catch (error) { console.log(error) }

// Listen for the connection event
io.on('connection', (socket) => {
  console.log('A client has joined the chat');
  socket.emit("connected");

  //listen for all events
  socket.onAny((event,data) => {

    //check if this command is present in gloabal hashmap or not...
    if (handlers.has(event)) {
      handlers.get(event)(socket, data);
    } else {
      socket.write("Enter valid action!") // if user sends invalid command/action
    }
  });

  //handle error 
  socket.on("error",(err)=>{
    console.log(err + ' A client has disconnected.');
    let msg = clients.get(socket).name;
    broadcast('goodBye',msg,socket);
    clients.delete(socket);
  })
});



// Start the server
io.httpServer.on('listening', function () {
    console.log('listening on port', io.httpServer.address().port)
  })

  //Broadcast a message to all clients except the sender
function broadcast(evnt,msg,sender) {
  [...clients.keys()]
    .filter((client) => client !== sender)
    .forEach((client) => client.emit(evnt,msg));
}

global.broadcast=broadcast;




 