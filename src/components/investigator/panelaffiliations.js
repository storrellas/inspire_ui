import React from 'react';
// Bootstrap
import { Row, Col } from 'react-bootstrap';

// React Router
import { withRouter } from 'react-router-dom'

// Loading overlay
import LoadingOverlay from 'react-loading-overlay';

// EllipsisWithTooltip
import EllipsisWithTooltip from 'react-ellipsis-with-tooltip'

// Project imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLongArrowAltUp, faLongArrowAltDown, faSpinner, faAngleLeft, faAngleDown  } from '@fortawesome/free-solid-svg-icons'

// Assets
import universities from '../../assets/universities.svg';
import hospitals from '../../assets/hospitals.svg';
import associations from '../../assets/associations.svg';

// Animate Height
import AnimateHeight from 'react-animate-height';

// Axios
import axios from 'axios';

// Project Imports
import InspirePagination from '../shared/pagination'
import SearchHeader, { SEARCH_HEADER } from '../shared/searchheader'

const DATA_FIELD_LIST = [
  { 
    dataField:'position__name', caption: 'position', 
    label: 'Position', type: SEARCH_HEADER.TEXT 
  },
  { 
    dataField:'institution__parent_name', caption: 'name', 
    label: 'Name', type: SEARCH_HEADER.TEXT
  },
  { 
    dataField:'institution__department', caption: 'department', 
    label: 'Department', type: SEARCH_HEADER.TEXT
  },
  { 
    dataField:'institution__institution_subtype__name', caption: 'subtype', 
    label: 'Subtype', type: SEARCH_HEADER.TEXT
  },
  { 
    dataField:'past_position', caption: 'pastPosition', 
    label: 'Past Position', type: SEARCH_HEADER.TEXT
  },
  { 
    dataField:'year', caption: 'year', 
    label: 'Year', type: SEARCH_HEADER.TEXT
  },
  { 
    dataField:'institution__city', caption: 'city', 
    label: 'City', type: SEARCH_HEADER.TEXT
  },
  { 
    dataField:'institution__country__name', caption: 'country',
    label: 'Country', type: SEARCH_HEADER.TEXT
  },
]

const Affiliation = (props) => {
  return (
    <div className="text-center m-1" style={{ border: '1px solid #D1E3F2', borderRadius: '5px' }}>
      <div className="font-weight-bold" style={{ padding: '1em 2em 1em 2em' }}>
        {props.name}
      </div>
      <div className="font-weight-bold">{props.number}</div>
      <div style={{ padding: '1em 2em 1em 2em' }}>
        <img className="w-100" src={props.img} alt=" "></img>
      </div>

      <div style={{ padding: '1em 2em 1em 2em' }}>
        <button className={props.active && !window.mobile ? "w-100 inspire-button no-padding" : "w-100 inspire-ghost-button no-padding"} variant="primary"
          onClick={(e) => props.handler()}>
          Show Results
      </button>
      </div>
    </div>
  )
}

const AffiliationMobile = (props) => {
  return (
    <div className="text-center m-1" style={{ border: '1px solid #D1E3F2', borderRadius: '5px' }}>

      <div className="d-flex w-100 justify-content-center mt-3">
        <div>
          <img className="w-100" src={props.img} alt=" "></img>
        </div>
        <div className="font-weight-bold">
          <p>{props.name}</p>
          <p>{props.number}</p>
        </div>

      </div>

      <div style={{ padding: '1em 2em 1em 2em' }}>
        <button className={props.active && !window.mobile ? "w-100 inspire-button no-padding" : "w-100 inspire-ghost-button no-padding"} variant="primary"
          onClick={(e) => props.handler()}>
          Show Results
      </button>
      </div>
    </div>
  )
}

class PanelAffiliations extends React.Component {

