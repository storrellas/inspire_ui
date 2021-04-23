import React from 'react';
// Bootstrap
import { Modal, Button, Row, Col } from 'react-bootstrap';

// React Router
import { withRouter } from 'react-router-dom'

// am4charts
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";

// Animate Height
import AnimateHeight from 'react-animate-height';

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faLongArrowAltUp, faLongArrowAltDown, faSpinner, faAngleDown } from '@fortawesome/free-solid-svg-icons'

// Redux
import { PANEL } from "../../redux";
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
import EmptyPanel from '../shared/emptypanel';
import am4themes_inspire from '../shared/am4colorset';



// Styles

// Assets

const DATA_FIELD_LIST = [
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
    tabActive: state.tabActive,    
  };
};


class PanelPublications extends React.Component {

  constructor(props) {
    super(props)
    this.dataFieldList = window.mobile?DATA_FIELD_LIST.slice(0,1):DATA_FIELD_LIST;
    const filteringList = this.dataFieldList.reduce((acc,curr)=> (acc[curr.caption]='',acc),{});    
    this.state = {
      isOpened: false,
      dataType: undefined,
      dataYears: undefined,
      dataTable: [],
      currentPage: 1,
      totalPage: 10,
      take: 10,
      limit: 10,
      isLoading: false,
      filtering : {...filteringList},
      sorting: '',
      emptyPanelShow: false,
      showTableSideModal: false
    }

    this.typingTimeout = undefined
  }

  generatePublicationType(container) {
    // Create chart instance
    let chart = am4core.create(container, am4charts.PieChart);
    chart.startAngle = -180;
    chart.endAngle = 180;

    // Add data
    chart.data = this.state.dataType.sort((a,b) => (a.total > b.total) ? -1 : ((b.total > a.total) ? 1 : 0));
    chart.innerRadius = am4core.percent(60);

    // Add and configure Series
    var pieSeries = chart.series.push(new am4charts.PieSeries());
    const pieSeriesRef = pieSeries;

    pieSeries.labels.template.disabled = true;
    pieSeries.dataFields.value = "total";
    pieSeries.dataFields.category = "name";
    pieSeries.slices.template.tooltipText = "{category} {value}%";
    
    
    pieSeries.hiddenState.properties.endAngle = -90;

    pieSeries.events.on("ready", ()=>{
      if(pieSeries.slices.length > 0 )
        pieSeriesRef.slices.getIndex(0).showTooltipOn = "always";
      if(pieSeries.slices.length > 1 ){
        pieSeriesRef.slices.getIndex(1).showTooltipOn = "always";
        pieSeriesRef.slices.getIndex(1).tooltip.pointerOrientation = "up";
        
      }        
      if(pieSeries.slices.length > 2 )
        pieSeriesRef.slices.getIndex(2).showTooltipOn = "always";
    })


    //chart.hiddenState.properties.radius = am4core.percent(0);

    return chart;
  }

