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

const conditions = [
  {
    "name":"Carotid Stenosis",
    "total":1
  },
  {
    "name":"Cerebral Infarction",
    "total":1
  },
  {
    "name":"Infarction",
    "total":1
  },
  {
    "name":"Ischemic Stroke",
    "total":1
  },
  {
    "name":"Stroke",
    "total":2
  }]


const interventions = [
  {
    "intervention__name":"Aspirin",
    "total":1
  },
  {
    "intervention__name":"Best Medical Care",
    "total":1
  },
  {
    "intervention__name":"Citicoline",
    "total":1
  },
  {
    "intervention__name":"Clopidogrel",
    "total":1
  },
  {
    "intervention__name":"Placebo",
    "total":1
  },
  {
    "intervention__name":"Thrombectomy",
    "total":1
  },
  {
    "intervention__name":"Ticagrelor",
    "total":1
  }]


class PanelClinicalTrials extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
    }
  }

  generateConditionsContainerChart() {
    // Create chart instance
    this.conditionsContainerChart = am4core.create("conditionsContainerChart", am4charts.PieChart);

    // Add data
    this.conditionsContainerChart.data = conditions;
    this.conditionsContainerChart.innerRadius = am4core.percent(60);

    // Add and configure Series
    var pieSeries = this.conditionsContainerChart.series.push(new am4charts.PieSeries());
    pieSeries.labels.template.disabled = true;
    pieSeries.dataFields.value = "total";
    pieSeries.dataFields.category = "name";
    pieSeries.dataFields.tooltipText = "{category}{value}";

  }

  generateInterventionsContainerChart() {
    // Create chart instance
    this.interventionsContainerChart = am4core.create("interventionsContainerChart", am4charts.PieChart);

    // Add data
    this.interventionsContainerChart.data = interventions;
    this.interventionsContainerChart.innerRadius = am4core.percent(60);

    // Add and configure Series
    var pieSeries = this.interventionsContainerChart.series.push(new am4charts.PieSeries());
    pieSeries.labels.template.disabled = true;
    pieSeries.dataFields.value = "total";
    pieSeries.dataFields.category = "intervention__name";
    pieSeries.dataFields.tooltipText = "{category}{intervention__name}";

  }

  componentDidMount(){
    this.generateConditionsContainerChart()   
    this.generateInterventionsContainerChart()
  }

  render() {

    return (
      <div>
        <div className="d-flex" style={{ height: '400px', padding: '1em 1em 1em 1em'}}>
          <div className="w-50 text-center">
            <div>Conditions</div>
            <div id="conditionsContainerChart" style={{ width:'100%', height: '100%', paddingBottom: '0.5em'}}></div>
          </div>
          <div className="w-50 text-center">
            <div>Interventions</div>
            <div id="interventionsContainerChart" style={{width:'100%', height: '100%', paddingBottom: '0.5em'}}></div>
          </div>
        </div>
      </div>);
  }
}

export default withRouter(PanelClinicalTrials);
