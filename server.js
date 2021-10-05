var Client = require('ssh2').Client;
const express = require('express');
let app = express()

var config = {
     host: '10.0.0.206',
     port: 22, // Normal is 22 port
     username: 'pi',
     password: 'cloud[:P]wifi'
     // You can use a key file too, read the ssh2 documentation
};

const get = (writeStream,fullpath) => {
  console.log(fullpath);
    sftp.connect(config).then(() => {
        return sftp.get(fullpath, writeStream);
    }).then(response => {
      sftp.end();
      resolve(response);
    });

};

app.get("/stream/:movieid",function(req,res){
  const {movieid} = req.params;

  get(res,'/home/pi/Videos/movies/Fight.Club\ 1999\ YIFY.BrRip.mp4')
})
