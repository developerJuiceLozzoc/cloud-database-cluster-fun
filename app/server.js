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
    selectMoviesByManyIds,
    readTagCount,
    readAllTags,
    readMovieCount,
    readTaggedMoviesCount,
    filterMovieids,
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

app.get("/api/tags", async function(req,res){
  let page = 1
  try {
    const pgclient = new Client()
    await pgclient.connect()
    let tags = await pgclient.query(readAllTags())
    res.status(200).send({
      tags: tags.rows,
      next: page + 1,
    })
    await pgclient.end();
  }
  catch(e){
      res.status(304).send(e)
  }

});

app.get('/api/movies', async function(req,res){
  const {movieids} = req.query;
  try {
    const pgclient = new Client()
    await pgclient.connect()

    tempresponse = await pgclient.query(selectMoviesByManyIds(movieids))
    res.status(200).send(tempresponse.rows)
    await pgclient.end();
  }
  catch(e){
    console.log(e);
      res.status(400).send()
  }
})

app.get("/api/search/epoch", async function(req,res){
  res.end()
});


app.get("/api/search/movies", async function(req,res){
  const {andtags,ortags,type} = req.query;
  try {
    const pgclient = new Client()
    await pgclient.connect()
    let tags = [];
    tags.push(andtags ? andtags.split(","):  [])
    tags.push(ortags ? ortags.split(","):  [])

    let moviFilter = tags.flatMap((x)=>x)
    tempresponse = await pgclient.query(selectMovieIdsWithTags(andtags,moviFilter.join(",")))
    res.status(200).send(tempresponse.rows)
    await pgclient.end();
  }
  catch(e){
    console.log(e);
      res.status(400).send()
  }
})

app.listen(PORT,async function(){
  try {
    const pgclient = new Client()
    await pgclient.connect()

    /* insert */
    // await pgclient.query(createMoviesTable())
    // await pgclient.query(createTagsRelationshipsTable())
    // useClientToBulkInsert(pgclient,'../meaty/tvshowdump/pi/tvshow.csv')
    // useClientToBulkInsert(pgclient,'../meaty/tvshowdump/pi/movies.csv')
    /* end insert */

    /* read count */
    // let tags = await pgclient.query(readTagCount())
    // let movies = await pgclient.query(readMovieCount())
    // let movietags = await pgclient.query(readTaggedMoviesCount())
    // console.log(tags.rows[0].count,movies.rows[0].count,movietags.rows[0].count);
    /*        */

    console.log("app is listening")
  }
  catch(e){
    console.log(e);
      // await pgclient.end()
  }

})
