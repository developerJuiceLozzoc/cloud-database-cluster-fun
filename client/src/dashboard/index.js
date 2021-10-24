import React from 'react'
import {connect} from "react-redux"
import { createBrowserHistory } from "history";
import {BottomNavigation,BottomNavigationAction,Grid} from '@mui/material';
import {Restore} from '@mui/icons-material'
import ExploreIcon from '@mui/icons-material/Explore';
import {
  BrowserRouter as Router,
  Route
} from "react-router-dom";
import { useHistory } from "react-router-dom";
import MovieSearchCard from "./components/MovieSearchCard"
import PlainHtml5Viewr from "./components/PlainHtml5Viewr"
import RaspberryStatsView from "./components/RaspberryStatsView"
import {setTagsAction,setPiHistoryAction,setPiNamesAction} from "../actions"
import { css } from '@emotion/css'
import TopLevelMirrorStyles from "./style/mirror.js"
import {mirrors} from "../reducers"
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
  const host = window.location.host;
  const mirrorContainer=css`
    display: flex;
    flex-wrap: no-wrap;
    flex-direction: row;
  `;
  const selectedButtonStyle = css`
    color: green;
  `;
  const unselectedButtonStyle = css`
  border-color: #121212;
  background: 'white';
  `;

  // const mirrorButtonSelectedStyle=css`
  // `;

  return (
    <div className={TopLevelMirrorStyles}>
      <p>MIRRORS - Click differnt one if search results are slow</p>
      <div className={`${mirrorContainer} container`}>
        <a href="http://localhost:3000">
        <button
          className={`btn play-pause ${host.includes('localhost:3000') ? selectedButtonStyle : unselectedButtonStyle}`}
          key={'http://localhost:3000'}
          >
          <div className="icon-container">
          <p>Dev Mirror</p>
          </div>
        </button>
        </a>

        {mirrors.map(function(url,index){
          console.log(url);
          return (
            <a href={`http://${url}`}
              key={url}
              >
            <button className="btn play-pause">
            {host.includes(url) && <button className="btn play-pause">
          		<div className={`icon-container ${selectedButtonStyle}`}>
          			<p>Selected</p>
          		</div>
            </button>}
          	{!host.includes(url)	&& <div className={`icon-container ${unselectedButtonStyle}`}>
                <button>
                  Mirror {index+1}
                </button>
          		</div>}
              </button>
              </a>)
        })}
    </div>
  </div>
  )
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
      <div style={{height:"100vh"}}>
      {/*row  bottom /inset top inset?*/}
      <MiorrorNavBar />
      <Navbar />


      <Route path="/server">
        <RaspberryStatsView />
      </Route>

      <Route path="/movies">
        <Grid container spacing={2} sx={{ height: "90vh" }}>
          <Grid item xs={4}>
              {/*Column*/}<PlainHtml5Viewr />
              {/*explore the current epoch selecte and related items, if none there than suggest random items*/}<p>view History coming soon</p>
          </Grid>
          <Grid item xs={8}>
            {/*browse menu, to find other files */}<MovieSearchCard />
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
    // const userRecentItems = sessionStorage.getItem("Watch History")
  }
  handleLoadPiHistory(){
    const self = this;
    fetch('/api/pies/stats')
    .then(res => res.json())
    .then(function(data){
      self.props.setPiHistory(data)
    })
    .catch(function(e){
      console.log(e);
    })
    fetch('/api/pies/names')
    .then(res => res.json())
    .then(function(data){
      self.props.setPiNamesAction(data)
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
    setPiNamesAction: (stuff) => dispatch(setPiNamesAction(stuff))
  }
}

export default connect(null,mapDispatchToProps)(Dashboard)
