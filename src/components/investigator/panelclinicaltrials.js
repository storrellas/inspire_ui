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
import { faSpinner, faLongArrowAltUp, faLongArrowAltDown } from '@fortawesome/free-solid-svg-icons'

// Redux
import { connect } from "react-redux";

// Loading Overlay
import LoadingOverlay from 'react-loading-overlay';

// Axios
import axios from 'axios';

// Project Imports
import InspirePagination from '../shared/pagination'
import SearchHeader, { SEARCH_HEADER } from '../shared/searchheader'
import EmptyPanel from '../shared/emptypanel';



// Styles

// Assets

// Project imports

const mapStateToProps = state => {
  return {
    tabClinicalTrialsOpened: state.tabClinicalTrialsOpened,
  };
};

const FILTERING = [
  { 
    dataField: 'brief_public_title', caption: 'name', 
    label: 'Name', type: SEARCH_HEADER.TEXT 
  },
  { 
    dataField: 'prop_conditions', caption: 'condition',  
    label: 'Condition', type: SEARCH_HEADER.TEXT 
  },
  { 
    dataField: 'recruitment_status', caption: 'status', 
    label: 'Status', type: SEARCH_HEADER.TEXT 
  },
  { 
    dataField: 'start_date_year', caption: 'startYear', 
    label: 'Start Year', type: SEARCH_HEADER.NUMBER 
  },
  { 
    dataField: 'end_date_year', caption: 'endYear', 
    label: 'End Year', type: SEARCH_HEADER.NUMBER 
  },
  { 
    dataField: 'prop_study_phases', caption: 'phase', 
    label: 'Phase', type: SEARCH_HEADER.TEXT 
  },
  { 
    dataField: 'study_type', caption: 'studyType', 
    label: 'Study Type', type: SEARCH_HEADER.TEXT 
  },
  { 
    dataField: 'enrollment', caption: 'enrollement', 
    label: 'Enrolment', type: SEARCH_HEADER.TEXT 
  },
  { 
    dataField: 'intervention', caption: 'intervention', 
    label: 'Intervention', type: SEARCH_HEADER.TEXT 
  },
]

class PanelClinicalTrials extends React.Component {

