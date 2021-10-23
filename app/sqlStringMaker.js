const csv = require('csv-parser');
const fs = require('fs');

const {
  createInsertMovieString,
  createMovieTagLinksString,
  createInsertTVString,
} = require("./model/model")

const {
  Movie
} = require('./model/schema')


function useClientToBulkInsert(client,filepath){

  fs.createReadStream(filepath)
    .pipe(csv())
    .on('data', async (row) => {
      const {tags, epoch,year,title,season, episode,leecher,size,path} = row;

      try {
        let movie = new Movie({
          epoch,title,year,episode,year,
          filename: path,
          publisher: leecher,
          duration: size,
          season
        });
        let movieString;
        if ( movie.season >=0 ){
          movieString = createInsertMovieString(movie);
        } else {
          movieString = createInsertTVString(movie);
        }
        if(movie.isInvalid || !movieString){
          console.log(movie,movieString);
          return
        }
        if(movie.filename.length > 200 || movie.leecher.length > 30 || movie.epoch.length > 50 || movie.title.length > 256) {
          console.log(movie);
          return
        }
        // console.log(movie);
        const {rows} = await client.query(movieString.text,movieString.values)
        if(rows.length > 0 ){
          let movieID= rows[0].movieid;
          createMovieTagLinksString(movieID,tags.split(" ")).forEach(async function(query){
            let result = await client.query(query.text,query.values)
            // console.log(result);
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
