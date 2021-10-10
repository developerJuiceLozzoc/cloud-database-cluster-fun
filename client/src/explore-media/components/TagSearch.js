import React,{useState} from 'react'
import {connect} from 'react-redux'
import { css, cx } from '@emotion/css'
import queryString from "query-string"

import {TagsSelector} from "../../reducers/selectors"
import SpecialButton from "./FilterButton"
import {setSearchResultsAction} from "../../actions"

/**
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function TagSearchView(props){
  const [checked,setChecked] = useState({})

  const postSearchRequest = (query) => {
    let querystuff = {}
    if(query.andtags.length > 0){
      querystuff.andtags = query.andtags.join(",")
    }
    if(query.ortags.length > 0 ){
      querystuff.ortags = query.ortags.join(",")
    }

    fetch(`/api/search/movies?${queryString.stringify(querystuff)}`)
    .then((res) => res.json())
    .then(function(data){
      props.setSearchResults(shuffle(data))
    })
    .catch((e)=>{})
  }

  return (<>
    <p> Red means AND, Green means OR</p>
    <div
      className={css`
       height: 100px;
       flex-wrap: wrap;
       overflow-y: auto;
     `}
   >
    {props.tags.map(function(tag,index){
      return  <SpecialButton
      key={`tagname-${tag.tagid}`}
      value={checked[tag.tagid]}
      label={tag.tagname}
      setValue={function(v){
        let newState = {
          ...checked
        }
        newState[`${tag.tagid}`] = v
        setChecked(newState)
      }}
    />
    })}
   </div>
    <button onClick={function(){
      let query = {
        andtags: [],
        ortags: [],
      }
      Object.keys(checked).filter(function(key){
        return checked[key] > 0
      }).forEach(function(key){
        if(checked[key] == 1){
          query.ortags.push(key)
        }
        else if(checked[key] == 2){
          query.andtags.push(key)
        }
      })
      postSearchRequest(query)
    }} >Search</button>
   </>
  );
}


function mapDispatchToProps(dispatch){
  return {
    setSearchResults: (results) => dispatch(setSearchResultsAction(results)),
  }
}

function mapStateToProps(state){
  return {
      tags: TagsSelector(state),
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(TagSearchView)
