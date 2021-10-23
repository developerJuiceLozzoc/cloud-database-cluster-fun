import React from "react"
import {connect} from "react-redux"
import queryString from "query-string"


import {CurrentSelectedMovieSelector} from "../../reducers/selectors"



function PlainHtml5Viewr(props){
  const [isWatching, toggleIsWatching] = React.useState(false);
  React.useEffect(function(){
    if(!!props.selectedvideo){
      toggleIsWatching(false)
    }
  },[props.selectedvideo])
  //.replace("/home/pi/Videos/","/home/pi/Desktop/My Passport/videos/")
  let query =  !!props.selectedvideo ? queryString.stringify({
    size: props.selectedvideo.movie_size,
    path: props.selectedvideo.filename.replace("/home/pi/Videos/","/run/media/pi/My Passport/videos/"),
  }) : null;

  if(!!props.selectedvideo){
    console.log(`http://10.0.0.227:4444/stream?${query}`);
  }
  return (
    <div>
      {!!props.selectedvideo && !isWatching && <div>
        {Object.keys(props.selectedvideo).map(function(key){
          return <div key={`video: ${key}`}><p>{props.selectedvideo[key]}</p></div>
        })}
        <button onClick={function(){ toggleIsWatching(true)}}>WatchNow!</button>
        </div>
      }
      {!!props.selectedvideo && isWatching && <div>
        <video controls width="100%">
        <source src={`http://10.0.0.227:4444/stream?${query}`}
                type="video/mp4" />
        Sorry, your browser doesn't support embedded videos.
        </video>
        <button onClick={function(){ toggleIsWatching(false)}}>StopWatching</button>
        </div>
      }
    </div>
    )
}

function mapStateToProps(state){
  return {
    selectedvideo: CurrentSelectedMovieSelector(state),
  }
}



export default connect(mapStateToProps)(PlainHtml5Viewr)
