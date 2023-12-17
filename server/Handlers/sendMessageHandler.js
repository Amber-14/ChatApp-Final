
function sendMessageHandler(socket,message){

    const recipientSocket = [...clients.keys()].find((s) => clients.get(s).name === message.sendTo); //sendTo is the username, whom sendBy user wants to send msg
        if (recipientSocket) {
  
          if(message.text === '!Stop'){
            let msg = JSON.stringify({
              action:'StopChatting',
              sendBy: clients.get(socket),
              text: `${clients.get(socket)} have ended the chat you!`
            })
            recipientSocket.write(msg);
          }else{
            // let msg = {
            //   //action:'sendMessage',
            //   sendBy: clients.get(socket),
            //   text:message.text
            // }
            recipientSocket.emit("sendMessage",message);
             //console.log(message);
          }
          
          //socket.write("Message sent") //--vulnerable --succes message

         } 
        //else {
        //   // let msg = `User ${message.sendTo} not found.\n` //in bw process the user left the chat...
        //   // socket.write(serverResponse(msg));
        // }
}

module.exports = sendMessageHandler;