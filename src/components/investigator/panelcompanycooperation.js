import React from 'react';
// Bootstrap
import { Modal, Button } from 'react-bootstrap';

// React Router
import { withRouter } from 'react-router-dom'

// am4Charts
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4lang_de_DE from "@amcharts/amcharts4/lang/de_DE";


// EllipsisWithTooltip
import EllipsisWithTooltip from 'react-ellipsis-with-tooltip'

// Project imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLongArrowAltUp, faLongArrowAltDown, faSpinner, faAngleDown } from '@fortawesome/free-solid-svg-icons'

// Animate Height
import AnimateHeight from 'react-animate-height';

// Styles
import './modal.scss';

// Redux
import { PANEL } from "../../redux";
import { connect } from "react-redux";

// Loading overlay
import LoadingOverlay from 'react-loading-overlay';

// Assets
import EmptyPanel from '../shared/emptypanel';

// Axios
import axios from 'axios';

// Project Imports
import InspirePagination from '../shared/pagination'
import SearchHeader, { SEARCH_HEADER } from '../shared/searchheader'



const mapStateToProps = state => {
  return {
    tabCompanyCooperationOpened: state.tabCompanyCooperationOpened,
    tabActive: state.tabActive,
  };
};

const DATA_FIELD_LIST = [
  { 
    dataField:'nature_of_payment', caption: 'type', 
    label: 'Type', type: SEARCH_HEADER.TEXT 
  },
  { 
    dataField:'year', caption: 'year', 
    label: 'Year', type: SEARCH_HEADER.NUMBER
  },
  { 
    dataField:'institution', caption: 'company', 
    label: 'Company', type: SEARCH_HEADER.TEXT
  },
  { 
    dataField:'amount', caption: 'amount', 
    label: 'Amount', type: SEARCH_HEADER.NUMBER
  },
  { 
    dataField:'currency', caption: 'currency', 
    label: 'Currency', type: SEARCH_HEADER.NUMBER
  },
]

class PanelCompanyCooperation extends React.Component {

  
  constructor(props) {
    super(props)
    this.dataFieldList = window.mobile?DATA_FIELD_LIST.slice(0,2):DATA_FIELD_LIST;
    const filteringList = this.dataFieldList.reduce((acc,curr)=> (acc[curr.caption]='',acc),{});    
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
      dataTable: [],
      filtering : {...filteringList},
      sorting: '',
      emptyPanelShow: false
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

  generateBarChart() {
    if( this.state.dataTable.length == 0 ){
      this.setState({ isOpened: true })
      return
    }

    // Create chart instance
    const container = window.mobile?"companycooperationbarchartmobile":"companycooperationbarchart"
    this.chart = am4core.create(container, am4charts.XYChart);

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
    if( window.mobile ){
      categoryAxis.renderer.labels.template.visible = false;
      categoryAxis.renderer.maxWidth = 0;
    }

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
    valueAxis.numberFormatter = new am4core.NumberFormatter();
    valueAxis.numberFormatter.numberFormat = "#a"; 

    const that = this;
    function createSeries(field, name) {

      let series = that.chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueX = field;
      series.dataFields.categoryY = "name";
      series.stacked = true;
      series.name = name;
      series.columns.template.tooltipText = `{name}: {valueX} Year: ${field}`;
      series.numberFormatter.language.locale = am4lang_de_DE;
  
      let labelBullet = series.bullets.push(new am4charts.LabelBullet());
      labelBullet.locationX = 0.5;
      labelBullet.label.text = "{valueX}";
      labelBullet.label.fill = am4core.color("#fff");  
    }


    // Generate series
    for(const item of Array.from(yearSet) ){
      createSeries(item, item);
    }

    
    // Add legend
    this.chart.legend = new am4charts.Legend(); 
    this.chart.legend.numberFormatter.numberFormat = "#####"; 

    // Set state after timeout
    this.setState({ isOpened: true })
  }

  generatePieChart() {

    // Create chart instance
    const container = window.mobile?"companycooperationpiechartmobile":"companycooperationpiechart"
    this.maxchart = am4core.create(container, am4charts.PieChart);

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
      const url = `${process.env.REACT_APP_API_URL}/api/investigator/${this.state.investigatorId}/cooperations-per-company/`
      const response = await axios.get(url,
        { headers: { "Authorization": "jwt " + token }
      })

      

      // Chart data
      this.state.dataPerCompany = response.data.results      
      this.state.emptyPanelShow = response.data.results.length == 0

    }catch(error){
      console.log("FAILED")
    }
  }

  async retrieveCooperationsPerNatureOfPayment(){
    try{

      const token = localStorage.getItem('token')

      // Perform request
      const url = `${process.env.REACT_APP_API_URL}/api/investigator/${this.state.investigatorId}/cooperations-per-nature-of-payment/`;
      const response = await axios.get(url,
        { headers: { "Authorization": "jwt " + token }
      })

      // Chart data
      this.state.dataPerNature = response.data.results

    }catch(error){
      console.log("FAILED")
    }
  }

