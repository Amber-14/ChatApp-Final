function closeHandler(socket){
    //let msg = `${clients.get(socket)} has left the chat.\n`
    let msg = clients.get(socket).name;
    broadcast('goodBye',msg,socket);
    // end the connection and delete the socket from map
    console.log('Client has left the chat');
    clients.delete(socket);
}

module.exports = closeHandler;