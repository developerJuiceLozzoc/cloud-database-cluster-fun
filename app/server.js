const fs = require('fs');
const express = require("express")
const app = express()
const PORT = process.env.PROXY_PORT || 4000;
const {Client} = require("pg");
const bp = require('body-parser')

const {createReadstreamForPath,
  sshConnect,
  sshDisconnect
} = require("./helpers/sshHelpers")

const { createMoviesTable,
    createTagsTable,
    createTagsRelationshipsTable,
    Movie,
    createPiStatsTable,
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
    selectPiStatToUpdate,
    selectStatsOfAllPis,
    updatePiStatString,
    createPiStatTimestampe,
} = require("./model/model.js")
const {useClientToBulkInsert} = require("./sqlStringMaker.js")


app.use(express.static("../client/build"))
app.use(bp.json())
// app.use(function(req, res, next) {
//   res.on('close', function() {
//     console.log('close')
//   })
//   next()
// })
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
app.get("/stream",function(req,res){
  const {path,size} = req.query;
  console.log(path);
 //  const headers = {
 //    "Accept-Ranges": "bytes",
 //    // "Content-Type": "video/mp4",
 // };
 // res.writeHead(206, headers);

 sshConnect(function(){  getFileStoE(res,path) } );
});


app.get("/api/getAllPiStats", async function(req,res){
  let info = req.body
  try {
    const pgclient = new Client()
    await pgclient.connect()
    let tempresponse = await pgclient.query(selectStatsOfAllPis())
    res.status(200).send(tempresponse.rows)
  }
  catch(e){
    console.log(e);
  }
})

app.get("/api/tags", async function(req,res){
  let page = 1
  try {
    const pgclient = new Client()
    await pgclient.connect()
    let tags = await pgclient.query(readAllTags())
    console.log(tags.rows.length);
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
      await pgclient.end();
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
    console.log(moviFilter);
    let tempresponse = await pgclient.query(selectMovieIdsWithTags(andtags,moviFilter.join(",")))
    let ids = tempresponse.rows.map(function(item){
      return item.movieid
    })
    if(ids.length){
      let temp2response = await pgclient.query(selectMoviesByManyIds(ids.join(",")))
      res.status(200).send(temp2response.rows)
    }else {
      res.status(200).send([])
    }
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
    // await pgclient.query(createPiStatsTable())
    // await pgclient.query(createMoviesTable())
    // await pgclient.query(createTagsRelationshipsTable())
    // await pgclient.query(createPiStatsTable())
    // useClientToBulkInsert(pgclient,'../meaty/tvshowdump/pi/tvshow.csv')
    // useClientToBulkInsert(pgclient,'../meaty/tvshowdump/pi/movies.csv')
    /* end insert */

    /* read count */
    let tags = await pgclient.query(readTagCount())
    let movies = await pgclient.query(readMovieCount())
    let movietags = await pgclient.query(readTaggedMoviesCount())
    console.log(tags.rows[0].count,movies.rows[0].count,movietags.rows[0].count);
    /*        */
    require("./helpers/clusterReporting")
    console.log("app is listening",PORT)
  }
  catch(e){
    console.log(e);
      // await pgclient.end()
  }

})
