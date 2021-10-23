import React from 'react'
import {connect} from "react-redux"
import {Grid} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {PiHistorySelector} from "../../reducers/selectors";


const columns: GridColDef[] = [
  { field: 'submask', headerName: 'Subnet Mask',width: 150 },
  { field: 'osname', headerName: 'OS',width: 200 },
  { field: 'cpuload', headerName: 'Load(~5min)',width: 150},
  { field: 'processuptime', headerName: 'pUptime (Hours)',width: 200},
  { field: 'date', headerName: 'Date',width: 150 },
];


function RaspberryStatsView(props){
  return (
    <Grid container spacing={2} sx={{ height: '90vh' }}>
      <Grid item xs={4}>
          {/*Column*/}{!!props.selectedpi && <div>
            {Object.keys(props.selectedpi).map(function(key){
              return <div key={`video: ${key}`}><p>{props.selectedpi[key]}</p></div>
            })}
            </div>
          }
      </Grid>
      <Grid item xs={8}>
        {/*browse menu, to find other files */}<DataGrid
        rows={props.items}
        columns={columns}
        onSelectionModelChange={(newSelection) => {
          props.didSelectMovie(props.items[newSelection[0]])
        }}
        />
      </Grid>

    </Grid>
  )
}

function mapStateToProps(state){
  return {
    items: PiHistorySelector(state)
  }
}

export default connect(mapStateToProps)(RaspberryStatsView)
