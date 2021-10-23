import React from "react";
import { connect } from "react-redux";
import { Grid } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { PiHistorySelector,PiIdentitiesSelector } from "../../reducers/selectors";
import { css } from '@emotion/css'

export function piselected_xor(currid,nextid){
  if(!currid){
    return true
  } else if(currid.submask === nextid){
    return false
  }
  else {
    return true
  }
}
const columns: GridColDef[] = [
  { field: "submask", headerName: "Subnet Mask", width: 150 },
  { field: "osname", headerName: "OS", width: 200 },
  { field: "cpuload", headerName: "Load(~5min)", width: 150 },
  { field: "processuptime", headerName: "pUptime (Hours)", width: 200 },
  { field: "date", headerName: "Date", width: 150 },
];

class RaspberryStatsView extends React.Component {
  constructor(){
    super()
    this.state = {
      selectedpi: null,
    }
    this.setSelectedPi = this.setSelectedPi.bind(this)
  }
  setSelectedPi(pi){
    if(piselected_xor(this.state.selectedpi,pi.submask)){
      this.setState({
        selectedpi: pi
      })
    } else {
      this.setState({
        selectedpi: null
      })
    }
  }
  render(){
    const selectedpi = this.state.selectedpi;
    const selectedButtonStyles = css`
    height: 40px;
    width: 80px;
    border: 3px solid green;
    `;
    const unselectedButtonStyles = css`
    height: 35px;
    width: 75px;
    border: 1px solid black;
    `;
    return (
      <Grid container spacing={2} sx={{ height: "90vh" }}>
        <Grid item xs={4}>
          <p> Click on a identity below to view its stats and information</p>
          <div className='mirror-container'>
          {this.props.items.map(function(pi){
            return <button
             className={selectedpi && selectedpi.submask === pi.submask ? selectedButtonStyles : unselectedButtonStyles }
             key={`infotainment-${pi.submask}`}
             onClick={() => this.setSelectedPi(pi)}>
             {pi.submask}
            </button>
          })}
          </div>
          {/*Column*/}
          {!!this.state.selectedpi && (
            <div>
              {Object.keys(this.state.selectedpi).map(function (key) {
                return (
                  <div key={`video: ${key}`}>
                    <p>{this.state.selectedpi[key]}</p>
                  </div>
                );
              })}
            </div>
          )}
        </Grid>
        <Grid item xs={8}>
          {/*browse menu, to find other files */}
          <DataGrid
            rows={this.props.items}
            columns={columns}
          />
        </Grid>
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return {
    names: PiIdentitiesSelector(state) ?? [],
    items: PiHistorySelector(state) ?? [],
  };
}


export default connect(mapStateToProps)(RaspberryStatsView);
