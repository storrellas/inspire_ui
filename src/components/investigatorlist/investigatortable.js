import React, { useState } from 'react';
// Bootstrap
import { Col, Row, Dropdown, Pagination } from 'react-bootstrap';

// React Router
import { withRouter } from 'react-router-dom'


// Assets
import arrow from '../../assets/arrow.png';

import './investigatortable.scss'

// Project imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faSearch } from '@fortawesome/free-solid-svg-icons'

// Axios
import axios from 'axios';
import environment from '../../environment.json';

// React Select
import Select from 'react-select';


// Loading overlay
import LoadingOverlay from 'react-loading-overlay';

// Project Imports
import InspirePagination from '../shared/pagination'
import SearchHeader, { SEARCH_HEADER } from '../shared/searchheader'


const FILTERING = {
  FIRST_NAME: 'first_name',
  LAST_NAME: 'last_name',
  SPECIALITIES: 'prop_specialties',
  FOCUS_AREA: 'focus_areas_reasearch_interests',
  CITY: 'city',
  COUNTRY: 'country',
  PUBLICATIONS: 'number_linked_publications',
  EVENTS: 'number_linked_events',
  CT: 'number_linked_clinical_trials',
  COI: 'number_linked_institutions_coi',
  SCORE: 'mesh_counter',
}

class InvestigatorTable extends React.Component {

  constructor(props) {
    super(props)
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
      filtering : {
        firstName: '',
        lastName: '', 
        specialties: '',
        focusArea: '',
        city: '',
        country: '',
        publications: '',
        events: '',
        ct: '',
        coi: '',
        score: ''
      }

    }

