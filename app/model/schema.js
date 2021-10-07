function createMoviesTable() {
return `DROP TABLE IF EXISTS movies;
CREATE TABLE movies (
epoch varchar(50) NOT NULL,
season int,
episode int NOT NULL,
title varchar(75) NOT NULL,
year int NOT NULL,
leecher varchar(30),
filename varchar(200) NOT NULL,
movieId SERIAL PRIMARY KEY,
movie_size bigint NOT NULL);`
}

function createWatchHistoryTable(){
  return `DROP TABLE IF EXISTS WatchHistory;
  CREATE TABLE WatchHistory(
    nodeId varchar(16) NOT NULL,
    movieId int NOT NULL,
    timestamp bigint NOT NULL
  );`
}

function createTagsTable() {
    return `DROP TABLE IF EXISTS tags;
    CREATE TABLE tags (
    tagId SERIAL PRIMARY KEY,
    tagName varchar(25))`;
}



function createTagsRelationshipsTable() {
    return `DROP TABLE IF EXISTS MoviesWithTag;
    CREATE TABLE MoviesWithTag (
    tagId int,
    movieId int)`;
}
//will need to index both of these columns because the unique identifier is [tagId,movieId]

/*indexes on items that contain the tag movie or tvshow
 availibe tags and their frequency used hitlist
 */

/*
 epoch: a reoccuring substring that links together other strings.
        Some movies will intersect upon the same epoch.
 season: int
 episode: int, maybe some series dont have season but they have episodes.. whataver
 title: name of item
 filename: full path of item
 duration: minutes whole number

 */
class Movie {
	constructor(data){
        const {year,publisher,epoch,season,episode,title,filename,duration} = data;
        this.epoch = epoch;
        this.title = title;
        this.filename = filename;
        this.duration = parseInt(duration);
        this.episode = parseInt(episode);
        this.season = season ? parseInt(season) : null;
        this.leecher = publisher
        this.year = parseInt(year);



        //checking if invalid
        this.invalid = !epoch || !title || !filename || !duration || !episode
    }
}

module.exports = {
  createWatchHistoryTable,
    createMoviesTable,
    createTagsTable,
    createTagsRelationshipsTable,
    Movie
}
