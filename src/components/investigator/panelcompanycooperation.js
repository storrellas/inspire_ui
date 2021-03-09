import React from 'react';
// Bootstrap
import { Modal, Button } from 'react-bootstrap';

// React Router
import { withRouter } from 'react-router-dom'

// am4Charts
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

// Styles
import './modal.scss';

// Redux
import { connect } from "react-redux";

// Loading overlay
import LoadingOverlay from 'react-loading-overlay';

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

// Axios
import axios from 'axios';
import environment from '../../environment.json';

// Themes begin
am4core.useTheme(am4themes_animated);

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
      data: undefined
    }
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

    // Generate set
    let companySet = new Set()
    let yearSet = new Set()
    for(const item of this.state.data ){
      let name = item.institution__parent_name
      companySet.add(name) 
      yearSet.add(item.year)  
    }

    // Initialise array
    let companyList = []
    for(const item of Array.from(companySet) ){
      companyList.push({name:item, total:0})      
    }
    for(const item of this.state.data ){
      const pos = companyList.map((e) => e.name).indexOf(item.institution__parent_name);
      companyList[pos][item['year']] = item['total_amount']
      companyList[pos]['total'] = companyList[pos]['total'] + item['total_amount']
    }
    companyList.sort((a,b) => (a.total > b.total) ? 1 : ((b.total > a.total) ? -1 : 0) )



    // Add data
    this.chart.data = companyList
    
    // Create axes
    let categoryAxis = this.chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "name";
    categoryAxis.renderer.grid.template.opacity = 0;
    let label = categoryAxis.renderer.labels.template;
    label.truncate = true;
    label.maxWidth = 150;
    label.tooltipText = "{category}";

    let valueAxis = this.chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.renderer.grid.template.opacity = 1;
    valueAxis.renderer.ticks.template.strokeOpacity = 0.5;
    valueAxis.renderer.ticks.template.stroke = am4core.color("#495C43");
    valueAxis.renderer.ticks.template.length = 10;
    valueAxis.renderer.line.strokeOpacity = 0.5;
    valueAxis.renderer.baseGrid.disabled = true;
    valueAxis.renderer.minGridDistance = 50;
    valueAxis.renderer.labels.template.rotation = 45;

    const that = this;
    function createSeries(field, name) {
      let series = that.chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueX = field;
      series.dataFields.categoryY = "name";
      series.stacked = true;
      series.name = name;
      series.columns.template.tooltipText = "{name}: {valueX}";
  
      let labelBullet = series.bullets.push(new am4charts.LabelBullet());
      labelBullet.locationX = 0.5;
      labelBullet.label.text = "{valueX}";
      labelBullet.label.fill = am4core.color("#fff");  
    }


    // Generate series
    for(const item of Array.from(yearSet) ){
      createSeries(item, item);
    }

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
    if( this.maxChart ){
      this.maxchart.dispose()
    }
  }

  openModal(e) {
    this.setState({ showModal: true })
  }

  closeModal(e) {
    this.setState({ showModal: false })
  }

  async componentDidMount(){
    try{

      const token = localStorage.getItem('token')

      const { match: { params } } = this.props;
      let investigatorId = params.subid;
      investigatorId = investigatorId.split('-')[investigatorId.split('-').length -1 ]
      investigatorId = parseInt( investigatorId )

      // Perform request
      const response = await axios.get(`${environment.base_url}/api/investigator/${investigatorId}/cooperations-per-company/`,
        { headers: { "Authorization": "jwt " + token }
      })

      // Chart data
      this.state.data = response.data.results

    }catch(error){

      // Error
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
          console.log(error.request);
      } else {
          console.log('Error', error.message);
      }

    }
  }

  render() {
    if (this.props.tabCompanyCooperationOpened == true && 
      this.state.isOpened == false &&
      this.state.data !== undefined) {
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
          <div id="companycooperationchart" style={{ height: '400px', padding: '1em' }}></div>
          <div className="text-right pr-2 pb-1" style={{ cursor: 'pointer' }} onClick={(e) => this.openModal(e)}>
            View Details ...
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

