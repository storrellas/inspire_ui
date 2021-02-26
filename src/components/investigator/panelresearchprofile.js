import React, { useState } from 'react';
// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

import { withRouter } from 'react-router-dom'

/* Imports */
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";


/* Chart code */
// Themes begin
am4core.useTheme(am4themes_animated);

// Styles

// Assets

// Project imports


class PanelResearchProfile extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentDidMount(){

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
  
    series.hiddenState.properties.endAngle = -90;
  
    //chart.legend = new am4charts.Legend();
    this.chart = chart
  }

  render() {

    return (
      <div style={{ padding: '1em'}}>        
        <div id="researchprofilechart" style={{ height:'100%', height: '500px' }}></div>
      </div>);
  }
}

export default withRouter(PanelResearchProfile);
