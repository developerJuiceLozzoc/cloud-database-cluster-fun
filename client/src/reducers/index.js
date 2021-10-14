import { combineReducers } from 'redux'
import {
  DID_SELECT_MOVIE,
  SET_TAGS,
  SET_PI_CLUSTER_HISTORY,
  SET_SEARCH_RESULTS
} from "../actions"


export const initialState = {
  history: {
    pi: []

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
    selectedmovie: null,
  },
}

function RootReducer(state = initialState.root ,action){
  switch(action.type){
    case SET_TAGS:
      return {
        tags: action.payload.tags,
        nextTagPage: action.payload.next
      }
    case DID_SELECT_MOVIE:
      if(state.selectedmovie && state.selectedmovie.movieid == action.payload.movieid){
        return {
          ...state,
          selectedmovie: null
        }
      } else {
        return {
          ...state,
          selectedmovie: action.payload
        }
      }
    default:
      return state
  }
}

function HistoryReducer(state = initialState.history, action){
  switch(action.type){
    case SET_PI_CLUSTER_HISTORY:
      return {
        ...state,
        pi: action.payload.map(function(stat){
          return {
            ...stat,
            id: stat.date
          }
        })
      }
    default:
      return state
  }
}

function SearchReducer(state = initialState.search, action){
  switch(action.type){
    case SET_SEARCH_RESULTS:
      let type = state.currentType
      console.log(type);
      let newState = { ...state }
      newState[type] = action.payload.map(function(movie,index){
        return {
          ...movie,
          id: index,
        }
      })
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