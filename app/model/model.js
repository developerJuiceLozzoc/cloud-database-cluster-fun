const {Movie} = require("./schema")

/*
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
 */
function createBulkTags() {
    return `

    `
}

function createInsertMovieString(movie){
	if(movie.constructor.name !== Movie.constructor.name || movie.invalid){
        return undefined;
    }
	return {
		text:"INSERT INTO movies(epoch,season,episode,title,filename,duration) VALUES($1,$2,$3,$4,$5,$6)",
		values: [movie.epoch,movie.season,movie.episode,movie.title,movie.filename,movie.duration],
	}
}

function createMovieTagLink(movieId,tagId){
    return {
        text: `INSERT INTO MoviesWithTag (tagId,movieId) values ($1,$2)`,
        values: [movieId,tagId]
    }
}

function selectMovieIdsWithTags(tags){
    return `SELECT movieId FROM MoviesWithTag WHERE tagId IN (${tags})`
}

function selectMoviesWithMovieIds(movieids){
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
function readAllMovies() {
    return `SELECT * FROM movies;`;
}

function deleteTagFromAllTags(tag) {
    return {
        values: [tag],
        text: `DELETE FROM tags WHERE tagId=$1`
    }
}


module.exports = {
    createInsertMovieString,
    createMovieTagLink,
    createBulkTags,
    readAllTags,
    readAllMovies,
    selectMovieIdsWithTags,
    selectTagIdsWithMovieId,
    deleteTagFromAllTags
}
