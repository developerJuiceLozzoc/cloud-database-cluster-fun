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

app.listen(PORT,async function(){
  try {
    const pgclient = new Client()
    await pgclient.connect()
    /* insert */
    await pgclient.query(createPiStatsTable())
    await pgclient.end()
    console.log("app is listening",PORT)
  }
  catch(e){
    console.log(e);
  }

})
