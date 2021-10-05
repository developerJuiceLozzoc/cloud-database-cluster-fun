import React from 'react'
import PlainHtml5Viewr from "./components/PlainHtml5Viewr"

class Dashboard extends React.Component {
  constructor(){
    super()
    this.state = {
      tags: []
    }
  }
  componentDidMount() {
    fetch("/api/tags")
    .then(function(res){

    })
    .catch(function(e){
      console.log(e);
    })

  }
  render(){
    return (
      <div>
      <div class="row">
        {/* movie watching component*/}
        <PlainHtml5Viewr url="/stream/asdf" />
        {/*browse menu, to find other files */}
      </div>
      <div class="row">
        {/*explore the current epoch selecte and related items, if none there than suggest random items*/}
      </div>
      </div>
    )
  }
}

export default Dashboard;
