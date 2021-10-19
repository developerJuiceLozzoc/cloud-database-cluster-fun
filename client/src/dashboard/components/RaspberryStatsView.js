import React from 'react'
import {connect} from "react-redux"
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
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
    <div style={{height: "90vh"}}>
    {props.items.length === 0 &&
      <p> loading your stats please wait </p>}
    {props.items.length > 0 &&
      <DataGrid
      rows={props.items}
      columns={columns}
      />}
    </div>
  )
}

function mapStateToProps(state){
  return {
    items: PiHistorySelector(state)
  }
}

export default connect(mapStateToProps)(RaspberryStatsView)
