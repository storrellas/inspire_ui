import React from 'react';
// Bootstrap
import { Modal, Button, Row, Col } from 'react-bootstrap';
// React Router
import { withRouter } from 'react-router-dom'

// am4Charts
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner, faLongArrowAltUp, faLongArrowAltDown, faCaretRight, faAngleLeft, faAngleDown } from '@fortawesome/free-solid-svg-icons'

// EllipsisWithTooltip
import EllipsisWithTooltip from 'react-ellipsis-with-tooltip'


// Redux
import { PANEL } from "../../redux";
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
import EmptyPanel from '../shared/emptypanel';


const mapStateToProps = state => {
  return {
    tabEventsOpened: state.tabEventsOpened,
    tabActive: state.tabActive,    
  };
};

const DATA_FIELD_LIST = [
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
    this.dataFieldList = window.mobile?DATA_FIELD_LIST.slice(0,2):DATA_FIELD_LIST;
    const filteringList = this.dataFieldList.reduce((acc,curr)=> (acc[curr.caption]='',acc),{});    
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
      sorting: '',
      emptyPanelShow: false
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

    pieSeries.labels.template.disabled = true;
    pieSeries.dataFields.value = "total";
    pieSeries.dataFields.category = "name";
    pieSeries.slices.template.tooltipText = "{category} {value}%";
    pieSeries.hiddenState.properties.endAngle = -90;

    pieSeries.events.on("ready", ()=>{
      if(pieSeries.slices.length > 0 )
        pieSeriesRef.slices.getIndex(0).showTooltipOn = "always";
      if(pieSeries.slices.length > 1 )
        pieSeriesRef.slices.getIndex(1).showTooltipOn = "always";
      if(pieSeries.slices.length > 2 )
        pieSeriesRef.slices.getIndex(2).showTooltipOn = "always";
    })

    return chart;
  }

  generateEventTypeChart() {
    this.eventTypeChart = this.generateEventType("eventTypeChart")
    // this.eventTypeChart.legend = new am4charts.Legend();    
    // this.eventTypeChart.legend.position = "right"
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
    this.eventRoleChart.legend.position = window.mobile?"bottom":"right"
  }

  onClickedTableDetail(id){    
    let { dataTable } = this.state;    
    const target = !dataTable[id].show
    dataTable = dataTable.map( item => { return {...item, show: false} })
    dataTable[id].show = target;
    this.setState({ dataTable: dataTable })
  }

  generateTable(){
    const { currentPage, totalPage, sorting } = this.state;

    return (
    <div className="p-3 h-100" style={{ fontSize:'14px'}}>


      <table className="w-100 inspire-table">
        <thead>
          <tr>
            <td></td>
            {this.dataFieldList.map((item, id) =>
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
              {this.dataFieldList.map((item, id) =>
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
            <tr key={id+"_"} className="inspire-table-subrow">
              <td colSpan="7" className={item.show?'':'d-none'}>
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

  onExpandRow(id){
    const { dataTable } = this.state;
    // Keep former value
    let former = dataTable[id].show
    dataTable.map( x => x.show = false)

    // Expand    
    dataTable[id].show = !former;

    // Set State
    this.setState({ dataTable })
  }

  generateTableMobile(){
    const { currentPage, totalPage, sorting } = this.state;

    return (
    <div className="p-3 h-100" style={{ fontSize:'14px'}}>


      <table className="w-100 inspire-mobile-table">
        <thead>
          <tr>
            {this.dataFieldList.map((item, id) =>
              <td key={id} style={{ cursor: 'pointer' }}
                onClick={(e) => this.onSetSorting(item.dataField)}>
                {item.label}
                <FontAwesomeIcon icon={faLongArrowAltUp} className={sorting == item.dataField ? "ml-1" : "ml-1 d-none"} style={{ color: 'grey' }} />
                <FontAwesomeIcon icon={faLongArrowAltDown} className={sorting == `-${item.dataField}` ? "ml-1" : "ml-1 d-none"} style={{ color: 'grey' }} />
              </td>
              )}
          </tr>
          <tr style={{ border: '1px solid #A4C8E6', borderWidth: '1px 0px 2px 0px' }}>
            
              {this.dataFieldList.map((item, id) =>
                <td key={id}>
                  <SearchHeader 
                    onChange={(pattern) => this.retrieveEventsFiltered(item.caption, pattern)} 
                    type={item.type} />
                </td>
              )}
              <td></td>
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
            <React.Fragment key={id}>
            <tr>
              <td  className="text-justify" style={{ width: '45%'}}>
                {item.name}
              </td>
              <td  className="text-center" style={{ width: '10%'}}>{item.position}</td>
              <td className={item.enabled?"inspire-table-profile-mobile":'d-none'}>
                <FontAwesomeIcon icon={faAngleDown} className={item.show ? 'unfolded' : "folded"}
                  style={{ fontSize: '14px', color: 'grey' }}
                  onClick={e => this.onExpandRow(id)} />
              </td>
            </tr>
            <tr className="inspire-table-subrow">
              <td colSpan="7" className={item.show?'':'d-none'}>
              <AnimateHeight
                height={ item.show?'auto':0}
                duration={250}>
                <div className="p-2" style={{ background: '#ECEFF8'}}>
                  <div className="expand-title">TALKS</div>
                  <div className="expand-value">{item.talks}</div>
                  <div className="expand-title">SESSIONS</div>
                  <div className="expand-value">{item.sessions}</div>
                  <div className="expand-title">POSTERS</div>
                  <div className="expand-value">{item.posters}</div>
                </div>
                </AnimateHeight>
              </td>
            </tr>
            </React.Fragment>
            
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
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/investigator/${this.investigatorId}/events-per-type/`,
        { headers: { "Authorization": "jwt " + token }
      })
      this.state.dataTypes = response.data.results;

    }catch(error){
      console.log("FAILED")
    }
  }

  async retrieveEventPosition(){
    try{      
      const token = localStorage.getItem('token')
  
      // Perform request
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/investigator/${this.investigatorId}/events-per-position/`,
        { headers: { "Authorization": "jwt " + token }
      })
      this.state.dataRoles = response.data.results;
      this.state.emptyPanelShow = response.data.results.length == 0;

      // Process Data
      const dataRoles = {"state": "event"}
      for(const item of response.data.results){
        dataRoles[ item['position__name'] ] = item['total']
      }
      this.state.dataRoles = [dataRoles];
    
    }catch(error){
      console.log("FAILED")
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
        for(const item of this.dataFieldList ){
          if( filtering[item.caption] !== '' ){
            urlParams = `${urlParams}&${item.dataField}=${filtering[item.caption]}`;
          }
        }      
      }

      // Add sorting
      if( sorting !== ''){
        urlParams = `${urlParams}&ordering=${sorting}`;
      }

      const url = `${process.env.REACT_APP_API_URL}/api/investigator/${this.investigatorId}/events/?${urlParams}`;
      const response = await axios.get(url,
        { headers: { "Authorization": "jwt " + token }
      })

      let dataTable = response.data.results
      dataTable.map( x => x.show = false)
      dataTable.map( x => x.enabled = true)           
      if(dataTable.length < take){
        const filteringList = this.dataFieldList.reduce((acc,curr)=> (acc[curr.caption]='',acc),{});    
        const fill = new Array(take - response.data.results.length).fill(filteringList)
        fill.map( x => x.enabled = false)
        dataTable.push(...fill)
      }

      // Set State
      const totalPage = Math.ceil(response.data.count / take);      
      this.setState({
        dataTable: dataTable, 
        currentPage: page,
        totalPage: totalPage,
        isLoading: false
      })

    }catch(error){
      console.log("FAILED")
    }
  }

  retrieveEventsFiltered(key, value){
    let { currentPage, filtering } = this.state;
    for(const candidate_item of this.dataFieldList ){
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
    if(this.state.dataTable.length > 0){
      this.generateEventTypeChart()
      this.generateEventRoleChart()
    }

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
    if (this.props.tabActive == PANEL.EVENTS && 
        this.state.isOpened == false &&
        this.state.dataRoles !== undefined &&
        this.state.dataTypes !== undefined) {
      const that = this;
      setTimeout(function () { that.generateChart() }, 500);
    }

    const emptyPanelShow = this.state.emptyPanelShow && 
                            this.props.tabActive == PANEL.EVENTS;

    return (
      <div>
        <EmptyPanel show={emptyPanelShow} />

        <LoadingOverlay
          active={this.state.isOpened === false}
          spinner>
          {!emptyPanelShow?
          <>
            <Row style={{ padding: '1em 1em 1em 1em' }}>
              <Col sm={6}>
                <div>Event Types</div>
                <div id="eventTypeChart" style={{ width: '100%', height: '300px'}}></div>
              </Col>
              <Col sm={6}>
                <div>Event Roles</div>
                <div id="eventRoleChart" style={{ width: '100%', height: '300px'}}></div>
              </Col>
            </Row>


            <div className={this.state.showTableSideModal ? "inspire-sidemodal-wrapper toggled" : "inspire-sidemodal-wrapper"}>
              <div className="p-3">
                <div style={{ fontSize: '20px' }}
                  onClick={e => this.setState({ showTableSideModal: false })}>
                  <FontAwesomeIcon icon={faAngleLeft} />
                </div>
                <div className="mt-3" style={{ fontSize: '20px' }}>
                  <b>Events</b>
                </div>
                <div className="mt-3">
                  {this.generateTableMobile()}
                </div>
              </div>
            </div>

            {window.mobile?
            <div className="p-3 text-right" style={{ pointer: 'cursor'}}
              onClick={ e =>  this.setState({ showTableSideModal: true })}>
              View Details ...
            </div>
            :
            <div className="mt-3">{this.generateTable()}</div>
            }
          


          </>
        :''}
        </LoadingOverlay>


      </div>);
  }
}

export default connect(mapStateToProps, undefined)(withRouter(PanelEvents))

