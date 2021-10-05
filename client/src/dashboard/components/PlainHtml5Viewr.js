import React, {useEffect} from "react"


function PlainHtml5Viewr(props){
  return (
    <video controls width="500">
    <source src={props.url}
            type="video/mp4" />
    Sorry, your browser doesn't support embedded videos.
    </video>)
}

export default PlainHtml5Viewr
