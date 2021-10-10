import React from 'react'
import {connect} from "react-redux"
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import {CurrentSearchResultsTypeSelector,SearchResultsSelector} from "../../reducers/selectors"

const columns: GridColDef[] = [
  { field: 'leecher', headerName: 'Leecher' },
  { field: 'title', headerName: 'Title' },
  { field: 'epoch', headerName: 'Epoch' },
  { field: 'size', headerName: 'Size (GB)' },
  { field: 'year', headerName: 'Year' },
  { field: 'episode', headerName: 'Episode' },
];

function MovieGrid(props) {
  return (
    <div style={{ height: 400, width: '100%' }}>
      {props.items.length > 0 && <DataGrid
        rows={props.items.map(function(item){
          return {
            ...item,
            id: item.movieid,
          }
        })} 
      columns={columns} />}
    </div>
  );
}
//
function mapStateToProps(state){
  const type =  CurrentSearchResultsTypeSelector(state,SearchResultsSelector(state));

  return {
    items: SearchResultsSelector(state,type)
  }
}
function mapDispatchToProps(dispatch){
  return {
    didSelectMovie: (movie) => dispatch({type: "DIDSELECT",})
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(MovieGrid);
