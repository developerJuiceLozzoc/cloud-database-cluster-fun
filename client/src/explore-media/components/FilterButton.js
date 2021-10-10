import React from 'react'
import {Button} from '@mui/material';



function SpecialButton(props){
  const {value,setValue} = props;
  const getColorOnValue = (value) => {
    switch(value) {
      case 1:
        return "success"
      case 2:
        return "error"
      default:
        return "primary"
    }
  }

  return (
    <Button
      variant={value ? 'contained': 'outlined'}
      color={getColorOnValue(value)}
      onClick={function(){
        let newValue = value ? value : 0
          setValue((newValue+1)%3)
      }}>
      {props.label}
    </Button>)
}


export default SpecialButton
