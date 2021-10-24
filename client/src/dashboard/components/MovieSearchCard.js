import React, {useState} from 'react'
// import PropTypes from 'prop-types';
import {connect} from "react-redux"

import {BottomNavigation,BottomNavigationAction, Card} from '@mui/material';

import ShuffleIcon from '@mui/icons-material/Shuffle';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import TimelineIcon from '@mui/icons-material/Timeline';
import StarOutlineIcon from '@mui/icons-material/StarOutline';



import {setCurrentSearchResultTypeAction} from "../../actions"
import TagSearchView from "../../explore-media/components/TagSearch"
import MovieSearchResults from "../../explore-media/components/MovieResultGrid"

function MovieSearchTabRouter(props){
  const {route} = props;
  switch(route){
    case 0:
      return (<TagSearchView />)
    case 1:
      return (<p>Random</p>)
    case 2:
      return (
        <p>Popular</p>
      )
    default:
      return (
        <p>AtoZ</p>
      )
  }
}


function MovieSearchCard(props){
  const [selectedTabBarItem,tabBarChange] = useState(0)

  return (<Card sx={{ height: '100%' }}>{/*row  bottom /inset top inset?*/}
    <MovieSearchTabRouter route={selectedTabBarItem} />
    <MovieSearchResults />
    <BottomNavigation
      showLabels
      value={"Recents"}
      onChange={(event, newValue) => {
        console.log(newValue);
        tabBarChange(newValue);
        props.setCurrentSearchResultType(newValue)
      }}
      >
      <BottomNavigationAction label="Filter" icon={<FilterAltIcon />} />
      <BottomNavigationAction label="Random" icon={<ShuffleIcon />} />
      <BottomNavigationAction disabled label="Popular" icon={<StarOutlineIcon color="disabled"/>} />
      <BottomNavigationAction disabled label="A-Z" icon={<TimelineIcon color="disabled"/>} />
    </BottomNavigation>
  </Card>);
}



function mapDispatchToProps(dispatch){
  return {
    setCurrentSearchResultType: (type) => dispatch(setCurrentSearchResultTypeAction(type)),
  }
}


export default connect(null,mapDispatchToProps)(MovieSearchCard);