    this.typingTimeout = undefined
    this.projectOid = undefined
  }

  async loadInvestigators(page = 1, meshOid = undefined, filtering = undefined){
    try{
      this.setState({isLoading: true})
      const { match: { params } } = this.props;
      const projectOid = params.id;
      const { take, limit } = this.state;

      // Request investigators
      let skip = this.state.take * (page-1);
      let offset = this.state.take * (page -1);
      const token = localStorage.getItem('token')
      let urlParams = `project=${projectOid}&limit=${limit}&offset=${offset}&skip=${skip}&take=${take}`
      if( meshOid !== undefined ){
        urlParams = `${urlParams}&mesh=${meshOid}`;
      }

      // Add filtering
      if( filtering !== undefined ){
        if( filtering.firstName !== '' )
          urlParams = `${urlParams}&${FILTERING.FIRST_NAME}=${filtering.firstName}`;        
        if( filtering.lastName !== '' )
          urlParams = `${urlParams}&${FILTERING.LAST_NAME}=${filtering.lastName}`;        
        if( filtering.specialties !== '' )
          urlParams = `${urlParams}&${FILTERING.SPECIALITIES}=${filtering.specialties}`;        
        if( filtering.focusArea !== '' )
          urlParams = `${urlParams}&${FILTERING.FOCUS_AREA}=${filtering.focusArea}`;        
        if( filtering.city !== '' )
          urlParams = `${urlParams}&${FILTERING.CITY}=${filtering.city}`;        
        if( filtering.country !== '' )
          urlParams = `${urlParams}&${FILTERING.COUNTRY}=${filtering.country}`;        
        if( filtering.publications !== '' )
          urlParams = `${urlParams}&${FILTERING.PUBLICATIONS}=${filtering.publications}`;        
        if( filtering.events !== '' )
          urlParams = `${urlParams}&${FILTERING.EVENTS}=${filtering.events}`;
        if( filtering.ct !== '' )
          urlParams = `${urlParams}&${FILTERING.CT}=${filtering.ct}`;        
        if( filtering.coi !== '' )
          urlParams = `${urlParams}&${FILTERING.COI}=${filtering.coi}`;        
        if( filtering.score !== '' )
          urlParams = `${urlParams}&${FILTERING.SCORE}=${filtering.score}`;        
      }


      // Perform request
      const response = await axios.get(`${environment.base_url}/api/investigators/?${urlParams}`,
        { headers: { "Authorization": "jwt " + token }
      })


      const totalPage = Math.ceil(response.data.count / take);

      clearTimeout(this.typingTimeout);
      this.setState({
        investigatorList: response.data.results, 
        projectOid: projectOid,
        currentPage: page,
        totalPage: totalPage,
        meshOid: meshOid,
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

  navigatePage(page) {
    this.loadInvestigators(page)
  }

  componentDidMount(){
    this.loadInvestigators()
  }

  async loadMesh(pattern){
    try{
      this.setState({isLoadingMesh: true})

      const token = localStorage.getItem('token')
      const response = await axios.get(`${environment.base_url}/api/meshs/?limit=10&ordering=name&name=${pattern}`,
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
      setTimeout(function () {that.loadMesh(pattern);}, 2000)
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


    this.loadInvestigators(currentPage, meshOid)
  }

  loadFilteredInvestigators(key, value){
    let { currentPage, meshOid, filtering } = this.state;
    if( key === FILTERING.FIRST_NAME ){
      filtering.firstName = value;
    }else if( key === FILTERING.LAST_NAME ){
      filtering.lastName = value;
    }else if( key === FILTERING.SPECIALITIES ){
      filtering.specialties = value;
    }else if( key === FILTERING.FOCUS_AREA ){
      filtering.focusArea = value;
    }else if( key === FILTERING.CITY ){
      filtering.city = value;
    }else if( key === FILTERING.COUNTRY ){
      filtering.city = value;
    }else if( key === FILTERING.PUBLICATIONS ){
      filtering.publications = value;
    }else if( key === FILTERING.EVENTS ){
      filtering.events = value;
    }else if( key === FILTERING.CT ){
      filtering.ct = value;
    }else if( key === FILTERING.COI ){
      filtering.coi = value;
    }else if( key === FILTERING.SCORE ){
      filtering.score = value;
    }


    // Clear timeout
    const that = this;
    if ( this.typingTimeout ) {
      clearTimeout(this.typingTimeout);
    }
    this.typingTimeout = 
      setTimeout(function () { that.loadInvestigators(currentPage, meshOid, filtering) }, 2000)
    
  }

  render() {
    const { currentPage, totalPage, meshOptions } = this.state;
    const headers = [
      'Profile', 'FirstName', 'LastName', 'Specialties',
      'FocusArea', 'City', 'Country', 'P', 'E', 'CT', 'CoI'
    ]

    const { reloaded } = this.props;

    return (
      <Row style={{ padding: 0, margin: 0 }}>
        <Col sm={12} style={{
          backgroundColor: 'white', border: '1px solid',
          borderColor: 'transparent #dee2e6 #dee2e6 #dee2e6', borderRadius: '0 .25rem 0 .25rem',
          minHeight: '50vh', padding: '2em', overflow: 'hidden'
        }}>

        <div className="d-flex justify-content-end pt-3 pb-3">
          <div style={{ width: '40%'}}>
          <Select isLoading={this.state.isLoadingMesh} isClearable 
                isSearchable options={meshOptions} 
                onInputChange={(e) => this.onMeshFill(e)} 
                onChange={ (e) => this.onMeshSelected(e)}
                />
          </div>
        </div>          

        <LoadingOverlay
          active={ this.state.isLoading }
          spinner>

          <table className="w-100" style={{ display: 'block', minHeight: '200px'}}>
            <thead>
              <tr>
                <td style={{ cursor: 'pointer'}} style={{ width: '50px'}}>
                  <FontAwesomeIcon icon={faStar} style={{ border: '1px solid grey', fontSize: '2em', color: 'grey' }} />
                </td>
                <td className="text-center" style={{ width: '50px' }}>Profile</td>
                <td className="text-center" style={{ width: '50px' }}>FirstName</td>
                <td className="text-center" style={{ width: '50px' }}>LastName</td>
                <td className="text-center" style={{ width: '50px' }}>Specialties</td>
                <td className="text-center" style={{ width: '50px' }}>FocusArea</td>
                <td className="text-center" style={{ width: '50px' }}>City</td>
                <td className="text-center" style={{ width: '50px' }}>Country</td>
                <td className="text-center" style={{ width: '50px' }}>P</td>
                <td className="text-center" style={{ width: '50px' }}>E</td>
                <td className="text-center" style={{ width: '50px' }}>CT</td>
                <td className="text-center" style={{ width: '50px' }}>Col</td>
                <td className="text-center" style={{ width: '50px' }}>Score</td>
              </tr>
              <tr style={{ border: '1px solid grey', borderWidth: '1px 0px 2px 0px' }}>
                <td></td>
                <td></td>
                <td><SearchHeader 
                      onChange={(pattern) => this.loadFilteredInvestigators(FILTERING.FIRST_NAME, pattern)}
                      type={SEARCH_HEADER.TEXT} /></td>
                <td><SearchHeader 
                      onChange={(pattern) => this.loadFilteredInvestigators(FILTERING.LAST_NAME, pattern)}
                      type={SEARCH_HEADER.TEXT} /></td>
                <td><SearchHeader 
                      onChange={(pattern) => this.loadFilteredInvestigators(FILTERING.SPECIALITIES, pattern)}
                      type={SEARCH_HEADER.TEXT} /></td>
                <td><SearchHeader 
                      onChange={(pattern) => this.loadFilteredInvestigators(FILTERING.FOCUS_AREA, pattern)}
                      type={SEARCH_HEADER.TEXT} /></td>
                <td><SearchHeader 
                      onChange={(pattern) => this.loadFilteredInvestigators(FILTERING.CITY, pattern)}
                      type={SEARCH_HEADER.TEXT} /></td>
                <td><SearchHeader 
                      onChange={(pattern) => this.loadFilteredInvestigators(FILTERING.COUNTRY, pattern)}
                      type={SEARCH_HEADER.TEXT} /></td>
                <td><SearchHeader 
                      onChange={(pattern) => this.loadFilteredInvestigators(FILTERING.PUBLICATIONS, pattern)}
                      type={SEARCH_HEADER.NUMBER} /></td>
                <td><SearchHeader 
                      onChange={(pattern) => this.loadFilteredInvestigators(FILTERING.EVENTS, pattern)}
                      type={SEARCH_HEADER.NUMBER} /></td>
                <td><SearchHeader 
                      onChange={(pattern) => this.loadFilteredInvestigators(FILTERING.CT, pattern)}
                      type={SEARCH_HEADER.NUMBER} /></td>
                <td><SearchHeader 
                      onChange={(pattern) => this.loadFilteredInvestigators(FILTERING.COI, pattern)}
                      type={SEARCH_HEADER.NUMBER} /></td>
                <td></td>
              </tr>
            </thead>

            <tbody>
              {this.state.investigatorList.map((item, id) =>
                <tr key={id}>
                  <td style={{ cursor: 'pointer' }}>
                    <FontAwesomeIcon icon={faStar} style={{ border: '1px solid grey', fontSize: '2em', color: 'grey' }} />
                  </td>
                  <td>
                    <img src={arrow} width="40"
                      onClick={(e) => this.props.history.push(`${reloaded?'/reloaded':''}/project/${this.state.projectOid}/investigator/${item.oid}`)}
                      style={{ cursor: 'pointer' }}></img>
                  </td>
                  <td className="text-center">{item.first_name}</td>
                  <td className="text-center">{item.last_name}</td>
                  <td className="text-center">{item.prop_specialties}</td>
                  <td className="text-center">{item.focus_areas_reasearch_interests}</td>
                  <td className="text-center">{item.city}</td>
                  <td className="text-center">{item.country}</td>
                  <td className="text-center">{item.number_linked_publications}</td>
                  <td className="text-center">{item.number_linked_events}</td>
                  <td className="text-center">{item.number_linked_clinical_trials}</td>
                  <td className="text-center">{item.number_linked_institutions_coi}</td>
                  <td className="text-center">{item.mesh_counter}</td>
                </tr>
              )}
            </tbody>
          </table>
          </LoadingOverlay>


          <InspirePagination currentPage={currentPage} totalPage={totalPage} onClick={this.navigatePage.bind(this)}/>


        </Col>
      </Row>

    );
  }

}



export default withRouter(InvestigatorTable);