  constructor(props) {
    super(props)
    this.dataFieldList = window.mobile?DATA_FIELD_LIST.slice(0,2):DATA_FIELD_LIST;
    const filteringList = DATA_FIELD_LIST.reduce((acc,curr)=> (acc[curr.caption]='',acc),{});    
    this.state = {
      showTableUniversities: false,
      showTableHospitals: false,
      showTableAssociations: false,
      investigatorId: undefined,
      affiliations: undefined,
      affiliationsUniversities: undefined,
      affiliationsHospitals: undefined,
      affiliationsAssociations: undefined,
      currentPage: 1,
      totalPage: 10,
      take: 10, 
      limit: 10,
      isLoading: false,
      dataTable: [],
      filtering : {...filteringList},
      sorting: '',
      showTableSideTitle: '',
      showTableSideModal: false
    }
  }


  async retrieveAffiliations() {
    try{

      const token = localStorage.getItem('token')

      // Perform request
      const url = `${process.env.REACT_APP_API_URL}/api/investigator/${this.state.investigatorId}/affiliations-per-institution-type/`
      const response = await axios.get(url,
        { headers: { "Authorization": "jwt " + token }
      })

      // Chart data
      this.setState({affiliations: response.data.results})

    }catch(error){
      console.log("FAILED")
    }
  }

