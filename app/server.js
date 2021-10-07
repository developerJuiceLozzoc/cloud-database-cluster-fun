const fs = require('fs');
const express = require("express")
const app = express()
const PORT = 3000
const {Client} = require("pg");

const {createReadstreamForPath,
  sshConnect,
  sshDisconnect
} = require("./sshHelpers")

const { createMoviesTable,
    createTagsTable,
    createTagsRelationshipsTable,
    Movie
} = require("./model/schema.js");

const { createBulkTags,
    createInsertMovieString,
    selectMovieIdsWithTags,
    readAllTags,
    readAllMovies,
    readAllTaggedMovies
} = require("./model/model.js")
const {useClientToBulkInsert} = require("./sqlStringMaker.js")


app.use(express.static("../client/build"))

function getFileStoE(writeStream, remoteFile) {
  const readStream = createReadstreamForPath(remoteFile)
  readStream.pipe(writeStream)
  readStream.on('error', function (err) { // To handle remote file issues
    console.log(err.message);
    sshDisconnect();
    readStream.destroy();
    writeStream.destroy();
  });
  readStream.on('end', function () {
      sshDisconnect()
  });
  writeStream.on('finish', function () {
      console.log(`${remoteFile} has successfully downloaded!`);
  });
}

/* how can i do this? perhaps... i can allow clicking of the player to allow
users to chose where they want to start in the watching */
function getFileChunked(writeStream,remoteFile,start,end){
  const readStream = createReadstreamForPath(remoteFile)
  readStream.pipe(writeStream,{start,end});
  readStream.on('error', function (err) { // To handle remote file issues
      console.log(err.message);
      sshDisconnect()
      rstream.destroy();
      writeStream.destroy();
  });
  readStream.on('end', function () {
      conn.end();
  });
  writeStream.on('finish', function () {
      console.log(`${remoteFile} has successfully downloaded!`);
  });
}



/*
// stream/56?size=bits
app.get("/stream/:movieid",function(req,res){
  const {movieid} = req.params;
  const range = req.headers.range;
  const videoSize = req.query.size;
  const CHUNK_SIZE = 10 ** 6*; // 1MB

  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
  const contentLength = end - start + 1;
 const headers = {
   "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Content-Length": contentLength,
   "Accept-Ranges": "bytes",
   "Content-Type": "video/mp4",
 };
  res.writeHead(206, headers);

  getFile(res,'/home/pi/Videos/movies/Fast And Furious/Fast.And.Furious.9. 2021 SomeCoontS.avi)
})
*/
app.get("/stream/:movieid",function(req,res){
  // const {movieid} = req.params;
  let movieid = '/home/pi/Videos/movies/Venom.Coast 2021 GalaxyRG.mkv'
  // let movieid = '/home/pi/Videos/movies/The Matrix/The.Matrix.Reloaded 2003 anoXmous.mp4'
 //  const headers = {
 //    "Accept-Ranges": "bytes",
 //    // "Content-Type": "video/mp4",
 // };
 // res.writeHead(206, headers);
 console.log(movieid);

 sshConnect(function(){     getFileStoE(res,movieid) } );
 console.log(movieid);
});


app.get("/api/search/epoch", async function(req,res){
  res.end()
});

app.get("/api/search/movies", async function(req,res){
  console.log(req.query);
  try {
    const pgclient = new Client()
    await pgclient.connect()
    let tags = await pgclient.query(readAllTags())
    let movies = await pgclient.query(selectMovieIdsWithTags(req.query.tags))
    console.log(tags,movies)
    res.status(200).send()
    await pgclient.end();
  }
  catch(e){
      res.status(400).send()
  }
})

app.listen(PORT,async function(){
  try {
    const pgclient = new Client()
    await pgclient.connect()
    let tags = await pgclient.query(readAllTags())
    let movies = await pgclient.query(readAllMovies())
    let movietags = await pgclient.query(readAllTaggedMovies())
    console.log(tags.rows,movies.rows,movietags.rows);
    // await pgclient.query(createMoviesTable())
    // await pgclient.query(createTagsRelationshipsTable())
    // useClientToBulkInsert(pgclient)

    console.log("app is listening")
  }
  catch(e){
    console.log(e);
  }

})
