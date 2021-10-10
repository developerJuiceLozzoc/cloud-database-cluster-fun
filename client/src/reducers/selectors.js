function SearchResultsSelector(state,key){
  if(["random","popular","atoz","filtered","related"].includes(key)){
    return state.search[key]
  }
  else {
    return undefined
  }
}

function CurrentSearchResultsTypeSelector(state){
  return state.search["currentType"];
}

function PiHistorySelector(state){
  return state.history.pi
}

function TagsSelector(state){
  return state.root.tags;
}


export {
SearchResultsSelector,
PiHistorySelector,
CurrentSearchResultsTypeSelector,
TagsSelector
};