  async retrieveAffiliationsInstitution(base_url, page = 1) {
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

      const url = `${base_url}?${urlParams}`
      const response = await axios.get(url,
        { headers: { "Authorization": "jwt " + token }
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
        isLoading: false,
      })

    }catch(error){
      console.log("FAILED")
    }
  }

  async retrieveAffiliationsUniversities(page = 1) {
    const base_url = `${process.env.REACT_APP_API_URL}/api/investigator/${this.state.investigatorId}/affiliations-universities/`
    this.retrieveAffiliationsInstitution(base_url, page)
  }

  async retrieveAffiliationsHospitals(page = 1) {
    const base_url = `${process.env.REACT_APP_API_URL}/api/investigator/${this.state.investigatorId}/affiliations-hospitals/`
    this.retrieveAffiliationsInstitution(base_url, page)
  }

  async retrieveAffiliationsAssociations(page = 1) {
    const base_url = `${process.env.REACT_APP_API_URL}/api/investigator/${this.state.investigatorId}/affiliations-associations/`
    this.retrieveAffiliationsInstitution(base_url, page)
  }

  showTableUniversities(componentDidMount = false){    
    this.setState({
      showTableUniversities: true, 
      showTableHospitals: false, 
      showTableAssociations: false, 
      currentPage: 1,
      totalPage: 1,
      take: 10,
      limit: 10,
      isLoading: false,
      showTableSideTitle: "Universities",
      showTableSideModal: (componentDidMount?false:true),
    })
    this.retrieveAffiliationsUniversities(1) 
  }

  
  showTableHospitals(){
    this.setState({
      showTableUniversities: false, 
      showTableHospitals: true, 
      showTableAssociations: false, 
      currentPage: 1,
      totalPage: 1,
      take: 10,
      limit: 10,
      isLoading: false,
      showTableSideTitle: "Hospitals",
      showTableSideModal: true,
    })
    this.retrieveAffiliationsHospitals(1) 
  }

  showTableAssociations(){
    this.setState({
      showTableUniversities: false, 
      showTableHospitals: false, 
      showTableAssociations: true, 
      currentPage: 1,
      totalPage: 1,
      take: 10,
      limit: 10,
      isLoading: false,
      showTableSideTitle: "Associations",
      showTableSideModal: true,
    })
    this.retrieveAffiliationsAssociations(1) 
  }

  retrieveAffiliationsFiltered(key, value){
    
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
      setTimeout(function () { 
        if( that.state.showTableUniversities ){
          that.retrieveAffiliationsUniversities(currentPage) 
        }else if( that.state.showTableHospitals ){
          that.retrieveAffiliationsHospitals(currentPage) 
        }else if( that.state.showTableAssociations ){
          that.retrieveAffiliationsAssociations(currentPage) 
        }
      }, 2000)

  }

  componentDidMount(){

    const { match: { params } } = this.props;
    this.state.investigatorId = params.subid;
    this.state.investigatorId = this.state.investigatorId.split('-')[this.state.investigatorId.split('-').length -1 ]
    this.state.investigatorId = parseInt( this.state.investigatorId )

    this.retrieveAffiliations()
    this.showTableUniversities(true)
  }  

  navigatePage(page) {
    if( this.state.showTableUniversities ){
      this.retrieveAffiliationsUniversities(page) 
    }else if( this.state.showTableHospitals ){
      this.retrieveAffiliationsHospitals(page) 
    }else if( this.state.showTableAssociations ){
      this.retrieveAffiliationsAssociations(page) 
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

    if( this.state.showModalUniversities ){
      this.retrieveAffiliationsUniversities(currentPage) 
    }else if( this.state.showTableHospitals ){
      this.retrieveAffiliationsHospitals(currentPage) 
    }else if( this.state.showTableAssociations ){
      this.retrieveAffiliationsAssociations(currentPage) 
    }
  }

  renderTableDesktop(){
    const { dataTable } = this.state;
    const { currentPage, totalPage, sorting } = this.state;
    return (<>
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
              <td key={id} className="text-center">
                <SearchHeader 
                  onChange={(pattern) => this.retrieveAffiliationsFiltered(item.caption, pattern)} 
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
              <td style={{ width: '10%'}}>{item.position__name}</td>
              <td style={{ width: '20%'}}>
                <EllipsisWithTooltip placement="bottom" style={{ width: '150px'}}>
                {item.institution__parent_name || ''}
                </EllipsisWithTooltip>
              </td>
              <td style={{ width: '20%'}}>
                <EllipsisWithTooltip placement="bottom" style={{ width: '150px'}}>
                {item.institution__department || ''}
                </EllipsisWithTooltip>
              </td>
              <td style={{ width: '20%'}}>{item.institution__institution_subtype__name}</td>
              <td style={{ width: '10%'}}>{item.past_position}</td>
              <td style={{ width: '10%'}}>{item.year}</td>
              <td style={{ width: '10%'}}>{item.institution__city}</td>
              <td style={{ width: '10%'}}>{item.institution__country__name}</td>
            </tr>
          )}
        </tbody>
      </table>
      <InspirePagination currentPage={currentPage} 
          totalPage={totalPage} onClick={this.navigatePage.bind(this)}/>
      </>
    )
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

  renderTableMobile(){
    const { dataTable } = this.state;
    const { currentPage, totalPage, sorting } = this.state;
    return (<>
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
              <td key={id} className="text-center">
                <SearchHeader 
                  onChange={(pattern) => this.retrieveAffiliationsFiltered(item.caption, pattern)} 
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
              <td rowSpan="3" style={{ background: 'white', height: '400px' }} colSpan="14" className="text-center">
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
                <td style={{ width: '40%'}}>{item.position__name}</td>
                <td style={{ width: '40%'}}>
                  <EllipsisWithTooltip placement="bottom" style={{ width: '150px'}}>
                  {item.institution__parent_name || ''}
                  </EllipsisWithTooltip>
                </td>
                <td className={item.enabled?"inspire-table-profile-mobile":'d-none'}>
                  <FontAwesomeIcon icon={faAngleDown} className={item.show ? 'unfolded' : "folded"}
                    style={{ fontSize: '14px', color: 'grey' }}
                    onClick={e => this.onExpandRow(id)} />
                </td>
              </tr>            
              <tr className="inspire-table-subrow">
                <td colSpan="7" className={item.show ? '' : 'd-none'}>                      
                  <AnimateHeight
                    height={item.show ? 'auto': 0}
                    duration={250}>
                    <div className="p-2" style={{ background: '#ECEFF8'}}>
                      <div className="expand-title">DEPARTMENT</div>
                      <div className="expand-value">{item.institution__department}</div>
                      <div className="expand-title">SUBTYPE</div>
                      <div className="expand-value">{item.institution__institution_subtype__name}</div>
                      <div className="expand-title">PAST POSITION</div>
                      <div className="expand-value">{item.past_position}</div>
                      <div className="expand-title">YEAR</div>
                      <div className="expand-value">{item.year}</div>
                      <div className="expand-title">CITY</div>
                      <div className="expand-value">{item.institution__city}</div>
                      <div className="expand-title">COUNTRY</div>
                      <div className="expand-value">{item.institution__country__name}</div>
                    </div>
                  </AnimateHeight>
                </td>
              </tr>
            </React.Fragment>
          )}
        </tbody>
      </table>
      <InspirePagination currentPage={currentPage} 
          totalPage={totalPage} onClick={this.navigatePage.bind(this)}/>
      </>
    )
  }

  renderDesktop() {

    const { affiliations } = this.state;
    const { showTableUniversities, showTableHospitals, showTableAssociations } = this.state;
    const { showTableSideModal, showTableSideTitle } = this.state;

    let nUniversities = "-";
    let nHospitals = "-";
    let nAssociations = "-";
    if( affiliations ){
      nUniversities = affiliations.filter(x => x.affiliation_type === 'universities')[0].total
      nHospitals = affiliations.filter(x => x.affiliation_type === 'hospitals')[0].total
      nAssociations = affiliations.filter(x => x.affiliation_type === 'associations')[0].total
    }

    return (
      <>
        <Row>
          <Col xs={{ span: 8, offset:2}} className="mb-3">
            <Row>
              <Col sm={{ span: 4 }} className="no-padding">
                  <Affiliation name={"Universities"} number={nUniversities}
                    img={associations} active={showTableUniversities}
                    handler={e => this.showTableUniversities()} />
              </Col>
              <Col sm={{ span: 4 }} className="no-padding">
                <Affiliation name={"Hospitals"} number={nHospitals}
                  img={associations} active={showTableHospitals}
                  handler={e => this.showTableHospitals()} />
              </Col>
              <Col sm={{ span: 4 }} className="no-padding">
                <Affiliation name={"Associations"} number={nAssociations}
                  img={associations} active={showTableAssociations}
                  handler={e => this.showTableAssociations()} />
              </Col>
          </Row>
          </Col>
        </Row>

        <div className="p-3 h-100" style={{ fontSize: '14px'}}>
          {this.renderTableDesktop()}
      </div>
    </>);
  }

  renderMobile() {

    const { affiliations } = this.state;
    const { showTableUniversities, showTableHospitals, showTableAssociations } = this.state;
    const { showTableSideModal, showTableSideTitle } = this.state;

    let nUniversities = "-";
    let nHospitals = "-";
    let nAssociations = "-";
    if( affiliations ){
      nUniversities = affiliations.filter(x => x.affiliation_type === 'universities')[0].total
      nHospitals = affiliations.filter(x => x.affiliation_type === 'hospitals')[0].total
      nAssociations = affiliations.filter(x => x.affiliation_type === 'associations')[0].total
    }

    return (
      <>
        <div>
            <AffiliationMobile name={"Universities"} number={nUniversities}
                    img={associations} active={showTableUniversities}
                    handler={e => this.showTableUniversities()} />
            <AffiliationMobile name={"Hospitals"} number={nHospitals}
                  img={associations} active={showTableHospitals}
                  handler={e => this.showTableHospitals()} />
            <AffiliationMobile name={"Associations"} number={nAssociations}
                  img={associations} active={showTableAssociations}
                  handler={e => this.showTableAssociations()} />
        </div>

        <div className={showTableSideModal? "inspire-sidemodal-wrapper toggled": "inspire-sidemodal-wrapper"}>
          <div className="p-3">
            <div style={{ fontSize: '20px' }} 
              onClick={(e) => this.setState({ showTableSideModal: false })}>
              <FontAwesomeIcon icon={faAngleLeft}/>              
            </div>
            <div className="mt-3" style={{ fontSize: '20px' }}>
              <b>{showTableSideTitle}</b>  
            </div>
            <div className="mt-3">
              {this.renderTableMobile()}
            </div>
          </div>
        </div>
    </>);
  }

  render() {
    return (window.mobile?this.renderMobile():this.renderDesktop())
  }

  
}

export default withRouter(PanelAffiliations);