  constructor(props) {
    super(props)
    const filteringList = FILTERING.reduce((acc,curr)=> (acc[curr.caption]='',acc),{});    
    this.state = {
      isOpened: false,
      dataConditions: undefined,
      dataInterventions: undefined,
      dataTable: [],
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

  generateConditions(container) {
    // Create chart instance
    const chart = am4core.create(container, am4charts.PieChart);
    chart.startAngle = -180;
    chart.endAngle = 180;

    // Add data
    chart.data = this.state.dataConditions.sort((a,b) => (a.total > b.total) ? -1 : ((b.total > a.total) ? 1 : 0));
    chart.innerRadius = am4core.percent(60);

    // Add and configure Series
    var pieSeries = chart.series.push(new am4charts.PieSeries());
    const pieSeriesRef = pieSeries;

    pieSeries.labels.template.disabled = true;
    pieSeries.dataFields.value = "total";
    pieSeries.dataFields.category = "name";
    //pieSeries.dataFields.tooltipText = "{category}{value}";
    pieSeries.slices.template.tooltipText = "{category} {value}%";
    pieSeries.hiddenState.properties.endAngle = -90;

    // pieSeries.slices.template.showOnInit = true;
    // pieSeries.slices.template.hiddenState.properties.shiftRadius = 1;

    pieSeries.events.on("ready", ()=>{
      if(pieSeries.slices.length > 0 )
        pieSeriesRef.slices.getIndex(0).showTooltipOn = "always";
      if(pieSeries.slices.length > 1 )
        pieSeriesRef.slices.getIndex(1).showTooltipOn = "always";
      if(pieSeries.slices.length > 2 )
        pieSeriesRef.slices.getIndex(2).showTooltipOn = "always";
    })

    return chart
  }

  generateConditionsChart() {
    this.conditionsChart = this.generateConditions("conditionsChart")
    // this.conditionsChart.legend = new am4charts.Legend();    
    // this.conditionsChart.legend.position = "right"
  }

  generateInterventions(container) {
    // Create chart instance
    const chart = am4core.create(container, am4charts.PieChart);
    chart.startAngle = -180;
    chart.endAngle = 180;

    // Add data
    chart.data = this.state.dataInterventions;
    chart.innerRadius = am4core.percent(60);

    // Add and configure Series
    var pieSeries = chart.series.push(new am4charts.PieSeries());
    const pieSeriesRef = pieSeries;

    pieSeries.labels.template.disabled = true;
    pieSeries.dataFields.value = "total";
    pieSeries.dataFields.category = "intervention__name";
    pieSeries.slices.template.tooltipText = "{category} {value}%";
    pieSeries.hiddenState.properties.endAngle = -90;

    // pieSeries.slices.template.showOnInit = true;
    // pieSeries.slices.template.hiddenState.properties.shiftRadius = 1;

    pieSeries.events.on("ready", ()=>{
      if(pieSeries.slices.length > 0 )
        pieSeriesRef.slices.getIndex(0).showTooltipOn = "always";
      if(pieSeries.slices.length > 1 )
        pieSeriesRef.slices.getIndex(1).showTooltipOn = "always";
      if(pieSeries.slices.length > 2 )
        pieSeriesRef.slices.getIndex(2).showTooltipOn = "always";
    })

    return chart
  }

  generateInterventionsChart() {
    this.interventionsChart = this.generateInterventions("interventionsChart")
    // this.interventionsChart.legend = new am4charts.Legend();    
    // this.interventionsChart.legend.position = "right"
  }


  async retrieveConditions(){
    try{      
      const token = localStorage.getItem('token')

      // Perform request      
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/investigator/${this.investigatorId}/clinical-trials-per-condition/`,
        { headers: { "Authorization": "jwt " + token }
      })
      this.state.dataConditions = response.data.results;      
      this.state.emptyPanelShow = response.data.results.length == 0;

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

  async retrieveInterventions(){
    try{      
      const token = localStorage.getItem('token')
  
      // Perform request
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/investigator/${this.investigatorId}/clinical-trials-per-intervention/`,
        { headers: { "Authorization": "jwt " + token }
      })
      this.state.dataInterventions = response.data.results;

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

  async retrieveCT(page = 1){
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

      const url = `${process.env.REACT_APP_BASE_URL}/api/investigator/${this.investigatorId}/clinical-trials/?${urlParams}`;
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
        isLoading: false
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

  componentDidMount() {
    const { match: { params } } = this.props;
    this.investigatorId = params.subid;
    this.investigatorId = this.investigatorId.split('-')[this.investigatorId.split('-').length -1 ]
    this.investigatorId = parseInt( this.investigatorId )

    this.retrieveConditions()
    this.retrieveInterventions()
    this.retrieveCT()
  }

  navigatePage(page) {
    this.retrieveCT(page)
  }

  retrieveCTFiltered(key, value){
    let { currentPage, filtering } = this.state;
    for(const item_candidate of FILTERING ){
      if( key === item_candidate.caption ){
        filtering[item_candidate.caption] = value
      }
    }

    this.state.filtering = filtering;
    // Clear timeout
    const that = this;
    if ( this.typingTimeout ) {
      clearTimeout(this.typingTimeout);
    }
    this.typingTimeout = 
      setTimeout(function () { that.retrieveCT(currentPage) }, 2000)
  }

  generateModalContent(){

    const { currentPage, totalPage, dataTable, sorting } = this.state;

    return (
    <div className="p-3">

        <table className="w-100 inspire-table" style={{ fontSize: '12px' }}>
          <thead>
            <tr>
              {FILTERING.map((item, id) =>
                <td key={id} style={{ cursor: 'pointer' }}
                onClick={(e) => this.onSetSorting(item.dataField)}>
                  {item.label}
                  <FontAwesomeIcon icon={faLongArrowAltUp} className={sorting == item.dataField ? "ml-1" : "ml-1 d-none"} style={{ color: 'grey' }} />
                  <FontAwesomeIcon icon={faLongArrowAltDown} className={sorting == `-${item.dataField}` ? "ml-1" : "ml-1 d-none"} style={{ color: 'grey' }} />
                </td>                )}
            </tr>
            <tr style={{ border: '1px solid #A4C8E6', borderWidth: '1px 0px 2px 0px' }}>
            {FILTERING.map((item, id) =>
              <td key={id} className="text-center" >
                <SearchHeader 
                  onChange={(pattern) => this.retrieveCTFiltered(item.caption, pattern)} 
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
            {dataTable.map((item, id) =>
              <tr key={id}>
                {FILTERING.map( (header, id ) => 
                  <td key={id}  style={{ width: '20%'}}>{item[header.dataField]}</td>
                )}
              </tr>
            )}
          </tbody>
        </table>

        <InspirePagination currentPage={currentPage} totalPage={totalPage} onClick={this.navigatePage.bind(this)} />

      </div>)
  }

  generateChart() {
    if(this.state.dataTable.length > 0){
      this.generateConditionsChart()
      this.generateInterventionsChart()
    }

    // Set state after timeout
    this.setState({isOpened: true})
  }

  componentWillUnmount() {
    if (this.interventionsChart) {
      this.interventionsChart.dispose();
    }
    if (this.conditionsChart) {
      this.conditionsChart.dispose();
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

    this.retrieveCT(currentPage)
  }

  render() {
    if( this.props.tabClinicalTrialsOpened == true && 
        this.state.isOpened == false &&
        this.state.dataConditions !== undefined &&
        this.state.dataInterventions !== undefined){
      const that = this;
      setTimeout(function(){ that.generateChart() }, 500);
    }

    const modalContent = this.generateModalContent()      
    const emptyPanelShow = this.state.emptyPanelShow && 
                          this.props.tabClinicalTrialsOpened;
    return (
      <div>
        <LoadingOverlay
          active={this.state.isOpened == false}
          spinner>
          <EmptyPanel show={emptyPanelShow} />
          {!emptyPanelShow?
          <>
          <Row style={{ padding: '1em 1em 1em 1em' }}>
            <Col>
              <div>Conditions</div>
              <div id="conditionsChart" style={{ height: '400px', width: '100%' }}></div>
            </Col>
            <Col>
              <div>Interventions</div>
              <div id="interventionsChart" style={{ width: '100%', height: '400px' }}></div>
            </Col>
          </Row>
          <div className="mt-3">
            {modalContent}
          </div>
        </>
        :''}
        </LoadingOverlay>

      </div>);
  }
}

export default connect(mapStateToProps, undefined)(withRouter(PanelClinicalTrials))

