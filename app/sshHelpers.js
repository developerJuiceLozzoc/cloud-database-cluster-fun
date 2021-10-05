var sshClient = require('ssh2').Client;
const sshConfig = {
     host: '10.0.0.206',
     port: 22, // Normal is 22 port
     username: 'pi',
     password: 'cloud[:P]wifi'
     // You can use a key file too, read the ssh2 documentation
};


let conn = new sshClient()
let sftp;

function createReadstreamForPath(path){
  return sftp.createReadStream(path)
}


function sshConnect(callback){
  if(conn){
    conn.end();
  }
  conn = new sshClient()
  conn.on('ready', function () {
  conn.sftp(function (err, sftpResponse) {
      if (err) throw err;
      sftp = sftpResponse;


      callback()
  });
  }).connect(sshConfig);

}
function sshDisconnect(callback){
  if(conn){
    conn.end();
  }
  conn = null;
}


module.exports = {
  sshConnect,
  sshDisconnect,
  createReadstreamForPath,
  
}
