import React, { useState } from 'react';
// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

import { withRouter } from 'react-router-dom'
import { Modal, Button } from 'react-bootstrap';

/* Imports */
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExpandArrowsAlt, faSearch } from '@fortawesome/free-solid-svg-icons'

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
      isOpened: false,
      showModalPublicationType: false,
      showModalPublicationYears: false,
      showModal: false,
    }
  }

  generatePublicationTypeChart() {
    // Create chart instance
    this.publicationTypeChart = am4core.create("publicationTypeChart", am4charts.PieChart);

    // Add data
    this.publicationTypeChart.data = publicationTypes;
    this.publicationTypeChart.innerRadius = am4core.percent(60);

    // Add and configure Series
    var pieSeries = this.publicationTypeChart.series.push(new am4charts.PieSeries());
    pieSeries.labels.template.disabled = true;
    pieSeries.dataFields.value = "total";
    pieSeries.dataFields.category = "name";
    pieSeries.dataFields.tooltipText = "{category}{value}";
  
    this.publicationTypeChart.hiddenState.properties.radius = am4core.percent(0);
  }

  generatePublicationTypeMaxChart() {
    // Create chart instance
    this.publicationTypeMaxChart = am4core.create("publicationTypeMaxChart", am4charts.PieChart);

    // Add data
    this.publicationTypeMaxChart.data = publicationTypes;
    this.publicationTypeMaxChart.innerRadius = am4core.percent(60);

    // Add and configure Series
    var pieSeries = this.publicationTypeMaxChart.series.push(new am4charts.PieSeries());
    pieSeries.labels.template.disabled = true;
    pieSeries.dataFields.value = "total";
    pieSeries.dataFields.category = "name";
    pieSeries.dataFields.tooltipText = "{category}{value}";
  
    this.publicationTypeMaxChart.hiddenState.properties.radius = am4core.percent(0);
    this.publicationTypeMaxChart.legend = new am4charts.Legend();
  }

  generatePublicationYearsChart() {
    // Create chart instance
    let chart = am4core.create("publicationYearsChart", am4charts.XYChart);

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


    this.publicationYearsChart = chart;
  }

  generatePublicationYearsMaxChart() {
    // Create chart instance
    let chart = am4core.create("publicationYearsMaxChart", am4charts.XYChart);

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


    this.publicationYearsMaxChart = chart;
    this.publicationYearsMaxChart.legend = new am4charts.Legend();
  }

  generateModalContent(){
    const item = {
      position: 'Head of',
      name: 'Predictive value of the Essen Stroke Risk Score and Ankle Brachial Index in acute ischaemic stroke patients from 85 German stroke units.',
      year: '2008',
      position: 'Coauthor',
      type: 'Journal Article',
    }
    const data = Array(10).fill(item);

    return (
    <div className="p-3">
      <table className="w-100">
        <thead>
          <tr>
            <td className="text-center">WebLink</td>
            <td className="text-center">Name</td>
            <td className="text-center">Year</td>
            <td className="text-center">Position</td>
            <td className="text-center">Type</td>
          </tr>
          <tr style={{ border: '1px solid grey', borderWidth: '1px 0px 2px 0px' }}>
            <td><FontAwesomeIcon icon={faSearch} style={{ fontSize: '1em', color: 'grey' }} /></td>
            <td><FontAwesomeIcon icon={faSearch} style={{ fontSize: '1em', color: 'grey' }} /></td>
            <td><FontAwesomeIcon icon={faSearch} style={{ fontSize: '1em', color: 'grey' }} /></td>
            <td><FontAwesomeIcon icon={faSearch} style={{ fontSize: '1em', color: 'grey' }} /></td>
            <td><FontAwesomeIcon icon={faSearch} style={{ fontSize: '1em', color: 'grey' }} /></td>
          </tr>
        </thead>
        <tbody>
          {data.map((item, id) =>
            <tr key={id}>
              <td><img src="https://demo.explicatos.com/img/Internet.png" style={{ height:'25px' }}></img></td>
              <td>{item.name}</td>
              <td>{item.year}</td>
              <td>{item.position}</td>
              <td>{item.type}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>)
  }

  generateChart(){
    this.generatePublicationTypeChart()
    this.generatePublicationYearsChart()

    // Set state after timeout
    this.setState({isOpened: true})
  }

  componentDidMount(){
  }

  componentDidUpdate(){
  }

  componentWillUnmount() {
    if (this.publicationYearChart) {
      this.publicationYearsChart.dispose();
    }
    if (this.publicationTypeChart) {
      this.publicationTypeChart.dispose();
    }
    if (this.publicationYearsMaxChart) {
      this.publicationYearsMaxChart.dispose();
    }
    if (this.publicationTypeMaxChart) {
      this.publicationTypeMaxChart.dispose();
    }
  }

  closeModal(){
    this.setState({ 
      showModalPublicationType: false, 
      showModalPublicationYears: false, 
      showModal: false
    })
  }


  openedModal(){
    const {showModal, showModalPublicationType, showModalPublicationYears} = this.state;

    if( showModal ){
      // Do nothing      
    }else if( showModalPublicationType ){
      this.generatePublicationTypeMaxChart()
    }else if( showModalPublicationYears ){
      this.generatePublicationYearsMaxChart()
    }
  }



  render() {
    if( this.props.tabPublicationsOpened == true && this.state.isOpened == false){
      const that = this;
      setTimeout(function(){ that.generateChart() }, 500);
    }
      
    const {showModal, showModalPublicationType, showModalPublicationYears} = this.state;
    const isModal = showModal || showModalPublicationType || showModalPublicationYears;
    let modalContent = <div>Unknown</div>
    if( showModal ){
      modalContent = this.generateModalContent()      
    }else if( showModalPublicationType ){
      modalContent = <div id="publicationTypeMaxChart" style={{ width:'100%', height:'100%', marginTop:'20px'}}></div>
    }else if( showModalPublicationYears ){
      modalContent = <div id="publicationYearsMaxChart" style={{ width:'100%', height:'100%', marginTop:'20px'}}></div>
    }

    return (
      <div>
        <LoadingOverlay
          active={this.state.isOpened == false}
          spinner>
        <div className="d-flex" style={{ padding: '1em 1em 1em 1em'}}>
          <div className="w-50 text-center">
            <div>Publication Types</div>
            <div id="publicationTypeChart" style={{ width:'100%', height:'200px', marginTop:'20px'}}></div>
            <div className="text-right pr-2 pb-1" style={{ cursor: 'pointer' }} 
                onClick={(e) => this.setState({ showModalPublicationType: true})}>
              <FontAwesomeIcon icon={faExpandArrowsAlt} />
            </div>
          </div>
          <div className="w-50 text-center">
            <div>Publication Years</div>
            <div id="publicationYearsChart" style={{width:'100%', height:'200px', marginTop:'20px'}}></div>
            <div className="text-right pr-2 pb-1" style={{ cursor: 'pointer' }} 
                  onClick={(e) => this.setState({ showModalPublicationYears: true})}>
              <FontAwesomeIcon icon={faExpandArrowsAlt} />
            </div>
          </div>
        </div>
        <div className="text-right pr-2 pb-1" style={{ cursor: 'pointer' }} 
                  onClick={(e) => this.setState({ showModal: true})}>
          View Details ...
        </div>
        </LoadingOverlay>

        <Modal animation centered
          show={isModal}
          onHide={(e) => this.closeModal(e)}
          onEntered={(e) => this.openedModal()}
          dialogClassName="publication-type-modal">
          <Modal.Header closeButton>
            <Modal.Title>Company Cooperation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {modalContent}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={(e) => this.closeModal(e)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>


      </div>);
  }
}

export default connect(mapStateToProps, undefined)(withRouter(PanelPublications))

