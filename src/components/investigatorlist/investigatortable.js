import React, { useState } from 'react';
// Bootstrap
import { Col, Row, Button, Dropdown, Pagination, Tooltip, OverlayTrigger } from 'react-bootstrap';

// React Router
import { withRouter } from 'react-router-dom'

// Animate Height
import AnimateHeight from 'react-animate-height';

// Assets
import arrow from '../../assets/arrow.png';
import lock from '../../assets/lock.png';
import favorite from '../../assets/favorite.png';
import nonfavorite from '../../assets/nonfavorite.png';

import './investigatortable.scss'

// EllipsisWithTooltip
import EllipsisWithTooltip from 'react-ellipsis-with-tooltip'

// Project imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner, faLongArrowAltUp, faLongArrowAltDown,faAngleDown } from '@fortawesome/free-solid-svg-icons'

// Redux
import { connect } from "react-redux";

// Axios
import axios from 'axios';

// React Select
import Select from 'react-select';

// Loading overlay
import LoadingOverlay from 'react-loading-overlay';

// Project Imports
import InspirePagination from '../shared/pagination'
import SearchHeader, { SEARCH_HEADER } from '../shared/searchheader'


const mapStateToProps = (state) => {
  return {
    scrollEnd: state.scrollEnd,
  };
}

const FILTERING_DESKTOP = [
  { 
    dataField:'first_name', caption: 'firstName', width: '10%',
    label: 'First Name', type: SEARCH_HEADER.TEXT 
  },
  { 
    dataField:'last_name', caption: 'lastName',  width: '10%',
    label: 'Last Name', type: SEARCH_HEADER.TEXT 
  },
  { 
    dataField:'prop_specialties', caption: 'specialties', width: '150px',
    label: 'Specialties', type: SEARCH_HEADER.TEXT 
  },
  { 
    dataField:'focus_areas_reasearch_interests', caption: 'focusArea', width: '150px',
    label: 'Focus Area', type: SEARCH_HEADER.TEXT 
  },
  { 
    dataField:'city', caption: 'city',  width: '10%',
    label: 'City', type: SEARCH_HEADER.TEXT 
  },
  { 
    dataField:'country', caption: 'country', width: '5%',
    label: 'Country', type: SEARCH_HEADER.TEXT 
  },
  { 
    dataField:'number_linked_publications', caption: 'Publications',  width: '5%',
    label: 'P', type: SEARCH_HEADER.NUMBER 
  },
  { 
    dataField:'number_linked_events', caption: 'Events',  width: '5%',
    label: 'E', type: SEARCH_HEADER.NUMBER 
  },
  { 
    dataField:'number_linked_clinical_trials', caption: 'Clinical Trials',  width: '5%',
    label: 'CT', type: SEARCH_HEADER.NUMBER 
  },
  { 
    dataField:'number_linked_institutions_coi', caption: 'Confict of Interest',  width: '5%',
    label: 'COI', type: SEARCH_HEADER.NUMBER 
  },
  { 
    dataField:'mesh_counter', caption: 'score',  width: '5%',
    label: 'Score', type: SEARCH_HEADER.TEXT 
  },
]

const FILTERING_MOBILE = [
  { 
    dataField:'first_name', caption: 'firstName', width: '30%',
    label: 'First Name', type: SEARCH_HEADER.TEXT 
  },
  { 
    dataField:'last_name', caption: 'lastName',  width: '30%',
    label: 'Last Name', type: SEARCH_HEADER.TEXT 
  },
]

class InvestigatorTable extends React.Component {

  constructor(props) {
    super(props)

    this.filteringDevice = window.mobile?FILTERING_MOBILE:FILTERING_DESKTOP;

    const filteringList = this.filteringDevice.reduce((acc,curr)=> (acc[curr.caption]='',acc),{});    
    this.state = {
      currentPage: 1,
      totalPage: 10,
      take: 100,
      limit: 100,
      investigatorList: [],
      isLoadingMesh: false,
      isLoading: true,
      meshOptions: [],
      meshOid: undefined,
      filtering : {...filteringList},
      sorting: '',
      scrollEndHandled: false
    }


    this.typingTimeout = undefined
    this.projectOid = undefined
  }

