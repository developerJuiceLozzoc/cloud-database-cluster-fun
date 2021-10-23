import React from 'react'
import { css } from '@emotion/css'

function SpecialButton(props){
  const {value,setValue} = props;
  const [varient,updateVarientEnum] = React.useState(value);
  const getColorOnValue = (value) => {
    switch(value) {
      case 1:
        return "green"
      case 2:
        return "#a9203e"
      default:
        return "white"
    }
  }
  let styles = css`
   color: ${varient ? '#fff' : 'blue'};
   background-color: ${getColorOnValue(varient)};
   flex-wrap: wrap;
   padding: 8px;
   margin: 5px;
   overflow-y: auto;
 `;

  return (
    <button
      className={styles}
      onClick={function(){
        let newValue = varient ? varient : 0
          setValue((newValue+1)%3)
          updateVarientEnum((newValue+1)%3)
      }}>
      {props.label}
    </button>)
}


export default SpecialButton
