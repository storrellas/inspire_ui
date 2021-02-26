import React, { useState } from 'react';
// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

import { withRouter } from 'react-router-dom'

/* Imports */
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

// Themes begin
am4core.useTheme(am4themes_animated);

// Styles

// Assets

// Project imports

const eventType = [
  {
    "name":"Symposium",
    "total":1
  },
  {
    "name":"Course",
    "total":2
  },
  {
    "name":"Forum",
    "total":2
  },
  {
    "name":"Satellite Symposium",
    "total":2
  },
  {
    "name":"Workshop",
    "total":2
  },
  {
    "name":"Seminar",
    "total":3
  },
  {
    "name":"Conference",
    "total":5
  },
  {
    "name":"Congress",
    "total":10
  }]

const eventRole = [
  {"state":"event","Organizer":3,"Chairperson":11,"Speaker":13}
]


class PanelEvents extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
    }
  }
  
  generateEventTypeChart() {
    // Create chart instance
    this.eventTypeChart = am4core.create("eventTypeContainerChart", am4charts.PieChart);

    // Add data
    this.eventTypeChart.data = eventType;
    this.eventTypeChart.innerRadius = am4core.percent(60);

    // Add and configure Series
    var pieSeries = this.eventTypeChart.series.push(new am4charts.PieSeries());
    pieSeries.labels.template.disabled = true;
    pieSeries.dataFields.value = "total";
    pieSeries.dataFields.category = "name";
    pieSeries.dataFields.tooltipText = "{category}{value}";

  
  }

  generateRoleContainerChart(){
    // Create chart instance
    var chart = am4core.create("eventRoleContainerChart", am4charts.XYChart);

    // Add data
    // chart.data = [{
    //   "year": "",
    //   "europe": 2.5,
    //   "namerica": 2.5,
    //   "asia": 2.1,
    //   "lamerica": 0.3,
    //   "meast": 0.2,
    //   "africa": 0.1
    // }];

    chart.data = [
      {"state":"","Organizer":3,"Chairperson":11,"Speaker":13}
    ]

    // Create axes
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "state";
    categoryAxis.renderer.grid.template.location = 0;


    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.inside = true;
    valueAxis.renderer.labels.template.disabled = true;
    valueAxis.min = 0;

    // Create series
    function createSeries(field, name) {
      
      // Set up series
      let series = chart.series.push(new am4charts.ColumnSeries());
      series.name = name;
      series.dataFields.valueY = field;
      series.dataFields.categoryX = "state";
      series.sequencedInterpolation = true;
      
      // Make it stacked
      series.stacked = true;
      
      // Configure columns
      series.columns.template.width = am4core.percent(60);
      series.columns.template.tooltipText = "[bold]{name}[/]\n[font-size:14px]{categoryX}";
      
      // Add label
      let labelBullet = series.bullets.push(new am4charts.LabelBullet());
      labelBullet.label.text = "{valueY}";
      labelBullet.locationY = 0.5;
      labelBullet.label.hideOversized = true;
      
      return series;
    }

    createSeries("Organizer", "Organizer");
    createSeries("Chairperson", "Chairperson");
    createSeries("Speaker", "Speaker");

    // Legend
    //chart.legend = new am4charts.Legend();

    this.eventTypeChart = chart;

  }

  componentDidMount(){
    this.generateEventTypeChart()
    this.generateRoleContainerChart()
  }

  render() {

    return (
      <div>
        <div className="d-flex" style={{ height: '400px', padding: '1em 1em 1em 1em'}}>
          <div className="w-50 text-center">
            <div>Event Types</div>
            <div id="eventTypeContainerChart" style={{ width:'100%', height: '100%', paddingBottom: '0.5em'}}></div>
          </div>
          <div className="w-50 text-center">
            <div>Event Roles</div>
            <div id="eventRoleContainerChart" style={{width:'100%', height: '100%', paddingBottom: '0.5em'}}></div>
          </div>
        </div>
      </div>);
  }
}

export default withRouter(PanelEvents);
