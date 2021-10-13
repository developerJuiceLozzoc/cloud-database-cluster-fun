const {Movie} = require("./schema")


function createBulkTags() {
    return `
     INSERT INTO tags (tagName) VALUES('movie');
     INSERT INTO tags (tagName) VALUES('cartoon');
     INSERT INTO tags (tagName) values('anime');
     INSERT INTO tags (tagName) values('horror');
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
     INSERT INTO tags (tagName) VALUES('tv show');
     INSERT INTO tags (tagName) VALUES('great soundtrack');
    `
}

function createInsertMovieString(movie){
	if( movie.constructor.name !== "Movie" || movie.invalid){
        return undefined;
    }
	return {
		text:"INSERT INTO movies(epoch,year,title,episode,leecher,movie_size,filename) VALUES($1,$2,$3,$4,$5,$6,$7)  RETURNING movieId,title;",
		values: [movie.epoch,movie.year,movie.title,movie.episode,movie.leecher,movie.duration,movie.filename],
	}
}

function createPiStatTimestampe(stats){
  return {
    text: `INSERT INTO CLUSTER_STATS(submask,cpuload,osuptime,processuptime,osname,cpus,date) VALUES($1,$2,$3,$4,$5,$6,$7)`,
    values: [stats.submask,stats.load,parseInt(stats['os-uptime']),parseInt(stats['process-uptime']),stats.osName,JSON.stringify(stats.cpus),Date.now()]
  }
}

function createMovieTagLinksString(movieId,tagIds){
  return tagIds.map(function(tag){
    return {
        text: `INSERT INTO MoviesWithTag (tagId,movieId) values ($1,$2)`,
        values: [tag,movieId]
    }
  })

}

function createWatchHistoryItem(stats){
  const {subnet,movieid} = stats
  return {
    text: `INSERT INTO WatchHistory (nodeId,movieId,timestamp) values($1,$2,$3)`,
    values: [subnet,movieid,Date.now()]
  }
}

function selectStatsOfAllPis(){
  return `SELECT * FROM CLUSTER_STATS;`
}

function selectPiStatToUpdate(subnetid){
  return {
    text: `SELECT * FROM CLUSTER_STATS WHERE subnet=$1`,
    values: [subnetid]
  }
}

/*
select movie ideas that contain all these tags

*/
function selectMovieIdsWithTags(andtags = [],tags){
  console.log(tags);
    return `select movieId
        from MoviesWithTag
        where tagId in (${tags})
        group by movieId
        ${andtags.length > 0 ? `having array_agg(tagId) @> array[${andtags}];` : ';'}`;
}

/* movies is an array of movie ids and their crap
*/
function filterMovieids(movies,filter){
  let moviesDict = {}
  let items = []
  movies.forEach(function(movie){
      if(!moviesDict[movie.movieid]){
        moviesDict[movie.movieid] = {}
      }
      moviesDict[movie.movieid][`${movie.tagid}`] = true

  })

  Object.keys(moviesDict).forEach(function(key){
    let andcount = 0
    let orVerify = false
    filter.andtags.forEach(function(tag){
      if(moviesDict[key][`${tag}`]){
        andcount += 1;
      }
    })
    filter.ortags.forEach(function(tag){
      if(moviesDict[key][`${tag}`]){
        orVerify = true;
      }
    })

    if(andcount == filter.andtags.length && orVerify){
      items.push(key)
    }

  })
  console.log(moviesDict);

  return items
}

function selectMoviesByManyIds(movieids){
  console.log(`Movies in this amaount :${movieids}:`);
  return `SELECT * FROM movies WHERE movieId IN (${movieids})`;
}

function selectTagIdsWithMovieId(movieId){
    return {
        text: `SELECT tagId from MoviesWithTag WHERE movieId=$1`,
        values: [movieId],
    }
}
function readAllTags() {
    return `SELECT * FROM tags;`
}
/* deprecated

function readAllMovies() {
    return `SELECT * FROM movies;`;
}
function readAllTaggedMovies() {
  return `SELECT * FROM MoviesWithTag;`
}

SELECT
   COUNT(*)
FROM
   table_name
*/

function readTagCount() {
    return `SELECT COUNT(*)  FROM tags;`
}
function readMovieCount() {
    return `SELECT COUNT(*)  FROM movies;`;
}
function readTaggedMoviesCount() {
  return `SELECT COUNT(*) FROM MoviesWithTag;`
}


function updatePiStatString(values){
  return {
    text: `UPDATE CLUSTER_STATS
            SET uptime = $1, cpuload = $2 , osuptime = $3
            WHERE condition;`,
    values: [values['process-uptime'],values[load.join(",")],values['os-uptime']],
  }
}

function deleteTagFromAllTags(tag) {
    return {
        values: [tag],
        text: `DELETE FROM tags WHERE tagId=$1`
    }
}


module.exports = {
    createInsertMovieString,
    createMovieTagLinksString,
    createBulkTags,
    createPiStatTimestampe,
    readAllTags,
    readTagCount,
    readMovieCount,
    readTaggedMoviesCount,
    selectPiStatToUpdate,
    selectStatsOfAllPis,
    selectMovieIdsWithTags,
    selectMoviesByManyIds,
    selectTagIdsWithMovieId,
    updatePiStatString,
    deleteTagFromAllTags,
    filterMovieids,
}
