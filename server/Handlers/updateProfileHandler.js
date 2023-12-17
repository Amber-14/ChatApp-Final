//function

function updateProfileHandler(socket,data){
    let msg = {};
    // fetch this user from clients map
   

    //update the user's data into map

    if(data.avatar !== ''){
        clients.get(socket).avatar = data.avatar;
        msg = {
            name: clients.get(socket).name,
            avatar: data.avatar
        };
    }
    else if(data.status!==''){
        clients.get(socket).status = data.status;
        msg = {
            name: clients.get(socket).name,
            status: data.status
        }
    }
    //console.log(msg);

    //broadcast this to every connected clients
    
    broadcast("updateProfile", msg, socket);

}

module.exports = updateProfileHandler;