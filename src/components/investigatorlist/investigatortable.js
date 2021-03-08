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

// Project Imports
import InspirePagination from '../shared/pagination'

// Loading overlay
import LoadingOverlay from 'react-loading-overlay';

// const SearchHeader = (props) => {

//   const [show, setShow] = useState(false);

//   function handleOpen(e) {
//     e.preventDefault();
//     setShow(true);
//   }

//   function handleClose(e) {
//     e.preventDefault();
//     setShow(false);
//   }
//   return (
//     <div className="text-right" style={{ cursor: 'pointer' }}>
//       <Dropdown
//         onMouseEnter={(e) => handleOpen(e)}
//         onMouseLeave={(e) => handleClose(e)}
//         show={show}>
//         <Dropdown.Toggle variant="success" id="dropdown-basic" style={{ backgroundColor: 'transparent', border: 0, boxShadow: 'none' }}>
//           <FontAwesomeIcon icon={faSearch} style={{ fontSize: '1em', color: 'grey' }} />
          
//         </Dropdown.Toggle>
//         <Dropdown.Menu>
//           <Dropdown.Item href="#/action-1">Project1</Dropdown.Item>
//           <Dropdown.Item href="#/action-1">Project2</Dropdown.Item>
//           <Dropdown.Item href="#/action-1">Project3</Dropdown.Item>
//           <Dropdown.Item href="#/action-1">Project4</Dropdown.Item>
//         </Dropdown.Menu>
//       </Dropdown>
//     </div>
//   );
// }


const SearchHeader = (props) => {

  // Declare a new state variable, which we'll call "count"
  const [active, setActive] = useState(false);

  return (
    <div>
      <div className="d-flex align-items-center pl-2 border-test" style={{ position: 'relative', cursor: 'pointer' }}>            
        <input className="inspire-table-search" 
                onChange={(e) => props.onChange(e.target.value)} 
                onMouseEnter={(e) => setActive(true)}
                onMouseLeave={(e) => setActive(false)}></input>
        <FontAwesomeIcon icon={faSearch} style={{ fontSize: '1em', color: 'grey' }} />
      </div>
      <div className={active?"inspire-table-search-border active":"inspire-table-search-border"}></div>
    </div>
  );
}

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
        firstName: undefined,
        lastName: undefined, 
        specialties: undefined,
        focusArea: undefined,
        city: undefined,
        country: undefined,
        publications: undefined,
        events: undefined,
        ct: undefined,
        coi: undefined,
        score: undefined
      }

    }

    this.typingTimeout = undefined
  }

  async loadInvestigators(page = 1, meshOid = undefined){
    try{
      this.setState({isLoading: true})
      const { match: { params } } = this.props;
      const projectOid = params.id;
      const { take, limit } = this.state;

      // Request investigators
      let skip = this.state.take * (this.state.currentPage-1);
      let offset = this.state.take * (this.state.currentPage -1);
      const token = localStorage.getItem('token')
      let urlParams = `project=${projectOid}&limit=${limit}&offset=${offset}&skip=${skip}&take=${take}`
      if( meshOid !== undefined ){
        urlParams = `${urlParams}&mesh=${meshOid}`;
      }
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
    console.log("loadFilteredInvestigators ", key, value)


  }

  render() {
    const { currentPage, totalPage, meshOptions } = this.state;
    const headers = [
      'Profile', 'FirstName', 'LastName', 'Specialties',
      'FocusArea', 'City', 'Country', 'P', 'E', 'CT', 'CoI'
    ]

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
                <td style={{ cursor: 'pointer'}}>
                  <FontAwesomeIcon icon={faStar} style={{ border: '1px solid grey', fontSize: '2em', color: 'grey' }} />
                </td>
                <td className="text-center">Profile</td>
                <td className="text-center">FirstName</td>
                <td className="text-center">LastName</td>
                <td className="text-center">Specialties</td>
                <td className="text-center">FocusArea</td>
                <td className="text-center">City</td>
                <td className="text-center">Country</td>
                <td className="text-center">P</td>
                <td className="text-center">E</td>
                <td className="text-center">CT</td>
                <td className="text-center">Col</td>
                <td className="text-center">Score</td>
              </tr>
              <tr style={{ border: '1px solid grey', borderWidth: '1px 0px 2px 0px' }}>
                <td></td>
                <td></td>
                <td><SearchHeader 
                      onChange={(pattern) => this.loadFilteredInvestigators(FILTERING.FIRST_NAME, pattern)}/></td>
                <td><SearchHeader 
                      onChange={(pattern) => this.loadFilteredInvestigators(FILTERING.LAST_NAME, pattern)}/></td>
                <td><SearchHeader 
                      onChange={(pattern) => this.loadFilteredInvestigators(FILTERING.SPECIALITIES, pattern)}/></td>
                <td><SearchHeader 
                      onChange={(pattern) => this.loadFilteredInvestigators(FILTERING.FOCUS_AREA, pattern)}/></td>
                <td><SearchHeader 
                      onChange={(pattern) => this.loadFilteredInvestigators(FILTERING.CITY, pattern)}/></td>
                <td><SearchHeader 
                      onChange={(pattern) => this.loadFilteredInvestigators(FILTERING.COUNTRY, pattern)}/></td>
                <td><SearchHeader 
                      onChange={(pattern) => this.loadFilteredInvestigators(FILTERING.PUBLICATIONS, pattern)}/></td>
                <td><SearchHeader 
                      onChange={(pattern) => this.loadFilteredInvestigators(FILTERING.EVENTS, pattern)}/></td>
                <td><SearchHeader 
                      onChange={(pattern) => this.loadFilteredInvestigators(FILTERING.CT, pattern)}/></td>
                <td><SearchHeader 
                      onChange={(pattern) => this.loadFilteredInvestigators(FILTERING.COI, pattern)}/></td>
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
                      onClick={(e) => this.props.history.push(`/project/${this.props.projectOid}/investigator/${item.oid}`)}
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
