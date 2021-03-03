import React, { useState } from 'react';
// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

import { withRouter } from 'react-router-dom'

import { Modal, Button } from 'react-bootstrap';

/* Imports */
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

// Redux
import { connect } from "react-redux";


import LoadingOverlay from 'react-loading-overlay';

import './panelresearchprofile.scss';

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
      isOpened: false,
      showModal: false,
      openedModal: false,
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

  openModal(e) {
    this.setState({ showModal: true })
  }

  closeModal(e) {
    this.setState({ showModal: false, openedModal: false })
  }

  modalOpened(e){
    this.setState({openedModal: true})
  }

  render() {

    if( this.props.tabResearchProfileOpened == true && this.state.isOpened == false){
      const that = this;
      setTimeout(function(){ that.generateChart() }, 500);
    }

    const data = [
      { label: 'test', width: '80%', value: 4},
      { label: 'test1', width: '20%', value: 3},
      { label: 'test2', width: '40%', value: 6},
    ]

    return (
      <div>    
        <LoadingOverlay
          active={this.state.isOpened == false}
          spinner>
          <div id="researchprofilechart" style={{ height:'100%', height: '300px' }}></div>
          <div className="text-right pr-2 pb-1" style={{ cursor: 'pointer' }} onClick={(e) => this.openModal()}>
              View Details ...
          </div>
        </LoadingOverlay> 

        <Modal animation centered
          show={this.state.showModal}
          onHide={(e) => this.closeModal(e)}
          onEntered={(e) => this.modalOpened()}
          dialogClassName="researh-profile-modal">
          <Modal.Header closeButton>
            <Modal.Title>Company Cooperation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
      
            <div id="category-page-3" className="category" style={{ marginTop: '1em', width: '100%'}}>
              <h4><b>Anatomy</b></h4>
              <div className="d-flex flex-wrap">
                {data.map( (item, key) => 
                  <div key={key} className="w-50 p-2">
                    {item.label}
                    <div className={this.state.openedModal ? "bar ready" : "bar"}>
                      <div className="rowshadow text-rigth pl-3" style={{ width: item.width }}>{item.value}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

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

export default connect(mapStateToProps, undefined)(withRouter(PanelResearchProfile))