
const fs = require('fs');
const { exec } = require('child_process');
var dgram = require('dgram');

// users details
const db_users = [
  {
    username: 'valmira',
    password: '12345678',
    permissions: { read: true, write: true, execute: true },
  },

  {
    username: 'venera',
    password: '12345678',
    permissions: { read: true, write: true, execute: false },
  },
  {
    username: 'venera',
    password: '12345678',
    permissions: { read: true, write: true, execute: false },
  }
];

function findUser(user, password) {
  for (let i = 0; i < db_users.length; i++) {
    if (user == db_users[i].username && password == db_users[i].password) {
      return db_users[i];
    }
  }
  // user does not exits
  return null;
}

let PORT = 8882;
let HOST = '127.0.0.1';

// Create udp server socket object.
let server = dgram.createSocket('udp4');

// When udp server started and listening.
server.on('listening', function () {
  // Get and print udp server listening ip address and port number in log console.
  let address = server.address();
  console.log(
    'UDP Server listening on ' + address.address + ': ' + address.port
  );
});

// When udp server receives a message.
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
          server.send("You don't have access to write in the file", remote.port,remote.address);
      }
     }
else if(message='delete'){
  if(remote.address=='127.0.0.1'){

      fs.unlinkSync(text.txt);
      server.send('Deleted file',remote.port,remote.address);
  }
   else{
       server.send('Access denied');
   }
  }
   else{
     var msgResponse="Welcome";

     server.send(msgResponse, 0, msgResponse.length, remote.port, remote.address, function(err, bytes) {

  if (err) throw err;

   console.log('UDP server message sent to ' + remote.address +':'+ remote.port);

});
}

  server.send(
    msgResponse,
    0,
    msgResponse.length,
    remote.port,
    remote.address,
    function (err, bytes) {
      if (err) throw err;
      console.log(
        'UDP server message send to ' + remote.address + ':' + remote.port
      );
    }
  );
});
server.bind(PORT, HOST);


