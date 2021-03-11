import React from 'react';
// Bootstrap
import { Modal, Button } from 'react-bootstrap';
// React Router
import { withRouter } from 'react-router-dom'

// am4Charts
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExpandArrowsAlt, faSearch, faCaretRight } from '@fortawesome/free-solid-svg-icons'

// Redux
import { connect } from "react-redux";

// Loading Overlay
import LoadingOverlay from 'react-loading-overlay';

import './panelevents.scss';

// Animate Height
import AnimateHeight from 'react-animate-height';

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
    tabEventsOpened: state.tabEventsOpened,
  };
};


class PanelEvents extends React.Component {

  constructor(props) {
    super(props)



    this.state = {
      isOpened: false,
      showModalEventType: false,
      showModalEventRole: false,
      showModal: false,
      dataTable: [],
      dataTypes: undefined,
      dataRoles: undefined,
      currentPage: 1,
      totalPage: 10,
      take: 10,
      limit: 10,
      isLoading: false,
    }    
  }

  generateEventType(container){
    // Create chart instance
    const chart = am4core.create(container, am4charts.PieChart);

    // Add data
    chart.data = this.state.dataTypes;
    chart.innerRadius = am4core.percent(60);

    // Add and configure Series
    var pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.labels.template.disabled = true;
    pieSeries.dataFields.value = "total";
    pieSeries.dataFields.category = "name";
    pieSeries.dataFields.tooltipText = "{category}{value}";
    pieSeries.hiddenState.properties.endAngle = -90;

    return chart;
  }

  generateEventTypeChart() {
    this.eventTypeChart = this.generateEventType("eventTypeChart")
  }

  generateEventTypeMaxChart() {
    this.eventTypeMaxChart = this.generateEventType("eventTypeMaxChart")
    this.eventTypeMaxChart.legend = new am4charts.Legend();
  }

