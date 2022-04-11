
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

// When udp server receive message.
server.on('message', function (message, remote) {
  console.log(' ' + remote.address + ' : ' + remote.port + ' - ');
  console.log('Message data: ' + message);
  let msg = String(message);

  let userd = msg.split(' ');

  const [request, usr, pwd] = userd;

  const user = findUser(usr, pwd);

  const { read, write, execute } = user.permissions;

  console.log('Users info: ');
  console.log(user);

  switch (request.slice(0, request.length - 1)) {
    case 'read': {
      if (read == true) {
        console.log(`User ${user.username} has permissions to read file `);
        fs.readFile('text.txt', 'utf8', (error, data) => {
          if (error) {
            console.log(error);
            return;
          } else {
            console.log('File content: \n');
            console.log(data);
          }
        });
      } else {
        console.log(
          `User ${user.username}does not have permissions to read file `
        );
      }

      break;
    }
    case 'write': {
      if (write == true) {
        console.log(`User ${user.username} is allowed to write on file `);

        const content = userd;
        fs.writeFile('text.txt', content, (err) => {
          if (err) {
            console.log('Write file exception ' + err);
          } else {
            console.log('File written successfully ');
          }
        });
      } else {
        console.log(
          `User ${user.username}does not have permissions to write on file `
        );
      }
      break;
    }
    case 'execute': {
      if (execute == true) {
        if (user.permissions.write == false) {
          console.log(
            `User ${user.username} has permissions to open file  {readonly}`
          );
          exec(
            'chmod 0444 text.txt && xdg-open text.txt',
            (error, stdout, stderr) => {
              if (error) {
                console.log(`error: ${error.message}`);
                return;
              }
              if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
              }
              console.log(`stdout: ${stdout}`);
            }
          );
        } else {
          console.log(
            `User ${user.username} has permissions  to open file  {read-write}`
          );
          exec(
            'chmod u=rwx,g=r,o= text.txt && xdg-open text.txt',
            (error, stdout, stderr) => {
              if (error) {
                console.log(`error: ${error.message}`);
                return;
              }
              if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
              }
              console.log(`stdout: ${stdout}`);
            }
          );
        }
      } else {
        console.log(
          `User ${user.username} does not have permissions to execute files `
        );
      }
      break;
    }
    case 'ls': {
      if (execute == true) {
        console.log(`User ${user.username} has permissions to list all files `);

        exec('ls -la', (error, stdout, stderr) => {
          if (error) {
            console.log(`error: ${error.messagee}`);
            return;
          }
          if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
          }
          console.log(`stdout: ${stdout}`);
        });
      }
    }

    default: {
      console.log('Wrong command ');
    }
  }

  let msgResponse = 'Request sent successfully ';

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


