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
import { faExpandArrowsAlt, faLongArrowAltUp, faLongArrowAltDown, faSpinner } from '@fortawesome/free-solid-svg-icons'

// Redux
import { connect } from "react-redux";

// Loading Overlay
import LoadingOverlay from 'react-loading-overlay';

// EllipsisWithTooltip
import EllipsisWithTooltip from 'react-ellipsis-with-tooltip'

// Axios
import axios from 'axios';

// Project Imports
import InspirePagination from '../shared/pagination'
import SearchHeader, { SEARCH_HEADER } from '../shared/searchheader'

// Themes begin
am4core.useTheme(am4themes_animated);

// Styles

// Assets

const FILTERING = [
  { 
    dataField:'name', caption: 'name', 
    label: 'Name', type: SEARCH_HEADER.TEXT 
  },
  { 
    dataField:'publication_year', caption: 'year', 
    label: 'Year', type: SEARCH_HEADER.TEXT
  },
  { 
    dataField:'position', caption: 'position',  
    label: 'Position', type: SEARCH_HEADER.NUMBER
  },
  { 
    dataField:'publication_subtype', caption: 'type', 
    label: 'Type', type: SEARCH_HEADER.TEXT
  }
]

const mapStateToProps = state => {
  return {
    tabPublicationsOpened: state.tabPublicationsOpened,
  };
};


class PanelPublications extends React.Component {

