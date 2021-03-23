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
import { faExpandArrowsAlt, faLongArrowAltUp, faLongArrowAltDown } from '@fortawesome/free-solid-svg-icons'

// Redux
import { connect } from "react-redux";

// Loading Overlay
import LoadingOverlay from 'react-loading-overlay';

// Axios
import axios from 'axios';

// Project Imports
import InspirePagination from '../shared/pagination'
import SearchHeader, { SEARCH_HEADER } from '../shared/searchheader'

// Themes begin
am4core.useTheme(am4themes_animated);

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
      showModalConditions: false, 
      showModalInterventions: false, 
      showModal: false,
      dataConditions: undefined,
      dataInterventions: undefined,
      dataTable: [],
      currentPage: 1,
      totalPage: 10,
      take: 10,
      limit: 10,
      isLoading: false,
      filtering : {...filteringList},
      sorting: ''
    }
  }

  generateConditions(container) {
    // Create chart instance
    const chart = am4core.create(container, am4charts.PieChart);

    // Add data
    chart.data = this.state.dataConditions;
    chart.innerRadius = am4core.percent(60);

    // Add and configure Series
    var pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.labels.template.disabled = true;
    pieSeries.dataFields.value = "total";
    pieSeries.dataFields.category = "name";
    pieSeries.dataFields.tooltipText = "{category}{value}";

    
    pieSeries.slices.template.showOnInit = true;
    pieSeries.slices.template.hiddenState.properties.shiftRadius = 1;

    return chart
  }

  generateConditionsChart() {
    this.conditionsChart = this.generateConditions("conditionsChart")
    this.conditionsChart.legend = new am4charts.Legend();    
    this.conditionsChart.legend.position = "right"
  }

  generateInterventions(container) {
    // Create chart instance
    const chart = am4core.create(container, am4charts.PieChart);

    // Add data
    chart.data = this.state.dataInterventions;
    chart.innerRadius = am4core.percent(60);

    // Add and configure Series
    var pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.labels.template.disabled = true;
    pieSeries.dataFields.value = "total";
    pieSeries.dataFields.category = "intervention__name";
    pieSeries.dataFields.tooltipText = "{category}{intervention__name}";

    pieSeries.slices.template.showOnInit = true;
    pieSeries.slices.template.hiddenState.properties.shiftRadius = 1;

    return chart
  }

  generateInterventionsChart() {
    this.interventionsChart = this.generateInterventions("interventionsChart")
    this.interventionsChart.legend = new am4charts.Legend();    
    this.interventionsChart.legend.position = "right"
  }


  async retrieveConditions(){
    try{      
      const token = localStorage.getItem('token')

      // Perform request      
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/investigator/${this.investigatorId}/clinical-trials-per-condition/`,
        { headers: { "Authorization": "jwt " + token }
      })
      this.state.dataConditions = response.data.results;


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
      this.setState({isLoading: true})

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
        <LoadingOverlay
          active={this.state.isLoading}
          spinner>
          <table className="w-100 inspire-table" style={{ fontSize: '12px' }}>
            <thead>
              <tr>
                {FILTERING.map((item, id) =>
                  <td key={id} className="text-center" style={{ cursor: 'pointer' }}
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
              {dataTable.map((item, id) =>
                <tr key={id}>
                  {FILTERING.map( (header, id ) => 
                    <td key={id}  className="text-center" style={{ width: '20%'}}>{item[header.dataField]}</td>
                  )}
                </tr>
              )}
            </tbody>
          </table>
        </LoadingOverlay>
        <InspirePagination currentPage={currentPage} totalPage={totalPage} onClick={this.navigatePage.bind(this)} />

      </div>)
  }

  generateChart() {
    this.generateConditionsChart()
    this.generateInterventionsChart()

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

  closeModal(){
    this.setState({ 
      showModal: false
    })
  }

  closedModal(){
  }

  openedModal(){
    const {showModal} = this.state;
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

    const {showModal} = this.state;
    let modalContent = <div>Unknown</div>
    if( showModal ){
      modalContent = this.generateModalContent()      
    }

    return (
      <div>
        <LoadingOverlay
          active={this.state.isOpened == false}
          spinner>
          <div style={{ padding: '1em 1em 1em 1em' }}>
            <div>
              <div>Conditions</div>
              <div id="conditionsChart" style={{ height: '400px', width: '100%' }}></div>
            </div>
            <div>
              <div>Interventions</div>
              <div id="interventionsChart" style={{ width: '100%', height: '400px' }}></div>
            </div>
          </div>
          <div className="text-right pr-2 pb-1" style={{ cursor: 'pointer' }} 
                  onClick={(e) => this.setState({ showModal: true})}>
          View Details ...
        </div>
        </LoadingOverlay>


        <Modal animation centered
          show={showModal}
          onHide={(e) => this.closeModal(e)}
          onEntered={(e) => this.openedModal()}
          onExited={(e) => this.closedModal(e)}
          dialogClassName="clinical-trials-modal">
          <Modal.Header closeButton>
            <Modal.Title>Clinical Trials</Modal.Title>
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

export default connect(mapStateToProps, undefined)(withRouter(PanelClinicalTrials))

