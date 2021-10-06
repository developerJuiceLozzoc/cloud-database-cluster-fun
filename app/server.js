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
} = require("./model/model.js")


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
    console.log(tags.rows);
    await pgclient.end();
    console.log("app is listening")

  }
  catch(e){
    console.log(e);
  }

})



async function connect() {
    try {

        const client = new Client()
        await client.connect()

//        await client.query(createMoviesTable())
//        console.log("movies created")
//        console.log("tags created")
//        await client.query(createTagsRelationshipsTable())
//       await client.query(createBulkTags())
        await client.query(createTagsTable())
        await pgclient.query(`
         INSERT INTO tags (tagName) VALUES('movie');
         INSERT INTO tags (tagName) VALUES('cartoon');
         INSERT INTO tags (tagName) values('anime');
         INSERT INTO tags (tagName) values('scary');
         INSERT INTO tags (tagName) values('drama');
         INSERT INTO tags (tagName) values('for couples');
         INSERT INTO tags (tagName) values('anime');
         INSERT INTO tags (tagName) VALUES('funny');
         INSERT INTO tags (tagName) VALUES('feels good');
         INSERT INTO tags (tagName) values('food');
         INSERT INTO tags (tagName) values('porn');
         INSERT INTO tags (tagName) values('sports');
         INSERT INTO tags (tagName) values('evil');
         INSERT INTO tags (tagName) values('folklore');
         INSERT INTO tags (tagName) VALUES('robots');
         INSERT INTO tags (tagName) VALUES('social commentary');
         INSERT INTO tags (tagName) values('space');
         INSERT INTO tags (tagName) values('post-apocalyptic');
         INSERT INTO tags (tagName) values('love story');
         INSERT INTO tags (tagName) values('bad acting');
         INSERT INTO tags (tagName) VALUES('geeky');
         INSERT INTO tags (tagName) VALUES('live action');
         INSERT INTO tags (tagName) VALUES('marvel');
         INSERT INTO tags (tagName) VALUES('dc');
        `);
        console.log("bulk tag inserted")
        let tags = await client.query(readAllTags())
        console.log(tags)

        await client.end();


    }
    catch(e){
        console.log(e)
    }
}

// connect()