  constructor(props) {
    super(props)
    const filteringList = FILTERING.reduce((acc,curr)=> (acc[curr.caption]='',acc),{});    
    this.state = {
      isOpened: false,
      showModalPublicationType: false,
      showModalPublicationYears: false,
      showModal: false,
      dataType: undefined,
      dataYears: undefined,
      dataTable: undefined,
      currentPage: 1,
      totalPage: 10,
      take: 10,
      limit: 10,
      isLoading: false,
      filtering : {...filteringList},
      sorting: ''
    }

    this.typingTimeout = undefined
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
    this.publicationTypeChart.legend = new am4charts.Legend();
    this.publicationTypeChart.legend.position = "right"
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

  generateModalContent() {
    const { dataTable, totalPage, currentPage, sorting } = this.state;
    return (
      <div className="p-3 h-100" style={{ fontSize: '14px' }}>
          <table className="inspire-table w-100" style={{ fontSize: '13px' }}>
            <thead>
              <tr>
                <td className="text-center">WebLink</td>
                {FILTERING.map((item, id) =>
                      <td key={id} className="text-center" style={{ cursor: 'pointer' }}
                      onClick={(e) => this.onSetSorting(item.dataField)}>
                      {item.label}
                      <FontAwesomeIcon icon={faLongArrowAltUp} className={sorting == item.dataField ? "ml-1" : "ml-1 d-none"} style={{ color: 'grey' }} />
                      <FontAwesomeIcon icon={faLongArrowAltDown} className={sorting == `-${item.dataField}` ? "ml-1" : "ml-1 d-none"} style={{ color: 'grey' }} />
                    </td>                )}
              </tr>
              <tr style={{ border: '1px solid #A4C8E6', borderWidth: '1px 0px 2px 0px' }}>
                <td></td>
                {FILTERING.map((item, id) =>
                <td key={id} className="text-center" >
                  <SearchHeader 
                    onChange={(pattern) => this.retrievePublicationListFiltered(item.caption, pattern)} 
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
                  <td  className="text-center" style={{ width: '5%' }}>
                    {item.weblink !=undefined?
                    <a href={item.weblink}>
                      <img src="https://demo.explicatos.com/img/Internet.png" style={{ height: '25px' }}></img>
                    </a>
                    :''}
                  </td>
                  <td  className="text-center" style={{ width: '70%' }}>
                    <EllipsisWithTooltip className="text-center" placement="bottom" style={{ width: '800px'}}>
                      {item.name || ''}
                    </EllipsisWithTooltip>
                  </td>
                  <td  className="text-center" style={{ width: '5%' }}>{item.publication_year}</td>
                  <td  className="text-center" style={{ width: '10%' }}>{item.position}</td>
                  <td  className="text-center" style={{ width: '10%' }}>{item.publication_subtype}</td>
                </tr>
              )}
            </tbody>
          </table>
        <InspirePagination currentPage={currentPage} totalPage={totalPage} onClick={this.navigatePage.bind(this)} />
      </div>)
  }

  generateChart() {
    this.generatePublicationTypeChart()
    this.generatePublicationYearsChart()

    // Set state after timeout
    this.setState({ isOpened: true })
  }

  async retrievePublicationType() {
    try {
      const token = localStorage.getItem('token')

      // Perform request
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/investigator/${this.investigatorId}/publications-per-type/`,
        {
          headers: { "Authorization": "jwt " + token }
        })
      this.state.dataType = response.data.results;

    } catch (error) {

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

  async retrievePublicationYears() {
    try {
      const token = localStorage.getItem('token')

      const { match: { params } } = this.props;
      let investigatorId = params.subid;
      investigatorId = investigatorId.split('-')[investigatorId.split('-').length - 1]
      investigatorId = parseInt(investigatorId)

      // Perform request
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/investigator/${investigatorId}/publications-per-year/`,
        {
          headers: { "Authorization": "jwt " + token }
        })
      this.state.dataYears = response.data.results;

    } catch (error) {

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

  async retrievePublicationList(page = 1) {
    try {
      this.setState({ isLoading: true, dataTable: [] })
      const token = localStorage.getItem('token')
      const { take, limit, filtering, sorting } = this.state;

      // Perform request
      let skip = this.state.take * (page - 1);
      let offset = this.state.take * (page - 1);
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

      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/investigator/${this.investigatorId}/publications/?${urlParams}`,
        {
          headers: { "Authorization": "jwt " + token }
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
    } catch (error) {

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

  navigatePage(page) {
    this.retrievePublicationList(page)
  }




  retrievePublicationListFiltered(key, value) {
    let { currentPage, filtering } = this.state;
    for(const item_canidate of FILTERING ){
      if( key === item_canidate.caption ){
        filtering[item_canidate.caption] = value
      }
    }

    this.state.filtering = filtering
    // Clear timeout
    const that = this;
    if ( this.typingTimeout ) {
      clearTimeout(this.typingTimeout);
    }
    this.typingTimeout = 
      setTimeout(function () { that.retrievePublicationList(currentPage) }, 2000)

  }

  componentDidMount() {
    const { match: { params } } = this.props;
    this.investigatorId = params.subid;
    this.investigatorId = this.investigatorId.split('-')[this.investigatorId.split('-').length - 1]
    this.investigatorId = parseInt(this.investigatorId)

    this.retrievePublicationType()
    this.retrievePublicationYears()
    this.retrievePublicationList()
  }

  componentWillUnmount() {
    if (this.publicationYearsChart) {
      this.publicationYearsChart.dispose();
    }
    if (this.publicationTypeChart) {
      this.publicationTypeChart.dispose();
    }
  }

  closeModal() {
    this.setState({
      showModal: false
    })
  }


  openedModal() {
    const { showModal, showModalPublicationType, showModalPublicationYears } = this.state;

    if (showModal) {
      // Do nothing      
    } else if (showModalPublicationType) {
      this.generatePublicationTypeMaxChart()
    } else if (showModalPublicationYears) {
      this.generatePublicationYearsMaxChart()
    }
  }

  closedModal() {
    if (this.publicationYearsMaxChart) {
      this.publicationYearsMaxChart.dispose();
    }
    if (this.publicationTypeMaxChart) {
      this.publicationTypeMaxChart.dispose();
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

    this.retrievePublicationList(currentPage)
  }

  render() {
    if (this.props.tabPublicationsOpened == true &&
      this.state.isOpened == false &&
      this.state.dataType !== undefined &&
      this.state.dataYears !== undefined) {
      const that = this;
      setTimeout(function () { that.generateChart() }, 500);
    }

    const { showModal } = this.state;
    let modalContent = <div>Unknown</div>
    if ( showModal ) {
      modalContent = this.generateModalContent()
    }


    return (
      <div>
        <LoadingOverlay
          active={this.state.isOpened == false}
          spinner>
          <div style={{ padding: '1em 1em 1em 1em' }}>
            <div>
              <div>Publication Types</div>
              <div id="publicationTypeChart" style={{ width: '100%', height: '400px', marginTop: '20px' }}></div>
            </div>
            <div style={{ marginTop: '4em'}}>
              <div>Publication Years</div>
              <div id="publicationYearsChart" style={{ width: '100%', height: '400px', marginTop: '20px' }}></div>
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
          dialogClassName="publications-modal">
          <Modal.Header closeButton>
            <Modal.Title>Publications</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ overflowY: 'scroll', height: '100%' }}>
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

