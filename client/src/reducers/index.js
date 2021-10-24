import { combineReducers } from 'redux'
import {
  DID_SELECT_MOVIE,
  SET_TAGS,
  SET_PI_CLUSTER_HISTORY,
  SET_SEARCH_RESULTS,
  SET_PI_NAMES
} from "../actions"


export const mirrors = ["10.0.0.245","10.0.0.114","10.0.0.92","10.0.0.237"]


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

export function selected_xor(currid,nextid){
  if(!currid){
    return true
  } else if(currid.movieid === nextid){
    return false
  }
  else {
    return true
  }
}

function RootReducer(state = initialState.root ,action){
  switch(action.type){
    case SET_TAGS:
      return {
        tags: action.payload.tags,
        nextTagPage: action.payload.next
      }
    case DID_SELECT_MOVIE:
    if(!selected_xor(state.selectedmovie,action.payload.movieid)) {
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
        stats: action.payload.map(function(stat){
          let date = new Date(parseInt(stat.date));
          let datearr = date.toString().split(" ")
          return {
            ...stat,
            id: stat.date,
            processuptime: (parseInt(stat.processuptime) / 3600).toFixed(2),
            date: `${datearr[1]} ${datearr[2]} @ ${datearr[4]}`
          }
        })
      }
    case SET_PI_NAMES:
      return {
        ...state,
        names: action.payload,
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
