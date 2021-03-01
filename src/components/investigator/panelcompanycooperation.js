import React, { useState } from 'react';
// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

import { withRouter } from 'react-router-dom'

/* Imports */
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

// Redux
import { connect } from "react-redux";

import LoadingOverlay from 'react-loading-overlay';


/* Chart code */
// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end

// Styles

// Assets

// Project imports


const mapStateToProps = state => {
  return { 
      tab_company_cooperation_rendered: state.tab_company_cooperation_rendered,
    };
};



class PanelCompanyCooperation extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      isOpened: false,
      isLoading: true
    }
  }



  componentDidMount(){
  }

  componentDidUpdate(){
  }

  createSeries(field, name) {
    let series = this.chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueX = field;
    series.dataFields.categoryY = "year";
    series.stacked = true;
    series.name = name;
    
    let labelBullet = series.bullets.push(new am4charts.LabelBullet());
    labelBullet.locationX = 0.5;
    labelBullet.label.text = "{valueX}";
    labelBullet.label.fill = am4core.color("#fff");

  }

  generateChart(){

    // Create chart instance
    this.chart = am4core.create("companycooperationchart", am4charts.XYChart);


    // Add data
    this.chart.data = [{
      "year": "2016",
      "europe": 2.5,
      "namerica": 2.5,
      "asia": 2.1,
      "lamerica": 0.3,
      "meast": 0.2,
      "africa": 0.1
    }, {
      "year": "2017",
      "europe": 2.6,
      "namerica": 2.7,
      "asia": 2.2,
      "lamerica": 0.3,
      "meast": 0.3,
      "africa": 0.1
    }, {
      "year": "2018",
      "europe": 2.8,
      "namerica": 2.9,
      "asia": 2.4,
      "lamerica": 0.3,
      "meast": 0.3,
      "africa": 0.1
    }];



    // Create axes
    let categoryAxis = this.chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "year";
    categoryAxis.renderer.grid.template.opacity = 0;

    let valueAxis = this.chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.renderer.grid.template.opacity = 0;
    valueAxis.renderer.ticks.template.strokeOpacity = 0.5;
    valueAxis.renderer.ticks.template.stroke = am4core.color("#495C43");
    valueAxis.renderer.ticks.template.length = 10;
    valueAxis.renderer.line.strokeOpacity = 0.5;
    valueAxis.renderer.baseGrid.disabled = true;
    valueAxis.renderer.minGridDistance = 40;


    this.createSeries("europe", "Europe");
    this.createSeries("namerica", "North America");
    this.createSeries("asia", "Asia");
    this.createSeries("lamerica", "Latin America");
    this.createSeries("meast", "Middle East");
    this.createSeries("africa", "Africa");

    // Set state after timeout
    this.setState({isLoading: false, isOpened: true})
  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.dispose();
    }
  }

  render() {
    if( this.props.tab_company_cooperation_rendered == true && this.state.isOpened == false){
      const that = this;
      setTimeout(function(){ that.generateChart() }, 500);
    }
      
    return (
      <div>
        <LoadingOverlay
          active={this.state.isLoading}
          spinner>
          <div id="companycooperationchart" style={{ height:'200px' }}></div>         
        </LoadingOverlay>
      </div>);
  }
}


export default connect(mapStateToProps, undefined)(withRouter(PanelCompanyCooperation))

