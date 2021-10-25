const fs = require('fs');
const express = require("express")
const app = express()
const PORT = process.env.COLLECTION_PORT || 4000;
const {Client} = require("pg");
const bp = require('body-parser')

const {
  createPiStatTimestampe,
  createPiIdentityRecord,
  selectPiByHostname,
  createWatchHistoryItem,
  readAllPiesInfo,
  readStatsOfAllPis
} = require("./model/model.js")
const {
  createPiStatsTable,
  createPiIdentityTable,
  createWatchHistoryTable,
} = require("./model/schema.js");

/* Enviroment
PGHOST=
PGUSER=
PGPASSWORD=
PORT=
*/
app.use(bp.json())


app.post('/api/analytics/uptime', async function(req,res){
  let info = req.body
  try {
    const pgclient = new Client()
    await pgclient.connect()
    console.log(`Ip address from Express: ${req.ip}`);
    let query1 = createPiStatTimestampe(info)
    let tempresponce = await pgclient.query(query1.text,query1.values)
    await pgclient.end()
    res.status(201).end()
  }
  catch(e){
    console.log(e);
    res.status(300).end()
  }
})
app.post('/api/pies/ping', async function(req,res){
  const pi = req.body
  const pgclient = new Client()
  try {
    await pgclient.connect()
    res.status(201).end()
    console.log("ping 1");
    let tempresponse1 = await pgclient.query(selectPiByHostname(pi.submask))
    if(tempresponse1.rows.length === 0) {
	console.log('ping 2')
      let tempresponse2 = await pgclient.query(createPiIdentityRecord(req.body));
      await pgclient.end()
      return;
    }
    await pgclient.end()
  } catch (e) {
    console.log(e);
    res.status(500).end()
    await pgclient.end()
  }
})
app.get('/api/pies/names', async function(req,res){
  try {
    const pgclient = new Client()
    await pgclient.connect()
	console.log('ping 4')
    let  temprespojnse = await pgclient.query(readAllPiesInfo())
    await pgclient.end()
    res.status(200).send(temprespojnse.rows)
  } catch (e) {
    console.log("errror",e);
    res.status(500).end()
  }
});
app.get("/api/pies/stats", async function(req,res){
  try {
    const pgclient = new Client()
    await pgclient.connect()
    let  temprespojnse = await pgclient.query(readStatsOfAllPis())
    await pgclient.end()
    res.status(200).send(temprespojnse.rows)
  } catch (e) {
    res.status(500).end()
  }
});


app.get('/stream', async function(req,res){
  const {path,size} = req.query;
  const range = req.headers.range;
  const CHUNK_SIZE = (10 ** 6) * 2; // 1MB
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, size - 1);
  const contentLength = end - start + 1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${size}`,
    "Content-Length": contentLength,
    "Accept-Ranges": "bytes",
  };
  try{
    res.writeHead(206, headers);
    fs
    .createReadStream(path, { start, end })
    .pipe(res);
  }
  catch(e){
    res.status(500).send(e)
  }
})

app.listen(PORT,async function(){
  try {
    const pgclient = new Client()
    await pgclient.connect()
    /* insert */
    await pgclient.query(createPiStatsTable());
    //await pgclient.query(createPiIdentityTable());
   /*        */

    await pgclient.end()
    require('./helpers/clusterReporting.js')
    console.log("app is listening",PORT)
  }
  catch(e){
    console.log(e);
  }

})

