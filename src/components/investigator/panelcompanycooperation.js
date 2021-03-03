import React, { useState } from 'react';
// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

import { withRouter } from 'react-router-dom'

import { Modal, Button } from 'react-bootstrap';

/* Imports */
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

import './modal.scss';

// Redux
import { connect } from "react-redux";

// Loading overlay
import LoadingOverlay from 'react-loading-overlay';

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExpandArrowsAlt, faSearch } from '@fortawesome/free-solid-svg-icons'

/* Chart code */
// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end

// Styles

// Assets

// Project imports


const mapStateToProps = state => {
  return {
    tabCompanyCooperationOpened: state.tabCompanyCooperationOpened,
  };
};



class PanelCompanyCooperation extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      isOpened: false,
      showModal: false,
    }
  }



  componentDidMount() {
  }

  componentDidUpdate() {
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

  generateChart() {

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
    this.setState({ isOpened: true })
  }

  generateMaxChart() {

    // Create chart instance
    this.maxchart = am4core.create("companycooperationmaxchart", am4charts.PieChart);

    // Add data
    this.maxchart.data = [
      {
        "nature_of_payment__name": "Travel and Lodging",
        "total_amount": 194
      },
      {
        "nature_of_payment__name": "Expenses",
        "total_amount": 2523.09
      },
      {
        "nature_of_payment__name": "Honoraria",
        "total_amount": 19417
      }]

    // Add and configure Series
    var pieSeries = this.maxchart.series.push(new am4charts.PieSeries());
    pieSeries.labels.template.disabled = true;
    pieSeries.dataFields.value = "total_amount";
    pieSeries.dataFields.category = "nature_of_payment__name";
    pieSeries.dataFields.tooltipText = "{category}{value}";

    this.maxchart.hiddenState.properties.radius = am4core.percent(0);

    this.maxchart.legend = new am4charts.Legend();

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
    this.setState({ showModal: false })
  }

  render() {
    if (this.props.tabCompanyCooperationOpened == true && this.state.isOpened == false) {
      const that = this;
      setTimeout(function () { that.generateChart() }, 500);
    }

    const item = {
      type: 'Honoraria',
      year: '2015',
      company: 'Bristol-Myers Squibb GmbH & Co. KGaA',
      amount: '2017.00',
      currency: 'EUR'
    }
    const data = Array(10).fill(item);

    return (
      <div>
        <LoadingOverlay
          active={this.state.isOpened == false}
          spinner>
          <div id="companycooperationchart" style={{ height: '200px' }}></div>
          <div className="text-right pr-2 pb-1" style={{ cursor: 'pointer' }} onClick={(e) => this.openModal(e)}>
            <FontAwesomeIcon icon={faExpandArrowsAlt} />
          </div>
        </LoadingOverlay>

        <Modal animation centered
          show={this.state.showModal}
          onHide={(e) => this.closeModal(e)}
          onEntered={(e) => this.generateMaxChart()}
          dialogClassName="company-cooperation-modal">
          <Modal.Header closeButton>
            <Modal.Title>Company Cooperation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="d-flex" style={{ height: '100%' }}>
              <div className="d-flex justify-content-center flex-column" style={{ width: '30%' }}>
                <div id="companycooperationmaxchart" style={{ height: '70%' }}></div>
              </div>
              <div style={{ width: '70%' }}>

                <table className="w-100">
                  <thead>
                    <tr>
                      <td className="text-center">Type</td>
                      <td className="text-center">Year</td>
                      <td className="text-center">Company</td>
                      <td className="text-center">Amount</td>
                      <td className="text-center">Currency</td>
                    </tr>
                    <tr style={{ border: '1px solid grey', borderWidth: '1px 0px 2px 0px' }}>
                      <td><FontAwesomeIcon icon={faSearch} style={{ fontSize: '1em', color: 'grey' }} /></td>
                      <td><FontAwesomeIcon icon={faSearch} style={{ fontSize: '1em', color: 'grey' }} /></td>
                      <td><FontAwesomeIcon icon={faSearch} style={{ fontSize: '1em', color: 'grey' }} /></td>
                      <td><FontAwesomeIcon icon={faSearch} style={{ fontSize: '1em', color: 'grey' }} /></td>
                      <td><FontAwesomeIcon icon={faSearch} style={{ fontSize: '1em', color: 'grey' }} /></td>
                      <td></td>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, id) =>
                      <tr key={id}>
                        <td>{item.type}</td>
                        <td>{item.year}</td>
                        <td>{item.company}</td>
                        <td>{item.amount}</td>
                        <td>{item.currency}</td>
                      </tr>
                    )}
                  </tbody>
                </table>

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


export default connect(mapStateToProps, undefined)(withRouter(PanelCompanyCooperation))

