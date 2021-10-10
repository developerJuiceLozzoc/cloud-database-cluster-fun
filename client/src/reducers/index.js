import { combineReducers } from 'redux'
import {
  DID_SELECT_MOVIE,
  SET_TAGS,
  SET_PI_CLUSTER_HISTORY,
  SET_SEARCH_RESULTS
} from "../actions"


export const initialState = {
  history: {
    "pihistory": {
    },

  },
  search: {
    "currentType": "filtered",
    "random": [],
    "popular": [],
    "atoz": [],
    "filtered": [],
    "related": [],
  },
  root: {
    tags: [],
    nextTagPage: 1,
  },
}

function RootReducer(state = initialState.root ,action){
  switch(action.type){
    case SET_TAGS:
      return {
        tags: action.payload.tags,
        nextTagPage: action.payload.next
      }
    default:
      return state
  }
}

function HistoryReducer(state = initialState.history, action){
  switch(action.type){
    default:
      return state
  }
}

function SearchReducer(state = initialState.search, action){
  switch(action.type){
    case SET_SEARCH_RESULTS:
      let type = state.currentType
      let newState = { ...state }
      newState[type] = action.payload
      return newState
    default:
      return state
  }
}



export default combineReducers({
  history: HistoryReducer,
  search: SearchReducer,
  root: RootReducer,
});
