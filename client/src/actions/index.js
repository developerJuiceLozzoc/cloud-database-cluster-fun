const SET_TAGS = "TAGS_SET"

const setTagsAction = (tags) => ({
  type: SET_TAGS,
  payload: tags,
})

const DID_SELECT_MOVIE  = "SELECTED_MOVIE_TO_WATCH"

const didSelectMovieAction = (movie) => ({
  type: DID_SELECT_MOVIE,
  payload: movie,
})

const SET_PI_CLUSTER_HISTORY = "HISTORY_SET_PI_CLUSTER"

const setPiHistoryAction = (arr) => {
  return {
    type: SET_PI_CLUSTER_HISTORY,
    payload: arr
  }
}

const SET_SEARCH_RESULT_TYPE = "SEARCH_SET_TYPE"
const SET_SEARCH_RESULTS = "SEARCH_SET_RESULTS"

const SET_PI_NAMES = "SET_PI_NAMES";

const setPiNamesAction = (value) => {
  return {
    type: SET_PI_NAMES,
    payload: value,
  }
}


const setCurrentSearchResultTypeAction = (value) => {
  const strs = ["filtered","random","popular","atoz"]
  return {
    type: SET_SEARCH_RESULT_TYPE,
    payload: strs[value]
  }
}

const setSearchResultsAction = (results) => {
  console.log("setting search results");
  return {
    type: SET_SEARCH_RESULTS,
    payload: results,
  }
}



export {
setPiNamesAction,
  setTagsAction,
  setSearchResultsAction,
  DID_SELECT_MOVIE,
  SET_TAGS,
  SET_PI_CLUSTER_HISTORY,
  SET_SEARCH_RESULT_TYPE,
  SET_PI_NAMES,
  SET_SEARCH_RESULTS,
  didSelectMovieAction,
setCurrentSearchResultTypeAction,
  setPiHistoryAction
}
