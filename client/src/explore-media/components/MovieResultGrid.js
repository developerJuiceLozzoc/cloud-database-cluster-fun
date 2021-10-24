import React from 'react'
import {connect} from "react-redux"
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {
  CurrentSearchResultsTypeSelector,
  SearchResultsSelector} from "../../reducers/selectors"
import {didSelectMovieAction} from "../../actions/index.js"

const columns: GridColDef[] = [
  { field: 'leecher', headerName: 'Leecher',width: 150 },
  { field: 'title', headerName: 'Title',width: 300},
  { field: 'epoch', headerName: 'Epoch',width: 150},
  { field: 'size', headerName: '(GB)' },
  { field: 'year', headerName: 'Year' },
  { field: 'episode', headerName: 'Ep' },
];

function MovieGrid(props) {

  return (
    <div style={{ height: "68%", width: '100%' }}>
      {props.items.length > 0 && <DataGrid
        rows={props.items}
        onSelectionModelChange={(newSelection) => {
          props.didSelectMovie(props.items[newSelection[0]])
        }}
        columns={columns}
        />}


    </div>
  );
}


function mapStateToProps(state){
  const type =  CurrentSearchResultsTypeSelector(state,SearchResultsSelector(state));
  return {
    items: SearchResultsSelector(state,type)
  }
}
function mapDispatchToProps(dispatch){
  return {
    didSelectMovie: (movie) => dispatch(didSelectMovieAction(movie))
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(MovieGrid);