  async loadInvestigators(page = 1){

    try{
      if( window.mobile == false) this.state.investigatorList = []
      this.setState({isLoading: true})
      const { match: { params } } = this.props;
      const projectOid = params.id;
      const { take, limit, sorting, meshOid, filtering } = this.state;

      // Request investigators
      let skip = this.state.take * (page-1);
      let offset = this.state.take * (page -1);
      const token = localStorage.getItem('token')
      let urlParams = projectOid?`project=${projectOid}`:'';
      urlParams = `${urlParams}&limit=${limit}&offset=${offset}&skip=${skip}&take=${take}`
      if( meshOid !== undefined ){
        urlParams = `${urlParams}&mesh=${meshOid}`;
      }

      // Add filtering
      if( filtering !== undefined ){
        for(const item of this.filteringDevice ){
          if( filtering[item.caption] !== '' ){
            urlParams = `${urlParams}&${item.dataField}=${filtering[item.caption]}`;
          }
        }
      }

      // Add sorting
      if( sorting !== ''){
        urlParams = `${urlParams}&ordering=${sorting}`;
      }


      const baseUrl = this.props.favorites?'/api/favorite-investigators/':'/api/investigators/'

      // Perform request
      const response = await axios.get(`${process.env.REACT_APP_API_URL}${baseUrl}?${urlParams}`,
        { headers: { "Authorization": "jwt " + token }
      })

      clearTimeout(this.typingTimeout);

      // Added folded attribute      
      const investigatorList = response.data.results;
      investigatorList.map( x => x.folded = false)
      
      // Set State
      const totalPage = Math.ceil(response.data.count / take);
      this.setState({
        investigatorList: investigatorList, 
        projectOid: projectOid,
        currentPage: page,
        totalPage: totalPage,
        meshOid: meshOid,
        isLoading: false, 
      })
    }catch(error){
      console.log("FAILED")
    }       
  }

  navigatePage(page) {
    this.loadInvestigators(page)
  }

  componentDidMount(){
    this.loadInvestigators()
  }

  componentDidUpdate(){    
    const { take, limit } = this.state;
    
    // Refresh table when mobile
    if( window.mobile ){
      // Refresh table when scroll reached end and it was not handled
      if( this.props.scrollEnd && this.state.scrollEndHandled == false){
        this.state.scrollEndHandled = true;
        this.state.take = take + 10;
        this.state.limit = limit + 10;
        this.loadInvestigators()
      }
    }

    // Reset scrollEndHandled
    if( this.props.scrollEnd === false){      
      this.state.scrollEndHandled = false;
    }
  }