  async retrieveCompanyCooperations(page = 1){
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

      const url = `${process.env.REACT_APP_API_URL}/api/investigator/${this.state.investigatorId}/company-cooperations/?${urlParams}`;
      const response = await axios.get(url,
        { headers: { "Authorization": "jwt " + token }
      })

      let dataTable = response.data.results
      dataTable.map( x => x.show = false)
      dataTable.map( x => x.enabled = true)      
      if(response.data.results.length < take ){
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
    for(const item_candidate of this.dataFieldList ){
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
      setTimeout(function () { that.retrieveCompanyCooperations(currentPage) }, 2000)

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

    this.retrieveCompanyCooperations(currentPage)
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

  renderDesktop() {
    if (this.props.tabActive == PANEL.COMPANY_COOPERATION && 
      this.state.isOpened == false &&
      this.state.dataPerCompany !== undefined) {
      const that = this;
      setTimeout(function () { that.generateBarChart(); that.generatePieChart() }, 500);
    }

    const {dataTable, currentPage, totalPage, sorting} = this.state;

    const emptyPanelShow = this.state.emptyPanelShow && this.props.tabActive == PANEL.COMPANY_COOPERATION;
    return (
      <div>
        <LoadingOverlay
          active={this.state.isOpened == false}
          spinner>

          <EmptyPanel show={emptyPanelShow} />
          {!emptyPanelShow?
          <>
          <div id="companycooperationbarchart" style={{ height: '400px', padding: '1em' }}></div>

          <div className="d-flex" style={{ marginTop: '3em' }}>
              <div className="d-flex justify-content-center flex-column" style={{ width: '30%' }}>
                <div id="companycooperationpiechart" style={{ height: '400px' }}></div>
              </div>
              <div style={{ width: '70%' }}>

                <table className="w-100 inspire-table">
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
                      <td key={id} className="text-center" >
                        <SearchHeader 
                          onChange={(pattern) => this.retrieveCompanyCooperationsFiltered(item.caption, pattern)} 
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
                        <td style={{ width: '20%'}}>{item.nature_of_payment}</td>
                        <td style={{ width: '10%'}}>{item.year}</td>
                        <td style={{ width: '40%'}}>
                          <EllipsisWithTooltip placement="bottom" style={{ width: '300px'}}>
                          {item.institution || ''}
                          </EllipsisWithTooltip>
                        </td>
                        <td style={{ width: '20%'}}>{item.amount}</td>
                        <td style={{ width: '10%'}}>{item.currency}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <InspirePagination currentPage={currentPage} totalPage={totalPage} onClick={this.navigatePage.bind(this)}/>

              </div>
            </div>
            </>
            :''}  

        </LoadingOverlay>
        

      </div>);
  }

  renderMobile(){
    if (this.props.tabActive == PANEL.COMPANY_COOPERATION && 
      this.state.isOpened == false &&
      this.state.dataPerCompany !== undefined) {
      const that = this;
      setTimeout(function () { that.generateBarChart(); that.generatePieChart() }, 500);
    }

    const {dataTable, currentPage, totalPage, sorting} = this.state;

    const emptyPanelShow = this.state.emptyPanelShow && this.props.tabActive == PANEL.COMPANY_COOPERATION;

    return (
      <div>
        <LoadingOverlay
          active={this.state.isOpened == false}
          spinner>

          <EmptyPanel show={emptyPanelShow} />
          {!emptyPanelShow?
          <>
            <div id="companycooperationbarchartmobile" style={{ height: '400px', padding: '1em' }}></div>
            <div id="companycooperationpiechartmobile" style={{ height: '400px', padding: '1em' }}></div>


            <div className="p-3 w-100">

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
                  <td></td>
                  </tr>
                  <tr style={{ border: '1px solid #A4C8E6', borderWidth: '1px 0px 2px 0px' }}>
                    {this.dataFieldList.map((item, id) =>
                      <td key={id} className="text-center" >
                        <SearchHeader 
                          onChange={(pattern) => this.retrieveCompanyCooperationsFiltered(item.caption, pattern)} 
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
                    <td rowSpan="2" style={{ background: 'white', height: '400px' }} colSpan="14" className="text-center">
                      <div className="mb-3" style={{ fontSize: '20px', color: 'grey' }} >Loading ...</div>
                      <FontAwesomeIcon icon={faSpinner}  spin style={{ fontSize: '40px', color: 'grey' }} />                    
                    </td>
                  </tr>
                  </>
                  :<tr></tr>}
                  {dataTable.map((item, id) =>
                    [ 
                    <tr key={id}>
                      <td style={{ width: '40%'}}>{item.nature_of_payment}</td>
                      <td style={{ width: '40%'}}>{item.year}</td>
                      <td className={item.enabled?"inspire-table-profile-mobile":'d-none'}>
                        <FontAwesomeIcon icon={faAngleDown} className={item.show ? 'unfolded' : "folded"}
                          style={{ fontSize: '14px', color: 'grey' }}
                          onClick={e => this.onExpandRow(id)} />
                      </td>
                    </tr>
                    ,
                    <tr key={id + "_"} className="inspire-table-subrow">
                      <td colSpan="7" className={item.show ? '' : 'd-none'}>                      
                        <AnimateHeight
                          height={item.show ? 'auto': 0}
                          duration={250}>
                          <div className="p-2" style={{ background: '#ECEFF8'}}>
                            <div className="expand-title">COMPANY</div>
                            <div className="expand-value" style={{ width: '200px'}}>{item.institution}</div>
                            <div className="expand-title">AMOUNT</div>
                            <div className="expand-value">{item.amount}</div>
                            <div className="expand-title">CURRENCY</div>
                            <div className="expand-value">{item.currency}</div>
                          </div>
                        </AnimateHeight>
                      </td>
                    </tr>
                    ]
                  )}
                </tbody>
              </table>
              <InspirePagination currentPage={currentPage} totalPage={totalPage} onClick={this.navigatePage.bind(this)}/>

              </div>

          </>
          :''}



        </ LoadingOverlay>
      </div>
    )

  }

  render(){
    return (window.mobile?this.renderMobile():this.renderDesktop())
  }
}


export default connect(mapStateToProps, undefined)(withRouter(PanelCompanyCooperation))

