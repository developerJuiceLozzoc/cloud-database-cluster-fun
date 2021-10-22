import React from 'react'
import {connect} from "react-redux"
import { createBrowserHistory } from "history";
import {BottomNavigation,BottomNavigationAction,Grid} from '@mui/material';
import {Restore} from '@mui/icons-material'
import ExploreIcon from '@mui/icons-material/Explore';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { useHistory } from "react-router-dom";
import MovieSearchCard from "./components/MovieSearchCard"
import PlainHtml5Viewr from "./components/PlainHtml5Viewr"
import RaspberryStatsView from "./components/RaspberryStatsView"
import {setTagsAction,setPiHistoryAction} from "../actions"
import { css, cx } from '@emotion/css'

const Navbar = props => {
  let history = useHistory();

   return (
     <BottomNavigation
       showLabels
       value={"Recents"}
       onChange={(event, newValue) => {
         if(newValue === 0){
           history.push("/server")
         }
         else{
           history.push("/movies")
         }
       }}
       >
       <BottomNavigationAction label="Server" icon={<Restore />} />
       <BottomNavigationAction label="Explore" icon={<ExploreIcon />} />
     </BottomNavigation>
   )
}

const MiorrorNavBar = (props) => {
  const mirrorContainer=css`
  display: flex;
  flex-wrap: no-wrap;
  flex-direction: row;
  `;
  let mirrors = ["http://10.0.0.114","http://10.0.0.92","http://10.0.0.237"]

  return (
    <div>
    <p>MIRRORS</p>
    <div className={mirrorContainer}>
    {mirrors.map(function(url,index){
      return <button onClick={function(){
        window.location.href = url;
      }}
      key={url}
      >
      Mirror {index+1}</button>
    })}
    </div>
</div>)
}

class Dashboard extends React.Component {
  constructor(){
    super()
    this.state = {
      tags: [],
      isLoadingCommercial: false,
      history: createBrowserHistory()
    }
    this.setValue = this.setValue.bind(this)
    this.handleLoadTags = this.handleLoadTags.bind(this)
    this.handleLoadPiHistory = this.handleLoadPiHistory.bind(this)
  }
  componentDidMount() {
    this.handleLoadTags()
    this.handleLoadPiHistory()
    this.handleLoadUserHistory()
    this.state.history.push("/movies")
  }

  render(){
    return (
      <Router history={this.state.history}>
      <div style={{height:"100%"}}>
      {/*row  bottom /inset top inset?*/}
      <MiorrorNavBar />
      <Navbar />


      <Route path="/server">
        <RaspberryStatsView />
      </Route>

      <Route path="/movies">
        <Grid container spacing={2} sx={{ height: '85%' }}>
          <Grid item xs={4}>
              {/*Column*/}<PlainHtml5Viewr url="/stream/asdf" />
          </Grid>
          <Grid item xs={8}>
            {/*browse menu, to find other files */}<MovieSearchCard />
          </Grid>
          <Grid item xs={12}>
            <p>xs=4</p>  {/*explore the current epoch selecte and related items, if none there than suggest random items*/}
          </Grid>
        </Grid>
      </Route>

      </div>
      </Router>
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
    const self = this;
    fetch('/api/getAllPiStats')
    .then(res => res.json())
    .then(function(data){
      self.props.setPiHistory(data)
    })
    .catch(function(e){
      console.log(e);
    })
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
    setPiHistory: (history) => dispatch(setPiHistoryAction(history)),
    setTags: (tags) => dispatch(setTagsAction(tags)),
    setRelatedContent: (key,content) => dispatch({type:"RELATEDCONTENT"}),
  }
}

export default connect(null,mapDispatchToProps)(Dashboard)
