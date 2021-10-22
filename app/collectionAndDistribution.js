const fs = require('fs');
const express = require("express")
const app = express()
const PORT = process.env.COLLECTION_PORT || 4000;
const {Client} = require("pg");
const bp = require('body-parser')
const {
createPiStatTimestampe,
} = require("./model/model.js")
const {
  createPiStatsTable,
} = require("./model/schema.js");

/* Enviroment
PGHOST=
PGUSER=
PGPASSWORD=
PORT=
*/
app.use(bp.json())


app.post('/analytics/uptime', async function(req,res){
  let info = req.body
  try {
    const pgclient = new Client()
    await pgclient.connect()

    console.log(`Ip address from Express: ${req.ip}`);
    console.log(`Local SubnetMask: ${info.submask}`);

    let query1 = createPiStatTimestampe(info)
    let getresponce = await pgclient.query(query1.text,query1.values)

    await pgclient.end()
    res.status(201).end()

  }
  catch(e){
    console.log(e);
    res.status(300).end()
  }
})

app.get('/stream', async function(req,res){
  const {path,size} = req.query;
  const range = req.headers.range;
  const videoSize = size;
  // get video stats (about 61MB)
  const videoPath = path;
  // const videoSize = fs.statSync(videoPath).size;
  const CHUNK_SIZE = (10 ** 6) * 2; // 1MB

    const start = Number(range.replace(/\D/g, ""));

    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
    const contentLength = end - start + 1;
    const headers = {
      "Content-Range": `bytes ${start}-${end}/${videoSize}`,
      "Content-Length": contentLength,
      "Accept-Ranges": "bytes",
    };
    // res.writeHead(206, headers);

    const videoStream = fs.createReadStream(videoPath, { start, end });
    // videoStream.pipe(res)

})

app.listen(PORT,async function(){
  try {
    const pgclient = new Client()
    await pgclient.connect()
    /* insert */
    //await pgclient.query(createPiStatsTable())
    await pgclient.end()
    console.log("app is listening",PORT)
  }
  catch(e){
    console.log(e);
  }

})
