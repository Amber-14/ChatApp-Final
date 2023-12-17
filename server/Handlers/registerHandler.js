
function registerHandler(socket, user) {
  let username = user.name;
  if (isAlphabetOnly(username)) {
    if ((!clients.get(socket)) && isValidUserName(username)) {
      console.log("A client registered!")
      //we have to return all connected clients username, so that user can choose whom to send msg
      if (clients.size >= 0) {
        const arr = []
        clients.forEach(v => {
          arr.push(v)
        })

        //socket.write(`Users available to chat-: ${JSON.stringify(arr)}`); //vulnerable
        //let msg = `Users available to chat-: ${JSON.stringify(arr)}`; //vulnerale
        //let msg = `${JSON.stringify(arr)}`;
        let msg = arr;
        socket.emit("registered", msg);

      }
      //else{
      //   let msg = "No user to chat!";  //vulnerable
      //   socket.write(serverResponse(msg)) 
      // }
      //store every new client in the map,having socket obj as key and client username as value.
      clients.set(socket, user); //key:socket, value:userDetails.
      //console.log("user- "+user+" ,socket- "+socket);
      //let msg = `${username} has joined the chat.\n`;  //vulnerable
      //let msg = username;
      const msg = user;
      broadcast("welcome", msg, socket);
      return;
    } else {
      //socket.write(`Either this client is already registered or ${username} username is not available !`) //vulnerable
      //let msg = `Either this client is already registered or ${username} username is not available !`;
      //let msg = username;
      const msg = `${username}`;
      socket.emit("register_failed", msg);
    }
  }
  else {
    let msg = "username should be of max length 30"
    socket.emit('register_failed', msg);
  }
}

//function to check the username is already regestered.
function isValidUserName(username) {
  for (let [socket, val] of clients) {
    if (val.name.toLowerCase() === username.toLowerCase()) {
      return false;
    }
  }
  return true;
}

//function to validate username data types and its length.
function isAlphabetOnly(input) {
  // Check if string length is greater than 30
  if (input.length > 20) {
    return false;
  }

  for (var i = 0; i < input.length; i++) {
    var charCode = input.charCodeAt(i);
    if (!(charCode === 32 || (charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122))) {
      return false;
    }
  }
  return true;
}

module.exports = registerHandler;

