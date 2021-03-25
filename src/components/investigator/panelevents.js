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
import { faSpinner, faLongArrowAltUp, faLongArrowAltDown, faCaretRight } from '@fortawesome/free-solid-svg-icons'

// EllipsisWithTooltip
import EllipsisWithTooltip from 'react-ellipsis-with-tooltip'


// Redux
import { connect } from "react-redux";

// Loading Overlay
import LoadingOverlay from 'react-loading-overlay';

import './panelevents.scss';

// Animate Height
import AnimateHeight from 'react-animate-height';

// Axios
import axios from 'axios';

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

const FILTERING = [
  { 
    dataField:'name', caption: 'name', 
    label: 'Name', type: SEARCH_HEADER.TEXT 
  },
  { 
    dataField:'position', caption: 'position', 
    label: 'Position', type: SEARCH_HEADER.TEXT
  },
  { 
    dataField:'event_subtype', caption: 'subtype', 
    label: 'Subtype', type: SEARCH_HEADER.TEXT
  },
  { 
    dataField:'start_date_year', caption: 'year', 
    label: 'Year', type: SEARCH_HEADER.NUMBER
  },
  { 
    dataField:'city', caption: 'city', 
    label: 'City', type: SEARCH_HEADER.TEXT
  },
  { 
    dataField:'country', caption: 'country', 
    label: 'Country', type: SEARCH_HEADER.TEXT
  },
]

class PanelEvents extends React.Component {

  constructor(props) {
    super(props)
    const filteringList = FILTERING.reduce((acc,curr)=> (acc[curr.caption]='',acc),{});    
    this.state = {
      isOpened: false,
      showModal: false,
      dataTable: [],
      dataTypes: undefined,
      dataRoles: undefined,
      currentPage: 1,
      totalPage: 10,
      take: 10,
      limit: 10,
      isLoading: false,
      filtering : {...filteringList},
      sorting: ''
    }    
  }

  generateEventType(container){
    // Create chart instance
    const chart = am4core.create(container, am4charts.PieChart);
    chart.startAngle = -180;
    chart.endAngle = 180;

    // Add data
    chart.data = this.state.dataTypes.sort((a,b) => (a.total > b.total) ? -1 : ((b.total > a.total) ? 1 : 0));
    chart.innerRadius = am4core.percent(60);

    // Add and configure Series
    const pieSeries = chart.series.push(new am4charts.PieSeries());
    const pieSeriesRef = pieSeries;

    // console.log("-- pieSeries ", this.pieSeries)
    console.log("pieSeries ", pieSeries.slices)
    // console.log("pieSeries ", this.pieSeries.slices.getIndex(1))
    // console.log("pieSeries ", this.pieSeries.slices.length)

    pieSeries.labels.template.disabled = true;
    pieSeries.dataFields.value = "total";
    pieSeries.dataFields.category = "name";
    pieSeries.slices.template.tooltipText = "{category} {value}%";
    pieSeries.hiddenState.properties.endAngle = -90;

    pieSeries.events.on("ready", ()=>{
      pieSeriesRef.slices.getIndex(0).showTooltipOn = "always";
      pieSeriesRef.slices.getIndex(1).showTooltipOn = "always";
      pieSeriesRef.slices.getIndex(2).showTooltipOn = "always";
    })

    return chart;
  }

  generateEventTypeChart() {
    this.eventTypeChart = this.generateEventType("eventTypeChart")
    this.eventTypeChart.legend = new am4charts.Legend();    
    this.eventTypeChart.legend.position = "right"
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
    this.eventRoleChart.legend = new am4charts.Legend();    
    this.eventRoleChart.legend.position = "right"
  }

  onClickedTableDetail(id){    
    let { dataTable } = this.state;    
    const target = !dataTable[id].show
    dataTable = dataTable.map( item => { return {...item, show: false} })
    dataTable[id].show = target;
    this.setState({ dataTable: dataTable })
  }

