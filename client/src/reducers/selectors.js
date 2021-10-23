
import { createSelector } from 'reselect'


function SearchResultsSelector(state,key){
  if(["random","popular","atoz","filtered","related"].includes(key)){
    return state.search[key]
  }
  else {
    return undefined
  }
}


const TagsSelector = createSelector(
  (state) => state.root,
  (root) => root.tags
)

function CurrentSearchResultsTypeSelector(state){
  return state.search["currentType"];
}

function PiHistorySelector(state){
  return state.history.stats
}

function CurrentSelectedMovieSelector(state){
  return state.root.selectedmovie;
}

function PiIdentitiesSelector(state){
  return state.history.names
}


export {
  PiIdentitiesSelector,
  CurrentSelectedMovieSelector,
SearchResultsSelector,
PiHistorySelector,
CurrentSearchResultsTypeSelector,
TagsSelector
};
