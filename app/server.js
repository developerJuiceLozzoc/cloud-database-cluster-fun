const PORT = process.env.PROXY_PORT || 4000;
const ARCHAEIC_URL = process.env.COLLECTION_URL;
const COLLECTION_PORT = process.env.COLLECTION_PORT;

const fs = require('fs');
const express = require("express")
const {Client} = require("pg");
const bp = require('body-parser')
const axios = require('axios')

const app = express()

const {createReadstreamForPath,
  sshConnect,
  sshDisconnect
} = require("./helpers/sshHelpers")

const { createMoviesTable,
    createTagsTable,
    createTagsRelationshipsTable,
    createTvShowTable,
    Movie,
} = require("./model/schema.js");

const { createBulkTags,
    createInsertMovieString,
    selectMovieIdsWithTags,
    selectMoviesByManyIds,
    readTagCount,
    readTVCount,
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


// should not get here anymore but this
// is still the general idea to
//pass them off to the streaming server, its kind of lagey but at least the database queries dont slow it down
app.get("/stream",function(req,res){
  res.status(301).end()
 // res.redirect(`http://${ARCHAEIC_URL}:${COLLECTION_PORT}${req.url}`)
});


app.get("/api/pies/stats", async function(req,res){
  // res.redirect(`http://${ARCHAEIC_URL}:${COLLECTION_PORT}${req.url}`)
  axios.get(`http://${ARCHAEIC_URL}:${COLLECTION_PORT}/api/pies/stats`)
  .then(function(data){
    console.log(data);
    res.status(200).send(data.data)
  })
  .catch(function(e){
    res.status(500).end()
  })
})

app.get('/api/pies/names', async function(req,res){
  axios
  .get(`http://${ARCHAEIC_URL}:${COLLECTION_PORT}/api/pies/names`)
  .then(function(data){
    console.log(data);
    res.status(200).send(data.data)
  })
  .catch(function(e){
    res.status(500).end()
  })
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
    await pgclient.query(createTagsTable())
    await pgclient.query(createMoviesTable())
    await pgclient.query(createTvShowTable())
    await pgclient.query(createTagsRelationshipsTable())
    await pgclient.query(createBulkTags())
    useClientToBulkInsert(pgclient,'../meaty/tvshowdump/pi/tvshow.csv')
    useClientToBulkInsert(pgclient,'../meaty/tvshowdump/pi/movies.csv')
    /* end insert */

    /* read count */
    let tags = await pgclient.query(readTagCount())
    let movies = await pgclient.query(readMovieCount())
    let movietags = await pgclient.query(readTaggedMoviesCount())
    let tv = await pgclient.query(readTVCount())
    console.log(tv,tags.rows[0].count,movies.rows[0].count,movietags.rows[0].count);
    /*        */
    require("./helpers/clusterReporting")
    console.log("app is listening",PORT)
  }
  catch(e){
    console.log(e);
      // await pgclient.end()
  }

})
