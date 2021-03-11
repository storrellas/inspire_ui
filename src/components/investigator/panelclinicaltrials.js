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
import { faExpandArrowsAlt, faSearch } from '@fortawesome/free-solid-svg-icons'

// Redux
import { connect } from "react-redux";

// Loading Overlay
import LoadingOverlay from 'react-loading-overlay';

// Axios
import axios from 'axios';
import environment from '../../environment.json';

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

class PanelClinicalTrials extends React.Component {

  constructor(props) {
    super(props)
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
  }

  generateConditionsMaxChart() {
    this.conditionsMaxChart = this.generateConditions("conditionsMaxChart")
    this.conditionsMaxChart.legend = new am4charts.Legend();
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
  }

  generateInterventionsMaxChart() {
    this.interventionsMaxChart = this.generateInterventions("interventionsMaxChart")
    this.interventionsMaxChart.legend = new am4charts.Legend();
  }

  async retrieveConditions(){
    try{      
      const token = localStorage.getItem('token')

      // Perform request      
      const response = await axios.get(`${environment.base_url}/api/investigator/${this.investigatorId}/clinical-trials-per-condition/`,
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
      const response = await axios.get(`${environment.base_url}/api/investigator/${this.investigatorId}/clinical-trials-per-intervention/`,
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
      const { take, limit } = this.state;

      // Perform request
      let skip = this.state.take * (page-1);
      let offset = this.state.take * (page-1);
      const urlParams = `limit=${limit}&offset=${offset}&skip=${skip}&take=${take}`
      const url = `${environment.base_url}/api/investigator/${this.investigatorId}/clinical-trials/?${urlParams}`;
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
    console.log("page", page)
  }


  generateModalContent(){

    const headers = [
      "Name", "Condition", "Status", "Start Year", 
      "End Year", "Phase", "Study Type", "Enrolment", "Intervention"
    ]
    const { currentPage, totalPage, dataTable } = this.state;

    return (
    <div className="p-3">
        <LoadingOverlay
          active={this.state.isLoading}
          spinner>
          <table className="w-100" style={{ fontSize: '12px' }}>
            <thead>
              <tr>
                {headers.map((item, id) =>
                  <td key={id} className="text-center">{item}</td>
                )}
              </tr>
              <tr style={{ border: '1px solid grey', borderWidth: '1px 0px 2px 0px' }}>
                {headers.map((item, id) =>
                  <td key={id} >
                    <SearchHeader onChange={(e) => console.log("event", e)} type={SEARCH_HEADER.TEXT} />
                  </td>
                )}
              </tr>
            </thead>
            <tbody>
              {dataTable.map((item, id) =>
                <tr key={id}>
                  <td>{item.brief_public_title}</td>
                  <td>{item.prop_conditions}</td>
                  <td>{item.recruitment_status}</td>
                  <td>{item.start_date_year}</td>
                  <td>{item.end_date_year}</td>
                  <td>{item.prop_study_phases}</td>
                  <td>{item.study_type}</td>
                  <td>{item.enrollment}</td>
                  <td>{item.intervention}</td>
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
      showModalConditions: false, 
      showModalInterventions: false, 
      showModal: false
    })
  }

  closedModal(){
    if (this.interventionsMaxChart) {
      this.interventionsMaxChart.dispose();
    }
    if (this.conditionsMaxChart) {
      this.conditionsMaxChart.dispose();
    }
  }

  openedModal(){
    const {showModal, showModalConditions, showModalInterventions} = this.state;
    if( showModal ){
      // Do nothing      
    }else if( showModalConditions ){
      this.generateConditionsMaxChart()
    }else if( showModalInterventions ){
      this.generateInterventionsMaxChart()
    }
  }

  render() {
    if( this.props.tabClinicalTrialsOpened == true && 
        this.state.isOpened == false &&
        this.state.dataConditions !== undefined &&
        this.state.dataInterventions !== undefined){
      const that = this;
      setTimeout(function(){ that.generateChart() }, 500);
    }

    const {showModal, showModalConditions, showModalInterventions} = this.state;
    const isModal = showModal || showModalConditions || showModalInterventions;
    let modalContent = <div>Unknown</div>
    if( showModal ){
      modalContent = this.generateModalContent()      
    }else if( showModalConditions ){      
      modalContent = <div id="conditionsMaxChart" style={{ width:'100%', height:'100%', marginTop:'20px'}}></div>
    }else if( showModalInterventions ){
      modalContent = <div id="interventionsMaxChart" style={{ width:'100%', height:'100%', marginTop:'20px'}}></div>
    }


    return (
      <div>
        <LoadingOverlay
          active={this.state.isOpened == false}
          spinner>
          <div className="d-flex" style={{ padding: '1em 1em 1em 1em' }}>
            <div className="w-50 text-center">
              <div>Conditions</div>
              <div id="conditionsChart" style={{ height: '200px', width: '100%' }}></div>
              <div className="text-right pr-2 pb-1" style={{ cursor: 'pointer' }}
                onClick={(e) => this.setState({ showModalConditions: true })}>
                <FontAwesomeIcon icon={faExpandArrowsAlt} />
              </div>
            </div>
            <div className="w-50 text-center">
              <div>Interventions</div>
              <div id="interventionsChart" style={{ width: '100%', height: '200px' }}></div>
              <div className="text-right pr-2 pb-1" style={{ cursor: 'pointer' }}
                onClick={(e) => this.setState({ showModalInterventions: true })}>
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

