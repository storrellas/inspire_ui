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


// Axios
import axios from 'axios';
import environment from '../../environment.json';

// Project Imports
import InspirePagination from '../shared/pagination'
import SearchHeader, { SEARCH_HEADER } from '../shared/searchheader'

// Themes begin
am4core.useTheme(am4themes_animated);

const mapStateToProps = state => {
  return {
    tabCompanyCooperationOpened: state.tabCompanyCooperationOpened,
  };
};

// const FILTERING = {
//   TYPE: 'nature_of_payment',
//   YEAR: 'year',
//   COMPANY: 'institution',
//   AMOUNT: 'amount',
//   CURRENCY: 'currency'
// }

const FILTERING = {
  TYPE:     { dataField:'nature_of_payment', caption: 'type', type: SEARCH_HEADER.TEXT },
  YEAR:     { dataField:'year', caption: 'year', type: SEARCH_HEADER.NUMBER},
  COMPANY:  { dataField:'institution', caption: 'company', type: SEARCH_HEADER.TEXT},
  AMOUNT:   { dataField:'amount', caption: 'amount', type: SEARCH_HEADER.NUMBER},
  CURRENCY: { dataField:'currency', caption: 'currency', type: SEARCH_HEADER.NUMBER},
}

class PanelCompanyCooperation extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      currentPage: 1,
      totalPage: 10,
      take: 10,
      limit: 10,
      isLoading: false,
      isOpened: false,
      showModal: false,
      dataPerCompany: undefined,
      dataPerNature: undefined,
      investigatorId: undefined,
      dataCompanyCooperations: [],
      filtering : {
        type: '',
        year: '', 
        company: '',
        amount: '',
        currency: ''
      }
    }

    this.typingTimeout = undefined

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
    for(const item of this.state.dataPerCompany ){
      let name = item.institution__parent_name
      companySet.add(name) 
      yearSet.add(item.year)  
    }

    // Initialise array
    let companyList = []
    for(const item of Array.from(companySet) ){
      companyList.push({name:item, total:0})      
    }
    for(const item of this.state.dataPerCompany ){
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

    this.maxchart.data = this.state.dataPerNature

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

  async retrieveCooperationsPerCompany(){
    try{

      const token = localStorage.getItem('token')

      // Perform request
      const url = `${environment.base_url}/api/investigator/${this.state.investigatorId}/cooperations-per-company/`
      const response = await axios.get(url,
        { headers: { "Authorization": "jwt " + token }
      })

      // Chart data
      this.state.dataPerCompany = response.data.results


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

  async retrieveCooperationsPerNatureOfPayment(){
    try{

      const token = localStorage.getItem('token')

      // Perform request
      const url = `${environment.base_url}/api/investigator/${this.state.investigatorId}/cooperations-per-nature-of-payment/`;
      const response = await axios.get(url,
        { headers: { "Authorization": "jwt " + token }
      })

      // Chart data
      this.state.dataPerNature = response.data.results

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

  async retrieveCompanyCooperations(page = 1, filtering = undefined){
    try{
      this.setState({isLoading: true})

      const token = localStorage.getItem('token')
      const { take, limit } = this.state;

      // Perform request
      let skip = this.state.take * (page-1);
      let offset = this.state.take * (page-1);
      let urlParams = `limit=${limit}&offset=${offset}&skip=${skip}&take=${take}`

      // Add filtering
      if( filtering !== undefined ){
        for(const [key, value] of Object.entries(FILTERING) ){
          if( filtering[value.caption] !== '' ){
            urlParams = `${urlParams}&${value.dataField}=${filtering[value.caption]}`;
          }
        }     
      }

      const url = `${environment.base_url}/api/investigator/${this.state.investigatorId}/company-cooperations/?${urlParams}`;
      const response = await axios.get(url,
        { headers: { "Authorization": "jwt " + token }
      })

      // Set State
      const totalPage = Math.ceil(response.data.count / take);      
      this.setState({
        dataCompanyCooperations: response.data.results, 
        currentPage: page,
        totalPage: totalPage,
        isLoading: false,
      })

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


  componentDidMount(){
    const { match: { params } } = this.props;
    this.state.investigatorId = params.subid;
    this.state.investigatorId = this.state.investigatorId.split('-')[this.state.investigatorId.split('-').length -1 ]
    this.state.investigatorId = parseInt( this.state.investigatorId )

    this.retrieveCooperationsPerCompany()
    this.retrieveCooperationsPerNatureOfPayment()
    this.retrieveCompanyCooperations()
  }

  navigatePage(page) {
    this.retrieveCompanyCooperations(page)
  }

  retrieveCompanyCooperationsFiltered(key, value){
    let { currentPage, filtering } = this.state;
    for(const [candidate_key, candidate_value] of Object.entries(FILTERING) ){
      if( key === candidate_value.caption ){
        filtering[candidate_value.caption] = value
      }
    }

    // Clear timeout
    const that = this;
    if ( this.typingTimeout ) {
      clearTimeout(this.typingTimeout);
    }
    this.typingTimeout = 
      setTimeout(function () { that.retrieveCompanyCooperations(currentPage, filtering) }, 2000)

  }

  render() {
    if (this.props.tabCompanyCooperationOpened == true && 
      this.state.isOpened == false &&
      this.state.dataPerCompany !== undefined) {
      const that = this;
      setTimeout(function () { that.generateChart() }, 500);
    }

    const {dataCompanyCooperations, currentPage, totalPage} = this.state;
    const filteringArray = Object.values(FILTERING)

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
          <Modal.Body style={{ overflowY: 'scroll', height: '100%'}}>
            <div className="d-flex" style={{ height: '100%' }}>
              <div className="d-flex justify-content-center flex-column" style={{ width: '30%' }}>
                <div id="companycooperationmaxchart" style={{ height: '70%' }}></div>
              </div>
              <div style={{ width: '70%' }}>
              <LoadingOverlay
                active={ this.state.isLoading }
                spinner>

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
                    {filteringArray.map((item, id) =>
                      <td key={id}>
                        <SearchHeader 
                          onChange={(pattern) => this.retrieveCompanyCooperationsFiltered(item.caption, pattern)} 
                          type={item.type} />
                      </td>
                    )}

                      
                    </tr>
                  </thead>
                  <tbody>
                    {dataCompanyCooperations.map((item, id) =>
                      <tr key={id}>
                        <td style={{ width: '20%'}}>{item.nature_of_payment}</td>
                        <td style={{ width: '10%'}}>{item.year}</td>
                        <td style={{ width: '40%'}}>{item.institution}</td>
                        <td style={{ width: '20%'}}>{item.amount}</td>
                        <td style={{ width: '10%'}}>{item.currency}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
                </LoadingOverlay>
                <InspirePagination currentPage={currentPage} totalPage={totalPage} onClick={this.navigatePage.bind(this)}/>

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