  generatePublicationTypeChart() {
    this.publicationTypeChart = this.generatePublicationType("publicationTypeChart")
    //this.publicationTypeChart.legend = new am4charts.Legend();
    //this.publicationTypeChart.legend.position = "right"
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

  generateTable() {
    const { dataTable, totalPage, currentPage, sorting } = this.state;
    return (
      <div className="p-3 h-100" style={{ fontSize: '14px' }}>
          <table className="inspire-table w-100" style={{ fontSize: '13px' }}>
            <thead>
              <tr>
                <td className="text-center">WebLink</td>
                {this.dataFieldList.map((item, id) =>
                      <td key={id} className="text-center" style={{ cursor: 'pointer' }}
                      onClick={(e) => this.onSetSorting(item.dataField)}>
                      {item.label}
                      <FontAwesomeIcon icon={faLongArrowAltUp} className={sorting == item.dataField ? "ml-1" : "ml-1 d-none"} style={{ color: 'grey' }} />
                      <FontAwesomeIcon icon={faLongArrowAltDown} className={sorting == `-${item.dataField}` ? "ml-1" : "ml-1 d-none"} style={{ color: 'grey' }} />
                    </td>                )}
              </tr>
              <tr style={{ border: '1px solid #A4C8E6', borderWidth: '1px 0px 2px 0px' }}>
                <td></td>
                {this.dataFieldList.map((item, id) =>
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
                    <a href={item.weblink} target="_blank">                      
                      <img src="https://demo.explicatos.com/img/Internet.png" style={{ height: '25px' }}></img>
                    </a>
                    :''}
                  </td>
                  <td  className="text-left" style={{ width: '40%' }}>
                    <EllipsisWithTooltip className="text-center" placement="bottom" style={{ width: '600px'}}>
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

  generateTableMobile() {
    const { dataTable, totalPage, currentPage, sorting } = this.state;

    return (
      <div className="p-3 h-100" style={{ fontSize: '14px' }}>
          <table className="inspire-mobile-table w-100" style={{ fontSize: '13px' }}>
            <thead>
              <tr>
                <td className="text-center">WebLink</td>
                {this.dataFieldList.map((item, id) =>
                      <td key={id} className="text-center" style={{ cursor: 'pointer' }}
                      onClick={(e) => this.onSetSorting(item.dataField)}>
                      {item.label}
                      <FontAwesomeIcon icon={faLongArrowAltUp} className={sorting == item.dataField ? "ml-1" : "ml-1 d-none"} style={{ color: 'grey' }} />
                      <FontAwesomeIcon icon={faLongArrowAltDown} className={sorting == `-${item.dataField}` ? "ml-1" : "ml-1 d-none"} style={{ color: 'grey' }} />
                    </td>                
                )}
                <td></td>
              </tr>
              <tr style={{ border: '1px solid #A4C8E6', borderWidth: '1px 0px 2px 0px' }}>
                <td></td>
                {this.dataFieldList.map((item, id) =>
                <td key={id} className="text-center" >
                  <SearchHeader 
                    onChange={(pattern) => this.retrievePublicationListFiltered(item.caption, pattern)} 
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
              {dataTable.map((item, id) =>
                <React.Fragment key={id}>
                  <tr>
                    <td  className="text-center" style={{ width: '5%' }}>
                      {item.weblink !=undefined?
                      <a href={item.weblink} target="_blank">                      
                        <img src="https://demo.explicatos.com/img/Internet.png" style={{ height: '25px' }}></img>
                      </a>
                      :''}
                    </td>
                    <td  className="text-justify" style={{ width: '90%' }}>         
                    <div className="pt-2 pb-2 pl-3 pr-3">
                      {item.name}                    
                      </div>           
                    </td>
                    <td className={item.enabled?"inspire-table-profile-mobile":'d-none'}  style={{ width: '5%' }}>
                      <FontAwesomeIcon icon={faAngleDown} className={item.show ? 'unfolded' : "folded"}
                        style={{ fontSize: '14px', color: 'grey' }}
                        onClick={e => this.onExpandRow(id)} />
                    </td>
                    
                  </tr>
                  <tr  className="inspire-table-subrow">
                  <td colSpan="2" className={item.show ? '' : 'd-none'}> 
                  <AnimateHeight
                    height={item.show ? 'auto': 0}
                    duration={250}>
                    <div className="p-2" style={{ background: '#ECEFF8'}}>
                      <div className="expand-title">DEPARTMENT</div>
                      <div className="expand-value">{item.publication_year}</div>
                      <div className="expand-title">SUBTYPE</div>
                      <div className="expand-value">{item.position}</div>
                      <div className="expand-title">PAST POSITION</div>
                      <div className="expand-value">{item.publication_subtype}</div>
                    </div>
                  </AnimateHeight>
                  </td>

                  </tr>
                </React.Fragment>
              )}
            </tbody>
          </table>
        <InspirePagination currentPage={currentPage} totalPage={totalPage} onClick={this.navigatePage.bind(this)} />
      </div>)
  }

  generateChart() {
    if(this.state.dataTable.length > 0){
      this.generatePublicationTypeChart()
      this.generatePublicationYearsChart()
    }

    // Set state after timeout
    this.setState({ isOpened: true })
  }

  async retrievePublicationType() {
    try {
      const token = localStorage.getItem('token')

      // Perform request
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/investigator/${this.investigatorId}/publications-per-type/`,
        {
          headers: { "Authorization": "jwt " + token }
        })
      this.state.dataType = response.data.results;
      this.state.emptyPanelShow = response.data.results.length == 0;

    } catch (error) {
      console.log("FAILED")
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
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/investigator/${investigatorId}/publications-per-year/`,
        {
          headers: { "Authorization": "jwt " + token }
        })
      this.state.dataYears = response.data.results;

    } catch (error) {
      console.log("FAILED")
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

      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/investigator/${this.investigatorId}/publications/?${urlParams}`,
        {
          headers: { "Authorization": "jwt " + token }
        })

      let dataTable = response.data.results
      dataTable.map( x => x.show = false)
      dataTable.map( x => x.enabled = true)           
      if(response.data.results.length < take){
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
    } catch (error) {
      console.log("FAILED")
    }
  }

  navigatePage(page) {
    this.retrievePublicationList(page)
  }

  retrievePublicationListFiltered(key, value) {
    let { currentPage, filtering } = this.state;
    for(const item_canidate of this.dataFieldList ){
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
    if (this.props.tabActive == PANEL.PUBLICATIONS &&
      this.state.isOpened == false &&
      this.state.dataType !== undefined &&
      this.state.dataYears !== undefined) {
      const that = this;
      setTimeout(function () { that.generateChart() }, 500);
    }

    // Generate modal content
    const emptyPanelShow = this.state.emptyPanelShow && 
                            this.props.tabActive == PANEL.PUBLICATIONS;
    return (
      <div>
        <LoadingOverlay
          active={this.state.isOpened == false}
          spinner>

          <EmptyPanel show={emptyPanelShow} />
          {!emptyPanelShow ?
            <>
              <Row style={{ padding: '1em 1em 1em 1em' }}>
                <Col sm={6}>
                  <div>Publication Types</div>
                  <div id="publicationTypeChart" style={{ width: '100%', height: '300px', marginTop: '20px' }}></div>
                </Col>
                <Col sm={6}>
                  <div>Publication Years</div>
                  <div id="publicationYearsChart" style={{ width: '100%', height: '300px', marginTop: '20px' }}></div>
                </Col>
              </Row>
              <div className={this.state.showTableSideModal ? "inspire-sidemodal-wrapper toggled" : "inspire-sidemodal-wrapper"}>
                <div className="p-3">
                  <div style={{ fontSize: '20px' }}
                    onClick={e => this.setState({ showTableSideModal: false })}>
                    <FontAwesomeIcon icon={faAngleLeft} />
                  </div>
                  <div className="mt-3" style={{ fontSize: '20px' }}>
                    <b>Publications</b>
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

export default connect(mapStateToProps, undefined)(withRouter(PanelPublications))