  generateModalContent(){
    const { currentPage, totalPage, sorting } = this.state;

    return (
    <div className="p-3 h-100" style={{ fontSize:'14px'}}>


      <table className="w-100 inspire-table" style={{ fontSize: '12px'}}>
        <thead>
          <tr>
            <td></td>
            {FILTERING.map((item, id) =>
              <td key={id} style={{ cursor: 'pointer' }}
                onClick={(e) => this.onSetSorting(item.dataField)}>
                {item.label}
                <FontAwesomeIcon icon={faLongArrowAltUp} className={sorting == item.dataField ? "ml-1" : "ml-1 d-none"} style={{ color: 'grey' }} />
                <FontAwesomeIcon icon={faLongArrowAltDown} className={sorting == `-${item.dataField}` ? "ml-1" : "ml-1 d-none"} style={{ color: 'grey' }} />
              </td>
              )}
          </tr>
          <tr style={{ border: '1px solid #A4C8E6', borderWidth: '1px 0px 2px 0px' }}>
            <td></td>
              {FILTERING.map((item, id) =>
                <td key={id}>
                  <SearchHeader 
                    onChange={(pattern) => this.retrieveEventsFiltered(item.caption, pattern)} 
                    type={item.type} />
                </td>
              )}
          </tr>
        </thead>
        <tbody>
        {this.state.isLoading?
          <>
          <tr>
            <td></td>
            <td rowSpan="10" style={{ background: 'white', height: '400px' }} colSpan="14" className="text-center">
              <div className="mb-3" style={{ fontSize: '20px', color: 'grey' }} >Loading ...</div>
              <FontAwesomeIcon icon={faSpinner}  spin style={{ fontSize: '40px', color: 'grey' }} />                    
            </td>
          </tr>
          <tr><td></td></tr>
          <tr><td></td></tr>
          <tr><td></td></tr>
          <tr><td></td></tr>
          <tr><td></td></tr>
          <tr><td></td></tr>
          <tr><td></td></tr>
          <tr><td></td></tr>
          <tr><td></td></tr>
          </>
          :<tr></tr>}
          {this.state.dataTable.map((item, id) =>
            [
            <tr key={id}>
              <td className="text-center" style={{ width: '5%'}}>
                {item.position!== ''?
                <FontAwesomeIcon className={item.show?'table-caret active':'table-caret'} icon={faCaretRight} 
                  style={{ fontSize: '1em', color: 'grey', cursor:'pointer' }} 
                  onClick={(e) => this.onClickedTableDetail(id)} />
                  :''}
              </td>
              <td  className="text-left" style={{ width: '45%'}}>
                <EllipsisWithTooltip placement="bottom" style={{ width: '500px'}}>
                {item.name || ''}
                </EllipsisWithTooltip>
              </td>
              <td  className="text-center" style={{ width: '10%'}}>{item.position}</td>
              <td  className="text-center" style={{ width: '10%'}}>{item.event_subtype}</td>
              <td  className="text-center" style={{ width: '5%'}}>{item.start_date_year}</td>
              <td  className="text-center" style={{ width: '15%'}}>{item.city}</td>              
              <td  className="text-center" style={{ width: '15%'}}>{item.country}</td>
            </tr>,
            <tr key={id+"_"}>
              <td colSpan="7">
              <AnimateHeight
                id="example-panel"
                height={ item.show?'auto':0}
                duration={250}>
                <div className="text-left" style={{ border: '1px solid #A4C8E6', borderWidth: '1px 0px 1px 0px', 
                              padding: '0.5em', paddingLeft: '2em', backgroundColor: '#F2F7FB'}}>
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

      <InspirePagination currentPage={currentPage} totalPage={totalPage} onClick={this.navigatePage.bind(this)}/>
    </div>)
  }

  async retrieveEventTypes(){
    try{      
      const token = localStorage.getItem('token')


      // Perform request
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/investigator/${this.investigatorId}/events-per-type/`,
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
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/investigator/${this.investigatorId}/events-per-position/`,
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
      this.setState({isLoading: true, dataTable: []})

      const token = localStorage.getItem('token')
      const { take, limit, filtering, sorting } = this.state;

      // Perform request
      let skip = this.state.take * (page-1);
      let offset = this.state.take * (page-1);
      let urlParams = `limit=${limit}&offset=${offset}&skip=${skip}&take=${take}`

      // Add filtering
      if( filtering !== undefined ){
        for(const item of FILTERING ){
          if( filtering[item.caption] !== '' ){
            urlParams = `${urlParams}&${item.dataField}=${filtering[item.caption]}`;
          }
        }      
      }

      // Add sorting
      if( sorting !== ''){
        urlParams = `${urlParams}&ordering=${sorting}`;
      }

      const url = `${process.env.REACT_APP_BASE_URL}/api/investigator/${this.investigatorId}/events/?${urlParams}`;
      const response = await axios.get(url,
        { headers: { "Authorization": "jwt " + token }
      })

      let dataTable = response.data.results
      if(response.data.results.length < take){
        const filteringList = FILTERING.reduce((acc,curr)=> (acc[curr.caption]='',acc),{});    
        const fill = new Array(take - response.data.results.length).fill(filteringList)
        dataTable.push(...fill)
      }

      // Set State
      const totalPage = Math.ceil(response.data.count / take);      
      this.setState({
        dataTable: dataTable, 
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

  retrieveEventsFiltered(key, value){
    let { currentPage, filtering } = this.state;
    for(const candidate_item of FILTERING ){
      if( key === candidate_item.caption ){
        filtering[candidate_item.caption] = value
      }
    }

    this.state.filtering = filtering;
    // Clear timeout
    const that = this;
    if ( this.typingTimeout ) {
      clearTimeout(this.typingTimeout);
    }
    this.typingTimeout = 
      setTimeout(function () { that.retrieveEvents(currentPage) }, 2000)

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
      showModal: false
    })
  }

  navigatePage(page) {
    this.retrieveEvents(page)
  }

  openedModal(){}

  closedModal(){
    if (this.eventTypeMaxChart) {
      this.eventTypeMaxChart.dispose();
    }
    if (this.eventRoleMaxChart) {
      this.eventRoleMaxChart.dispose();
    }
  }

  onSetSorting(field){
    let { currentPage, sorting } = this.state;
    let target = '';
    if( sorting == '' || sorting.includes(field) == false){
      target = field
    }else if( sorting === field ){
     target =  `-${field}`
    }
    this.state.sorting = target;

    this.retrieveEvents(currentPage)
  }

  render() {
    if (this.props.tabEventsOpened == true && 
        this.state.isOpened == false &&
        this.state.dataRoles !== undefined &&
        this.state.dataTypes !== undefined) {
      const that = this;
      setTimeout(function () { that.generateChart() }, 500);
    }

    const { showModal } = this.state;
    let modalContent = <div>Unknown</div>
    if( showModal ){
      modalContent = this.generateModalContent()     
    }


    return (
      <div>
        <LoadingOverlay
          active={this.state.isOpened === false}
          spinner>
          <div style={{ padding: '1em 1em 1em 1em' }}>
            <div>
              <div>Event Types</div>
              <div id="eventTypeChart" style={{ width: '100%', height: '400px', padding: '1em 15% 1em 15%' }}></div>
            </div>
            <div className="mt-3">
              <div>Event Roles</div>
              <div id="eventRoleChart" style={{ width: '100%', height: '400px', padding: '1em 20% 1em 20%' }}></div>
            </div>
          </div>
          <div className="text-right pr-2 pb-1" style={{ cursor: 'pointer' }}
            onClick={(e) => this.setState({ showModal: true })}>
            View Details ...
        </div>
        </LoadingOverlay>

        <Modal animation centered
          show={showModal}
          onHide={(e) => this.closeModal(e)}
          onEntered={(e) => this.openedModal()}
          onExited={(e) => this.closedModal(e)}
          dialogClassName="events-modal">
          <Modal.Header closeButton>
            <Modal.Title>Events</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ overflowY: 'scroll', height: '100%'}}>
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

