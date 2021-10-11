import React,{useState,useMemo} from 'react'
import {connect} from 'react-redux'
import axios from 'axios';
import queryString from "query-string"


import {TagsSelector} from "../../reducers/selectors"
import SpecialButton from "./FilterButton"
import {setSearchResultsAction} from "../../actions"
import {Button} from '@mui/material';
import { useSelector } from 'react-redux'

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
  const tags = useSelector(TagsSelector)

  const postSearchRequest = (query) => {
    let querystuff = {}
    if(query.andtags.length > 0){
      querystuff.andtags = query.andtags.join(",")
    }
    if(query.ortags.length > 0 ){
      querystuff.ortags = query.ortags.join(",")
    }
    if(query.ortags.length > 0 || query.andtags.length > 0 ){
      axios.get(`/api/search/movies?${queryString.stringify(querystuff)}`)
      .then(function(res){
        console.log(res.data);
        props.setSearchResults(shuffle(res.data))
      })
      .catch((e)=>{})
    }
  }
  const TagButtons = useMemo(()=> {
    console.log("RERENDERING TAGS");
    return tags.map(function(tag,index){
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
    })
  }, [tags.length])

  return (<>
    <p> Red means AND, Green means OR</p>
    <div

   >
    {tags.length > 0 && TagButtons }
   </div>
    <Button
      varient="contained"
      color="success"
      onClick={function(){
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
    }} >Search</Button>
   </>
  );
}


function mapDispatchToProps(dispatch){
  return {
    setSearchResults: (results) => dispatch(setSearchResultsAction(results)),
  }
}


export default connect(null,mapDispatchToProps)(TagSearchView)
