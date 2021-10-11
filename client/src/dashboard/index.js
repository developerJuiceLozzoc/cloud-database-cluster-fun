import React from 'react'
import {connect} from "react-redux"
import {BottomNavigation,BottomNavigationAction,Grid} from '@mui/material';
import {Restore} from '@mui/icons-material'
import ExploreIcon from '@mui/icons-material/Explore';

import MovieSearchCard from "./components/MovieSearchCard"
import PlainHtml5Viewr from "./components/PlainHtml5Viewr"
import {setTagsAction} from "../actions"

class Dashboard extends React.Component {
  constructor(){
    super()
    this.state = {
      tags: [],
      isLoadingCommercial: false,
    }
    this.setValue = this.setValue.bind(this)
    this.handleLoadTags = this.handleLoadTags.bind(this)
  }
  componentDidMount() {
    this.handleLoadTags()
    this.handleLoadPiHistory()
    this.handleLoadUserHistory()
  }

  render(){
    return (
      <div>
      {/*row  bottom /inset top inset?*/}

      <BottomNavigation
        showLabels
        value={"Recents"}
        onChange={(event, newValue) => {
          this.setValue(newValue);
        }}
        >
        <BottomNavigationAction label="Server" icon={<Restore />} />
        <BottomNavigationAction label="Explore" icon={<ExploreIcon />} />
      </BottomNavigation>
      <Grid container spacing={2} sx={{ height: '85%' }}>
        <Grid item xs={4}>
            {this.isLoadingCommercial && <p>Are you still watching? try out these fan favorites: </p> }
            {/*Column*/}<PlainHtml5Viewr url="/stream/asdf" />

        </Grid>
        <Grid item xs={8}>

          {/*browse menu, to find other files */}<MovieSearchCard />

        </Grid>
        <Grid item xs={12}>
          <p>xs=4</p>  {/*explore the current epoch selecte and related items, if none there than suggest random items*/}
        </Grid>
      </Grid>
      </div>
    )
  }


  setValue(v){

  }

  handleLoadRelatedContent(movie){

  }
  handleLoadUserHistory(){
    const userRecentItems = sessionStorage.getItem("Watch History")
  }
  handleLoadPiHistory(){

  }
  handleLoadTags(){
    const self = this;
    fetch("/api/tags")
    .then(res => res.json())
    .then(function(res){
      self.props.setTags(res)
    })
    .catch(function(e){
      console.log(e);
    })
  }
}

function mapDispatchToProps(dispatch){
  return {
    setPiHistory: (history) => dispatch({type: "SETPIHISTORY"}),
    setTags: (tags) => dispatch(setTagsAction(tags)),
    setRelatedContent: (key,content) => dispatch({type:"RELATEDCONTENT"}),
  }
}

export default connect(null,mapDispatchToProps)(Dashboard)
