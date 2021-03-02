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

// Themes begin
am4core.useTheme(am4themes_animated);

// Styles

// Assets

// Project imports

const mapStateToProps = state => {
  return { 
    tabPublicationsOpened: state.tabPublicationsOpened,
    };
};

const publicationTypes = [
  {
    "name":"Clinical Trial",
    "total":1
  },
  {
    "name":"Historical Article",
    "total":1
  },
  {
    "name":"Introductory Journal Article",
    "total":1
  },
  {
    "name":"News",
    "total":1
  },
  {
    "name":"Clinical Trial Publication, Phase II",
    "total":2
  },
  {
    "name":"Letter",
    "total":2
  },
  {
    "name":"Consensus Development Conference",
    "total":3
  },
  {
    "name":"Case Reports",
    "total":5
  },
  {
    "name":"Comparative Study",
    "total":8
  },
  {
    "name":"English Abstract",
    "total":11
  },
  {
    "name":"Journal Article",
    "total":52
  }]

const publicationYear = [
  {
    "publication_year":"2008",
    "total":3
  },
  {
    "publication_year":"2009",
    "total":10
  },
  {
    "publication_year":"2010",
    "total":14
  },
  {
    "publication_year":"2011",
    "total":14
  },
  {
    "publication_year":"2012",
    "total":6
  },
  {
    "publication_year":"2013",
    "total":10
  },
  {
    "publication_year":"2014",
    "total":6
  },
  {
    "publication_year":"2015",
    "total":7
  },
  {
    "publication_year":"2016",
    "total":3
  },
  {
    "publication_year":"2017",
    "total":7
  },
  {
    "publication_year":"2018",
    "total":7
  }]


class PanelPublications extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      isOpened: false
    }
  }

  publicationTypeChart() {
    // Create chart instance
    this.publicationTypechart = am4core.create("publicationTypeContainerChart", am4charts.PieChart);

    // Add data
    this.publicationTypechart.data = publicationTypes;
    this.publicationTypechart.innerRadius = am4core.percent(60);

    // Add and configure Series
    var pieSeries = this.publicationTypechart.series.push(new am4charts.PieSeries());
    pieSeries.labels.template.disabled = true;
    pieSeries.dataFields.value = "total";
    pieSeries.dataFields.category = "name";
    pieSeries.dataFields.tooltipText = "{category}{value}";
  
    this.publicationTypechart.hiddenState.properties.radius = am4core.percent(0);
  }

  publicationYearChart() {
    // Create chart instance
    let chart = am4core.create("publicationYearContainerChart", am4charts.XYChart);

    // Add data
    chart.data = publicationYear;

    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "publication_year";
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    // Create series
    let series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = "value";
    series.dataFields.dateX = "date";
    series.tooltipText = "{value}"
    series.strokeWidth = 2;
    series.minBulletDistance = 15;
    series.dataFields.valueY = "total";
    series.dataFields.categoryX = "publication_year";


    this.publicationYearchart = chart;

  }

  generateChart(){
    this.publicationTypeChart()
    this.publicationYearChart()

    // Set state after timeout
    this.setState({isOpened: true})
  }

  componentDidMount(){
  }

  componentDidUpdate(){
  }

  componentWillUnmount() {
    if (this.publicationYearchart) {
      this.publicationYearchart.dispose();
    }
    if (this.publicationTypechart) {
      this.publicationTypechart.dispose();
    }
  }

  render() {
    if( this.props.tabPublicationsOpened == true && this.state.isOpened == false){
      const that = this;
      setTimeout(function(){ that.generateChart() }, 500);
    }
      
    
    return (
      <div>
        <LoadingOverlay
          active={this.state.isOpened == false}
          spinner>
        <div className="d-flex" style={{ padding: '1em 1em 1em 1em'}}>
          <div className="w-50 text-center">
            <div>Publication Types</div>
            <div id="publicationTypeContainerChart" style={{ width:'100%', height:'200px', marginTop:'20px'}}></div>
          </div>
          <div className="w-50 text-center">
            <div>Publication Years</div>
            <div id="publicationYearContainerChart" style={{width:'100%', height:'200px', marginTop:'20px'}}></div>
          </div>
        </div>
        </LoadingOverlay>
      </div>);
  }
}

export default connect(mapStateToProps, undefined)(withRouter(PanelPublications))

