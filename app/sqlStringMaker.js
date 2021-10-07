const csv = require('csv-parser');
const fs = require('fs');

const {
  createInsertMovieString,
  createMovieTagLinksString
} = require("./model/model")

const {
  Movie
} = require('./model/schema')


function useClientToBulkInsert(client){

  fs.createReadStream('../meaty/tvshowdump/pi/movies.csv')
    .pipe(csv())
    .on('data', async (row) => {
      const {tags, epoch,year,title,episode,leecher,size,path} = row;

      try {
        let movie = new Movie({
          epoch,title,year,episode,year,
          filename: path,
          publisher: leecher,
          duration: size,
          season: null
        });
        let movieString = createInsertMovieString(movie);
        const {rows} = await client.query(movieString.text,movieString.values)
        if(rows.length > 0 ){
          let movieID= rows[0].movieid;
          createMovieTagLinksString(movieID,tags.split(" ")).forEach(async function(query){
            let result = await client.query(query.text,query.values)
            console.log(result);
          })

        }
      } catch(e){
        console.log(e);
      }


    })
    .on('end', async () => {
      // await client.end();

    });
}

module.exports = {useClientToBulkInsert}
