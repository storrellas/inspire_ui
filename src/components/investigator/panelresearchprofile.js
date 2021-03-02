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

// Styles

// Assets

// Project imports

const mapStateToProps = state => {
  return { 
    tabResearchProfileOpened: state.tabResearchProfileOpened,
    };
};


class PanelResearchProfile extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      isOpened: false
    }
  }

  componentDidMount(){
  }

  componentDidUpdate(){
  }

  generateChart(){
    console.log("Generating chart in RP")
    const data = [
      {
        "id":340,
        "name":"Cardiovascular Diseases",
        "category_id":27,
        "category_name":"Diseases",
        "counter":20
      },
      {
        "id":458,
        "name":"Cerebrovascular Disorders",
        "category_id":27,
        "category_name":"Diseases",
        "counter":15
      },
      {
        "id":449,
        "name":"Brain Ischemia",
        "category_id":27,
        "category_name":"Diseases",
        "counter":14
      },
      {
        "id":364,
        "name":"Anticoagulants",
        "category_id":5,
        "category_name":"Chemicals and Drugs",
        "counter":13
      },
      {
        "id":339,
        "name":"Atrial Fibrillation",
        "category_id":27,
        "category_name":"Diseases",
        "counter":11
      },
      {
        "id":395,
        "name":"Fibrinolytic Agents",
        "category_id":5,
        "category_name":"Chemicals and Drugs",
        "counter":11
      },
      {
        "id":355,
        "name":"Peripheral Vascular Diseases",
        "category_id":27,
        "category_name":"Diseases",
        "counter":10
      }]

    let chart = am4core.create("researchprofilechart", am4charts.PieChart);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
  
    chart.data = data;

    var series = chart.series.push(new am4charts.PieSeries());
    series.radius = "100%"
    series.dataFields.value = "counter";
    series.dataFields.radiusValue = "counter";
    series.dataFields.category = "name";
    series.slices.template.cornerRadius = 6;
    series.colors.step = 3;
    // See: https://www.amcharts.com/docs/v4/tutorials/dealing-with-piechart-labels-that-dont-fit/
    series.labels.template.maxWidth = 100;
    series.labels.template.wrap = true;
    series.labels.template.fontSize = 14;

  
    series.hiddenState.properties.endAngle = -90;
  
    //chart.legend = new am4charts.Legend();
    this.chart = chart

    // Set state after timeout
    this.setState({isOpened: true})
  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.dispose();
    }
  }

  render() {

    if( this.props.tabResearchProfileOpened == true && this.state.isOpened == false){
      const that = this;
      setTimeout(function(){ that.generateChart() }, 500);
    }

    return (
      <div>    
        <LoadingOverlay
          active={this.state.isOpened == false}
          spinner>
        <div id="researchprofilechart" style={{ height:'100%', height: '300px' }}></div>
        </LoadingOverlay>    
      </div>);
  }
}

export default connect(mapStateToProps, undefined)(withRouter(PanelResearchProfile))