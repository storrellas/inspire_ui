import React from 'react';
// Bootstrap
import { Modal, Button } from 'react-bootstrap';

// React Router
import { withRouter } from 'react-router-dom'

// am4charts
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

// Themes begin
am4core.useTheme(am4themes_animated);

// Styles

// Assets

// Project imports

const mapStateToProps = state => {
  return { 
    tabPublicationsOpened: state.tabPublicationsOpened,
    };
};


class PanelPublications extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      isOpened: false,
      showModalPublicationType: false,
      showModalPublicationYears: false,
      showModal: false,
      dataType: undefined,
      dataYears: undefined,
    }
  }

  generatePublicationType(container) {
    // Create chart instance
    let chart = am4core.create(container, am4charts.PieChart);

    // Add data
    //chart.data = publicationTypes;
    chart.data = this.state.dataType;
    chart.innerRadius = am4core.percent(60);

    // Add and configure Series
    var pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.labels.template.disabled = true;
    pieSeries.dataFields.value = "total";
    pieSeries.dataFields.category = "name";
    pieSeries.dataFields.tooltipText = "{category}{value}";
  
    chart.hiddenState.properties.radius = am4core.percent(0);

    return chart;
  }

  generatePublicationTypeChart() {
    this.publicationTypeChart = this.generatePublicationType("publicationTypeChart")
  }

  generatePublicationTypeMaxChart() {
    this.publicationTypeMaxChart = this.generatePublicationType("publicationTypeMaxChart")
    this.publicationTypeMaxChart.legend = new am4charts.Legend();
  }

  generatePublicationYears(container) {
    // Create chart instance
    let chart = am4core.create(container, am4charts.XYChart);

    // Add data
    chart.data = this.state.dataYears;

    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "publication_year";
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    // Create series
    let series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = "value";
    series.dataFields.dateX = "date";
    series.tooltipText = "{value}"
    series.strokeWidth = 2;
    series.minBulletDistance = 15;
    series.dataFields.valueY = "total";
    series.dataFields.categoryX = "publication_year";


    return chart;
  }

  generatePublicationYearsChart() {
    this.publicationYearsChart = this.generatePublicationYears("publicationYearsChart")
  }

  generatePublicationYearsMaxChart() {
    this.publicationYearsMaxChart = this.generatePublicationYears("publicationYearsMaxChart")
    this.publicationYearsMaxChart.legend = new am4charts.Legend();
  }

  generateModalContent(){
    const headers = [
      "Name", "Year", "Position", "Type"
    ]

    const item = {
      position: 'Head of',
      name: 'Predictive value of the Essen Stroke Risk Score and Ankle Brachial Index in acute ischaemic stroke patients from 85 German stroke units.',
      year: '2008',
      position: 'Coauthor',
      type: 'Journal Article',
    }
    const data = Array(10).fill(item);

    return (
    <div className="p-3">
      <table className="w-100">
        <thead>
          <tr>
            <td className="text-center">WebLink</td>
            {headers.map((item, id) =>
              <td key={id} className="text-center">{item}</td>
            )}
          </tr>
          <tr style={{ border: '1px solid grey', borderWidth: '1px 0px 2px 0px' }}>
            <td></td>
            {headers.map((item, id) =>
              <td key={id}><FontAwesomeIcon icon={faSearch} style={{ fontSize: '1em', color: 'grey' }} /></td>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((item, id) =>
            <tr key={id}>
              <td><img src="https://demo.explicatos.com/img/Internet.png" style={{ height:'25px' }}></img></td>
              <td>{item.name}</td>
              <td>{item.year}</td>
              <td>{item.position}</td>
              <td>{item.type}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>)
  }

  generateChart(){
    this.generatePublicationTypeChart()
    this.generatePublicationYearsChart()

    // Set state after timeout
    this.setState({isOpened: true})
  }

  async retrievePublicationType(){    
    try{
      const token = localStorage.getItem('token')
  
      const { match: { params } } = this.props;
      let investigatorId = params.subid;
      investigatorId = investigatorId.split('-')[investigatorId.split('-').length -1 ]
      investigatorId = parseInt( investigatorId )

      // Perform request
      const response = await axios.get(`${environment.base_url}/api/investigator/${investigatorId}/publications-per-type/`,
        { headers: { "Authorization": "jwt " + token }
      })
      this.state.dataType = response.data.results;

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

  async retrievePublicationYears(){
    try{      
      const token = localStorage.getItem('token')
  
      const { match: { params } } = this.props;
      let investigatorId = params.subid;
      investigatorId = investigatorId.split('-')[investigatorId.split('-').length -1 ]
      investigatorId = parseInt( investigatorId )

      // Perform request
      const response = await axios.get(`${environment.base_url}/api/investigator/${investigatorId}/publications-per-year/`,
        { headers: { "Authorization": "jwt " + token }
      })
      this.state.dataYears = response.data.results;

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
    this.retrievePublicationType()
    this.retrievePublicationYears()
  }

  componentWillUnmount() {
    if (this.publicationYearsChart) {
      this.publicationYearsChart.dispose();
    }
    if (this.publicationTypeChart) {
      this.publicationTypeChart.dispose();
    }
    if (this.publicationYearsMaxChart) {
      this.publicationYearsMaxChart.dispose();
    }
    if (this.publicationTypeMaxChart) {
      this.publicationTypeMaxChart.dispose();
    }
  }

  closeModal(){
    this.setState({ 
      showModalPublicationType: false, 
      showModalPublicationYears: false, 
      showModal: false
    })
  }


  openedModal(){
    const {showModal, showModalPublicationType, showModalPublicationYears} = this.state;

    if( showModal ){
      // Do nothing      
    }else if( showModalPublicationType ){
      this.generatePublicationTypeMaxChart()
    }else if( showModalPublicationYears ){
      this.generatePublicationYearsMaxChart()
    }
  }

  closedModal(){
    if (this.publicationYearsMaxChart) {
      this.publicationYearsMaxChart.dispose();
    }
    if (this.publicationTypeMaxChart) {
      this.publicationTypeMaxChart.dispose();
    }
  }

  render() {
    if( this.props.tabPublicationsOpened == true && 
        this.state.isOpened == false &&
        this.state.dataType !== undefined &&
        this.state.dataYears !== undefined){
      const that = this;
      setTimeout(function(){ that.generateChart() }, 500);
    }
      
    const { showModal, showModalPublicationType, showModalPublicationYears } = this.state;
    const isModal = showModal || showModalPublicationType || showModalPublicationYears;
    let modalContent = <div>Unknown</div>
    if( showModal ){
      modalContent = this.generateModalContent()      
    }else if( showModalPublicationType ){
      modalContent = <div id="publicationTypeMaxChart" style={{ width:'100%', height:'100%', marginTop:'20px'}}></div>
    }else if( showModalPublicationYears ){
      modalContent = <div id="publicationYearsMaxChart" style={{ width:'100%', height:'100%', marginTop:'20px'}}></div>
    }

    return (
      <div>
        <LoadingOverlay
          active={this.state.isOpened == false}
          spinner>
          <div className="d-flex" style={{ padding: '1em 1em 1em 1em' }}>
            <div className="w-50 text-center">
              <div>Publication Types</div>
              <div id="publicationTypeChart" style={{ width: '100%', height: '200px', marginTop: '20px' }}></div>
              <div className="text-right pr-2 pb-1" style={{ cursor: 'pointer' }}
                onClick={(e) => this.setState({ showModalPublicationType: true })}>
                <FontAwesomeIcon icon={faExpandArrowsAlt} />
              </div>
            </div>
            <div className="w-50 text-center">
              <div>Publication Years</div>
              <div id="publicationYearsChart" style={{ width: '100%', height: '200px', marginTop: '20px' }}></div>
              <div className="text-right pr-2 pb-1" style={{ cursor: 'pointer' }}
                onClick={(e) => this.setState({ showModalPublicationYears: true })}>
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
          dialogClassName="publications-modal">
          <Modal.Header closeButton>
            <Modal.Title>Publications</Modal.Title>
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

export default connect(mapStateToProps, undefined)(withRouter(PanelPublications))

