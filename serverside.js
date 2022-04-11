const fs=require('fs');
var PORT = 4445;

var HOST = '127.0.0.1';

var dgram = require('dgram');

var server = dgram.createSocket('udp4');

server.on('listening', function () {

    var address = server.address();

    console.log('UDP Server listening on ' + address.address + ":" + address.port);

});

 

server.on('message', function (message, remote) {
    console.log(remote.address + ':' + remote.port +' - ' + message);

if(message='read'){
   
            server.send(fs.readFileSync('text.txt','utf-8'),remote.port,remote.address); 
}
else if(message='write'){
        if(remote.address=='127.0.0.1'){
            let data="Pershendetje";
            fs.writeFileSync('text.txt',data);
        }
        else{
            server.send("You don't have access to write in a file", remote.port,remote.address);
        }
       }
else if(message='delete'){
    if(remote.address=='127.0.0.1'){

        fs.unlinkSync(text.txt);
        server.send('Deleted file',remote.port,remote.address);
    }
     else{
         server.send('Access denied',remote.port,remote.address);
     }
    }
     else{
       var msgResponse="Welcome";

       server.send(msgResponse, 0, msgResponse.length, remote.port, remote.address, function(err, bytes) {

    if (err) throw err;

     console.log('UDP server message sent to ' + remote.address +':'+ remote.port);

});
}
});

server.bind(PORT, HOST);