  async loadMesh(pattern){
    try{
      this.setState({isLoadingMesh: true})

      const token = localStorage.getItem('token')
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/meshs/?limit=10&ordering=name&name=${pattern}`,
        { headers: { "Authorization": "jwt " + token }
      })

      // Autocomplete
      const meshOptions = []
      for(const mesh of response.data.results ){
        meshOptions.push({value:mesh.oid, label: mesh.name})
      }
      this.setState({meshOptions: meshOptions, isLoadingMesh:false})
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

  onMeshFill(pattern){
    const that = this;

    // Clear timeout
    if ( this.typingTimeout ) {
      clearTimeout(this.typingTimeout);
    }
    this.typingTimeout = 
      setTimeout(function () {that.loadMesh(pattern);}, 1000)
  }

  onMeshSelected(mesh){
    const { currentPage } = this.state;

    // Check if mesh is undefined
    if( mesh === undefined || mesh === null ){
      this.loadInvestigators(currentPage)
      return
    }

    // Set selection
    let meshOid = mesh.value
    meshOid = meshOid.split('-')[meshOid.split('-').length -1 ]
    meshOid = parseInt( meshOid )

    this.state.meshOid = meshOid;
    this.loadInvestigators(currentPage)
  }

  loadFilteredInvestigators(key, value){
    let { currentPage, filtering } = this.state;
    for(const item_candidate of this.filteringDevice ){
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
      setTimeout(function () { that.loadInvestigators(currentPage) }, 2000)
    
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

    this.loadInvestigators(currentPage)
  }

  async onSetInvestigatorFavorite(oid, isFavorite){
    try{
      let { currentPage, sorting } = this.state;

      // Set selection      
      let shortOid = oid.split('-')[oid.split('-').length -1 ]
      const token = localStorage.getItem('token')
      const baseUrl = isFavorite?
        `${process.env.REACT_APP_API_URL}/api/remove-favorite-investigators/`:
        `${process.env.REACT_APP_API_URL}/api/add-favorite-investigators/`;
      const body = { ids: [ shortOid ] }
      const response = await axios.post(baseUrl, body,
        { headers: { "Authorization": "jwt " + token }
      })

      this.loadInvestigators(currentPage)

    }catch(error){
      console.log("FAILED")
    }
  }

  onShowInvestigator(id){
    const { investigatorList } = this.state;
    // Keep former value
    let former = investigatorList[id].show
    investigatorList.map( x => x.show = false)

    // Expand    
    investigatorList[id].show = !former;

    // Set State
    this.setState({ investigatorList: investigatorList})
  }

  renderDesktop() {
    const { currentPage, totalPage, meshOptions, sorting } = this.state;

    return (
      <>
        <div className="d-flex justify-content-end pt-3 pb-3">
          <div style={{ width: '40%'}}>
          <div style={{ color: '#A8A8A8', fontSize: '12px'}}>Select Mesh</div>
          <Select isLoading={this.state.isLoadingMesh} isClearable 
                isSearchable options={meshOptions} 
                onInputChange={(e) => this.onMeshFill(e)} 
                onChange={ (e) => this.onMeshSelected(e)}
                placeholder={'All'}
                styles={{ 
                  control: (provided) => ({ ...provided, borderTop: 0, borderLeft: 0, borderRight: 0, borderRadius: 0}),
                  indicatorSeparator: (provided) => ({ backgroundColor: 'white'}) 
                }}
                />
          </div>
        </div>          

          <table className="w-100 inspire-table" style={{ display: 'block', minHeight: '200px', fontSize: '14px'}}>
            <thead>
              <tr>
                <td style={{ width: '3%'}}></td>
                <td style={{ width: '3%'}}>Profile</td>
                {this.filteringDevice.map((item, id) =>                  
                  <td key={id} style={{ cursor: 'pointer', width: item.width }} 
                    onClick={() => this.onSetSorting(item.dataField)}>
                    { 
                    ['P', 'E', 'CT', 'COI'].includes(item.label)?
                      <OverlayTrigger
                        placement="bottom"
                        delay={{ show: 250, hide: 400 }}
                        overlay={<Tooltip>{item.caption}</Tooltip>}>
                        <div style={{ textDecoration: 'underline' }}>{item.label}</div>
                      </OverlayTrigger>
                    :
                    <div>{item.label}</div>}

                    <FontAwesomeIcon icon={faLongArrowAltUp} className={sorting==item.dataField?"ml-1":"ml-1 d-none"} style={{ color: 'grey' }} />
                    <FontAwesomeIcon icon={faLongArrowAltDown} className={sorting==`-${item.dataField}`?"ml-1":"ml-1 d-none"} style={{ color: 'grey' }} />
                </td>
                )}
              </tr>
              <tr style={{ border: '1px solid #A4C8E6', borderWidth: '1px 0px 2px 0px' }}>
                <td></td>
                <td></td>

                {this.filteringDevice.map((item, id) =>
                <td key={id}>
                  <SearchHeader 
                    onChange={(pattern) => this.loadFilteredInvestigators(item.caption, pattern)} 
                    type={item.type} />
                </td>
                )}
              </tr>
            </thead>

            <tbody>
                {this.state.isLoading && this.state.investigatorList.length === 0 ?
                <tr>
                  <td style={{ background: 'white', height: '400px' }} colSpan="14" className="text-center">
                    <div className="mb-3" style={{ fontSize: '20px', color: 'grey' }} >Loading ...</div>
                    <FontAwesomeIcon icon={faSpinner}  spin style={{ fontSize: '40px', color: 'grey' }} />                    
                  </td>
                </tr>
                :<tr></tr>}
              {this.state.investigatorList.map((item, id) =>
                <tr key={id}>
                  <td>
                    
                    <img src={item.is_favorite_investigator?favorite:nonfavorite} width="30"
                      onClick={(e) => this.onSetInvestigatorFavorite(item.oid, item.is_favorite_investigator)}
                      style={{ cursor: 'pointer' }}></img>
                    
                  </td>
                  <td>
                    {item.is_unlocked_investigator?                    
                      <img src={arrow} width="30"
                        onClick={(e) => this.props.history.push(`/dashboard/project/${this.state.projectOid}/investigator/${item.oid}`)}
                        style={{ cursor: 'pointer' }}></img>
                    :
                      <img src={lock} width="20"></img>
                    }
                  </td>

                  <td>{item.first_name}</td>
                  <td>{item.last_name}</td>
                  <td>
                    <EllipsisWithTooltip placement="bottom" style={{ width: '150px'}}>
                    {item.prop_specialties || ''}
                    </EllipsisWithTooltip>
                  </td>
                  <td>
                    <EllipsisWithTooltip placement="bottom" style={{ width: '150px'}}>
                      {item.focus_areas_reasearch_interests || ''}
                    </EllipsisWithTooltip>
                  </td>
                  <td>{item.city}</td>
                  <td>{item.country}</td>
                  <td>{item.number_linked_publications}</td>
                  <td>{item.number_linked_events}</td>
                  <td>{item.number_linked_clinical_trials}</td>
                  <td>{item.number_linked_institutions_coi}</td>
                  <td>{item.mesh_counter}</td>

                </tr>
              )}
            </tbody>
          </table>
          

          <InspirePagination currentPage={currentPage} 
            totalPage={totalPage} onClick={this.navigatePage.bind(this)}/>        
      </>
    );
  }

  renderMobile() {
    const { currentPage, totalPage, meshOptions, sorting } = this.state;


    return (
      <>
        <div className="d-flex justify-content-end pb-3">
          <div className="w-100">
            <div style={{ color: '#A8A8A8', fontSize: '12px' }}>Select Mesh</div>
            <Select isLoading={this.state.isLoadingMesh} isClearable
              isSearchable options={meshOptions}
              onInputChange={(e) => this.onMeshFill(e)}
              onChange={(e) => this.onMeshSelected(e)}
              placeholder={'All'}
              styles={{
                control: (provided) => ({ ...provided, borderTop: 0, borderLeft: 0, borderRight: 0, borderRadius: 0 }),
                indicatorSeparator: (provided) => ({ backgroundColor: 'white' })
              }}
            />
          </div>
        </div>

        <table className="w-100 inspire-mobile-table" style={{ minHeight: '200px', fontSize: '14px' }}>
          <thead>
            <tr style={{ border: '1px solid #A4C8E6', borderWidth: '0px 0px 1px 0px' }}>
              <td style={{ width: '15%' }}></td>
              {this.filteringDevice.map((item, id) =>
                <td key={id} style={{ cursor: 'pointer', width: item.width }}
                  onClick={() => this.onSetSorting(item.dataField)}>
                  <div className="d-flex justify-content-center">
                    <div>{item.label}</div>
                    <FontAwesomeIcon icon={faLongArrowAltUp} className={sorting == item.dataField ? "ml-1" : "ml-1 d-none"} style={{ color: 'grey' }} />
                    <FontAwesomeIcon icon={faLongArrowAltDown} className={sorting == `-${item.dataField}` ? "ml-1" : "ml-1 d-none"} style={{ color: 'grey' }} />
                  </div>
                </td>
              )}
              <td style={{ width: '15%' }}></td>
            </tr>
          </thead>

          <tbody>
            {this.state.isLoading ?
              <tr>
                <td style={{ background: 'white', height: '400px' }} colSpan="14" className="text-center">
                  <div className="mb-3" style={{ fontSize: '20px', color: 'grey' }} >Loading ...</div>
                  <FontAwesomeIcon icon={faSpinner} spin style={{ fontSize: '40px', color: 'grey' }} />
                </td>
              </tr>
              : <tr></tr>}
            {this.state.investigatorList.map((item, id) =>
              [<tr key={id}>
                <td className="text-center" >

                  <img src={item.is_favorite_investigator ? favorite : nonfavorite} width="30"
                    onClick={(e) => this.onSetInvestigatorFavorite(item.oid, item.is_favorite_investigator)}
                    style={{ cursor: 'pointer' }}></img>

                </td>
                <td>{item.first_name}</td>
                <td>{item.last_name}</td>
                <td className="inspire-table-profile-mobile">
                  <FontAwesomeIcon icon={faAngleDown} className={item.show ? 'unfolded' : "folded"}
                    style={{ fontSize: '14px', color: 'grey' }}
                    onClick={e => this.onShowInvestigator(id)} />
                </td>

              </tr>,
                <tr key={id + "_"} className="inspire-table-events-subrow">
                  <td colSpan="7" className={item.show ? '' : 'd-none'}>
                    
                    <AnimateHeight
                      height={item.show ? 'auto': 0}
                      duration={250}>
                      <div className="p-2" style={{ background: '#ECEFF8'}}>
                        <div className="d-flex">
                          <div className="w-50">
                            <div style={{ color: '#8a8a8a', fontSize: '12px'  }}>SPECIALTIES</div>
                            <div className="inspire-submenu-item">{item.prop_specialties}</div>
                          </div>
                          <div className="w-50">
                            <div style={{ color: '#8a8a8a', fontSize: '12px'  }}>FOCUS AREA</div>
                            <div className="inspire-submenu-item">{item.focus_areas_reasearch_interests}</div>
                          </div>
                        </div>
                        <div className="d-flex mt-3">
                          <div className="w-50">
                            <div style={{ color: '#8a8a8a', fontSize: '12px'  }}>CITY</div>
                            <div className="inspire-submenu-item">{item.city}</div>
                          </div>
                          <div className="w-50">
                            <div style={{ color: '#8a8a8a', fontSize: '12px'  }}>COUNTRY</div>
                            <div className="inspire-submenu-item">{item.country}</div>
                          </div>
                        </div>
                        <div className="d-flex mt-3 justify-content-between">
                          <div>
                            <div style={{ color: '#8a8a8a', fontSize: '12px'  }}>P</div>
                            <div>{item.number_linked_publications}</div>
                          </div>
                          <div>
                            <div style={{ color: '#8a8a8a', fontSize: '12px'  }}>E</div>
                            <div>{item.number_linked_events}</div>
                          </div>
                          <div>
                            <div style={{ color: '#8a8a8a', fontSize: '12px'  }}>CT</div>
                            <div>{item.number_linked_clinical_trials}</div>
                          </div>
                          <div>
                            <div style={{ color: '#8a8a8a', fontSize: '12px'  }}>COI</div>
                            <div>{item.number_linked_institutions_coi}</div>
                          </div>
                          <div>
                            <div style={{ color: '#8a8a8a', fontSize: '12px'  }}>SCORE</div>
                            <div>{item.mesh_counter?item.mesh_counter:'--'}</div>
                          </div>
                        </div>
                        <div className="mt-3">
                          <Button className="w-100 inspire-button inspire-box-shadow" 
                            variant="outline-primary"
                            style={{ paddingLeft: 0, paddingRight: 0 }} 
                            onClick={(e) => this.props.history.push(`/dashboard/project/${this.state.projectOid}/investigator/${item.oid}`)}>
                              See Profile
                          </Button>
                          </div>
                      </div>
                    </AnimateHeight>
                  </td>
                </tr>]
            )}
          </tbody>
        </table>

      </>
    );
  }

  render() {
    return (window.mobile?this.renderMobile():this.renderDesktop())
  }
}

export default connect(mapStateToProps, undefined)(withRouter(InvestigatorTable));