  createSeries(chart, field, name){
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

  generateEventRole(container) {
    // Create chart instance
    const chart = am4core.create(container, am4charts.XYChart);

    chart.data = this.state.dataRoles;

    // Create axes
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "state";
    categoryAxis.renderer.grid.template.location = 0;


    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.inside = true;
    valueAxis.renderer.labels.template.disabled = true;
    valueAxis.min = 0;

    this.createSeries(chart, "Organizer", "Organizer");
    this.createSeries(chart, "Chairperson", "Chairperson");
    this.createSeries(chart, "Speaker", "Speaker");

    return chart;   
  }

  generateEventRoleChart() {
    this.eventRoleChart = this.generateEventRole("eventRoleChart")
  }

  generateEventRoleMaxChart() {
    this.eventRoleMaxChart = this.generateEventRole("eventRoleMaxChart")
    this.eventRoleMaxChart.legend = new am4charts.Legend();    
  }

  onClickedTableDetail(id){    
    let { dataTable } = this.state;    
    const target = !dataTable[id].show
    dataTable = dataTable.map( item => { return {...item, show: false} })
    dataTable[id].show = target;
    this.setState({ dataTable: dataTable })
  }

  generateModalContent(){
    const headers = [
      "Name", "Position", "Subtype", "Year", 
      "City", "Country"
    ]
    const { currentPage, totalPage } = this.state;

    return (
    <div className="p-3 h-100" style={{ fontSize:'14px', overflowY: 'scroll'}}>
      <LoadingOverlay
        active={ this.state.isLoading }
        spinner>

      <table className="w-100" style={{ fontSize: '12px'}}>
        <thead>
          <tr>
            <td></td>
            {headers.map((item, id) =>
              <td key={id} className="text-center">{item}</td>
            )}
          </tr>
          <tr style={{ border: '1px solid grey', borderWidth: '1px 0px 2px 0px' }}>
            <td></td>
            {headers.map((item, id) =>
              <td key={id} >
                <SearchHeader onChange={(e) => console.log("event", e)} type={SEARCH_HEADER.TEXT} />
              </td>
            )}
          </tr>
        </thead>
        <tbody>
          {this.state.dataTable.map((item, id) =>
            [
            <tr key={id}>
              <td className="text-center" style={{ width: '5%'}}>
                <FontAwesomeIcon className={item.show?'table-caret active':'table-caret'} icon={faCaretRight} 
                  style={{ fontSize: '1em', color: 'grey', cursor:'pointer' }} 
                  onClick={(e) => this.onClickedTableDetail(id)} />
              </td>
              <td style={{ width: '35%'}}>{item.name}</td>
              <td style={{ width: '10%'}}>{item.position}</td>
              <td style={{ width: '10%'}}>{item.subtype}</td>
              <td style={{ width: '15%'}}>{item.year}</td>
              <td style={{ width: '15%'}}>{item.city}</td>              
              <td style={{ width: '15%'}}>{item.country}</td>
            </tr>,
            <tr key={id+"_"}>
              <td colSpan="7">
              <AnimateHeight
                id="example-panel"
                height={ item.show?'auto':0}
                duration={250}>
                <div style={{ border: '1px solid grey', borderWidth: '1px 0px 1px 0px', 
                              padding: '0.5em', paddingLeft: '2em', backgroundColor: '#fafafa'}}>
                  <div><span className="font-weight-bold">Talks:</span> {item.talks}</div>
                  <div><span className="font-weight-bold">Sesions:</span> {item.sessions}</div>
                  <div><span className="font-weight-bold">Posters:</span> {item.posters}</div>
                </div>
                </AnimateHeight>
              </td>
            </tr>]
            
          )}
        </tbody>
      </table>
      </LoadingOverlay>
      <InspirePagination currentPage={currentPage} totalPage={totalPage} onClick={this.navigatePage.bind(this)}/>
    </div>)
  }

  async retrieveEventTypes(){
    try{      
      const token = localStorage.getItem('token')


      // Perform request
      const response = await axios.get(`${environment.base_url}/api/investigator/${this.investigatorId}/events-per-type/`,
        { headers: { "Authorization": "jwt " + token }
      })
      this.state.dataTypes = response.data.results;

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

  async retrieveEventPosition(){
    try{      
      const token = localStorage.getItem('token')
  


      // Perform request
      const response = await axios.get(`${environment.base_url}/api/investigator/${this.investigatorId}/events-per-position/`,
        { headers: { "Authorization": "jwt " + token }
      })
      this.state.dataRoles = response.data.results;

      // Process Data
      const dataRoles = {"state": "event"}
      for(const item of response.data.results){
        dataRoles[ item['position__name'] ] = item['total']
      }
      this.state.dataRoles = [dataRoles];
    
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

  async retrieveEvents(page = 1){
    try{
      this.setState({isLoading: true})

      const token = localStorage.getItem('token')
      const { take, limit } = this.state;

      // Perform request
      let skip = this.state.take * (page-1);
      let offset = this.state.take * (page-1);
      const urlParams = `limit=${limit}&offset=${offset}&skip=${skip}&take=${take}`
      const url = `${environment.base_url}/api/investigator/${this.investigatorId}/events/?${urlParams}`;
      const response = await axios.get(url,
        { headers: { "Authorization": "jwt " + token }
      })

      // Set State
      const totalPage = Math.ceil(response.data.count / take);      
      this.setState({
        dataTable: response.data.results, 
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


  async componentDidMount() {
    const { match: { params } } = this.props;
    this.investigatorId = params.subid;
    this.investigatorId = this.investigatorId.split('-')[this.investigatorId.split('-').length -1 ]
    this.investigatorId = parseInt( this.investigatorId )

    this.retrieveEventTypes()
    this.retrieveEventPosition()   
    this.retrieveEvents()
  }

  generateChart() {
    this.generateEventTypeChart()
    this.generateEventRoleChart()

    // Set state after timeout
    this.setState({isOpened: true})
  }

  componentWillUnmount() {
    if (this.eventTypeChart) {
      this.eventTypeChart.dispose();
    }
    if (this.eventRoleChart) {
      this.eventRoleChart.dispose();
    }

  }

  closeModal(){
    this.setState({ 
      showModalEventType: false, 
      showModalEventRole: false, 
      showModal: false
    })
  }

  navigatePage(page) {
    this.retrieveEvents(page)
  }

  openedModal(){
    const {showModal, showModalEventType, showModalEventRole} = this.state;

    
    if( showModal ){
      // Do nothing      
    }else if( showModalEventType ){
      this.generateEventTypeMaxChart()
    }else if( showModalEventRole ){
      this.generateEventRoleMaxChart()
    }
  }


  closedModal(){
    if (this.eventTypeMaxChart) {
      this.eventTypeMaxChart.dispose();
    }
    if (this.eventRoleMaxChart) {
      this.eventRoleMaxChart.dispose();
    }
  }

  render() {
    if (this.props.tabEventsOpened == true && 
        this.state.isOpened == false &&
        this.state.dataRoles !== undefined &&
        this.state.dataTypes !== undefined) {
      const that = this;
      setTimeout(function () { that.generateChart() }, 500);
    }



    const {showModal, showModalEventType, showModalEventRole} = this.state;
    const isModal = showModal || showModalEventType || showModalEventRole;
    let modalContent = <div>Unknown</div>
    if( showModal ){
      modalContent = this.generateModalContent()     
    }else if( showModalEventType ){
      modalContent = <div id="eventTypeMaxChart" style={{ width:'100%', height:'100%', marginTop:'20px'}}></div>
    }else if( showModalEventRole ){
      modalContent = <div id="eventRoleMaxChart" style={{ width:'100%', height:'100%', marginTop:'20px'}}></div>
    }


    return (
      <div>
        <LoadingOverlay
          active={this.state.isOpened === false}
          spinner>
          <div className="d-flex" style={{ padding: '1em 1em 1em 1em' }}>
            <div className="w-50 text-center">
              <div>Event Types</div>
              <div id="eventTypeChart" style={{ width: '100%', height: '200px', paddingBottom: '0.5em' }}></div>
              <div className="text-right pr-2 pb-1" style={{ cursor: 'pointer' }}
                onClick={(e) => this.setState({ showModalEventType: true })}>
                <FontAwesomeIcon icon={faExpandArrowsAlt} />
              </div>
            </div>
            <div className="w-50 text-center">
              <div>Event Roles</div>
              <div id="eventRoleChart" style={{ width: '100%', height: '200px', paddingBottom: '0.5em' }}></div>
              <div className="text-right pr-2 pb-1" style={{ cursor: 'pointer' }}
                onClick={(e) => this.setState({ showModalEventRole: true })}>
                <FontAwesomeIcon icon={faExpandArrowsAlt} />
              </div>
            </div>
          </div>
          <div className="text-right pr-2 pb-1" style={{ cursor: 'pointer' }}
            onClick={(e) => this.setState({ showModal: true })}>
            View Details ...
        </div>
        </LoadingOverlay>

        <Modal animation centered
          show={isModal}
          onHide={(e) => this.closeModal(e)}
          onEntered={(e) => this.openedModal()}
          onExited={(e) => this.closedModal(e)}
          dialogClassName="events-modal">
          <Modal.Header closeButton>
            <Modal.Title>Events</Modal.Title>
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

export default connect(mapStateToProps, undefined)(withRouter(PanelEvents))

