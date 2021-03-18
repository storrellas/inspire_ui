import React, { useState } from 'react';
// Bootstrap
import { Col, Row, Dropdown, Pagination } from 'react-bootstrap';

// React Router
import { withRouter } from 'react-router-dom'


// Assets
import arrow from '../../assets/arrow.png';

import './investigatortable.scss'

// EllipsisWithTooltip
import EllipsisWithTooltip from 'react-ellipsis-with-tooltip'

// Project imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faLongArrowAltUp, faLongArrowAltDown } from '@fortawesome/free-solid-svg-icons'

// Axios
import axios from 'axios';

// React Select
import Select from 'react-select';


// Loading overlay
import LoadingOverlay from 'react-loading-overlay';

// Project Imports
import InspirePagination from '../shared/pagination'
import SearchHeader, { SEARCH_HEADER } from '../shared/searchheader'

const FILTERING = [
  { 
    dataField:'first_name', caption: 'firstName', 
    label: 'First Name', type: SEARCH_HEADER.TEXT 
  },
  { 
    dataField:'last_name', caption: 'lastName', 
    label: 'Last Name', type: SEARCH_HEADER.TEXT 
  },
  { 
    dataField:'prop_specialties', caption: 'specialties', 
    label: 'Specialties', type: SEARCH_HEADER.TEXT 
  },
  { 
    dataField:'focus_areas_reasearch_interests', caption: 'focusArea', 
    label: 'Focus Area', type: SEARCH_HEADER.TEXT 
  },
  { 
    dataField:'city', caption: 'city', 
    label: 'City', type: SEARCH_HEADER.TEXT 
  },
  { 
    dataField:'country', caption: 'country', 
    label: 'Country', type: SEARCH_HEADER.NUMBER 
  },
  { 
    dataField:'number_linked_publications', caption: 'publications', 
    label: 'P', type: SEARCH_HEADER.NUMBER 
  },
  { 
    dataField:'number_linked_events', caption: 'events', 
    label: 'E', type: SEARCH_HEADER.NUMBER 
  },
  { 
    dataField:'number_linked_clinical_trials', caption: 'ct', 
    label: 'CT', type: SEARCH_HEADER.NUMBER 
  },
  { 
    dataField:'number_linked_institutions_coi', caption: 'coi', 
    label: 'COI', type: SEARCH_HEADER.NUMBER 
  },
  { 
    dataField:'mesh_counter', caption: 'score', 
    label: 'Score', type: SEARCH_HEADER.TEXT 
  },
]


class InvestigatorTable extends React.Component {

  constructor(props) {
    super(props)

    const filteringList = FILTERING.reduce((acc,curr)=> (acc[curr.caption]='',acc),{});    
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
      sorting: ''
    }


    this.typingTimeout = undefined
    this.projectOid = undefined
  }

  async loadInvestigators(page = 1){
    try{
      this.setState({isLoading: true})
      const { match: { params } } = this.props;
      const projectOid = params.id;
      const { take, limit, sorting, meshOid, filtering } = this.state;

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

      // Perform request
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/investigators/?${urlParams}`,
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
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/meshs/?limit=10&ordering=name&name=${pattern}`,
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

  render() {
    const { currentPage, totalPage, meshOptions, sorting } = this.state;
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

          <table className="w-100" style={{ display: 'block', minHeight: '200px', fontSize: '14px'}}>
            <thead>
              <tr>
                <td style={{ cursor: 'pointer'}} style={{ width: '50px'}}>
                  <FontAwesomeIcon icon={faStar} style={{ border: '1px solid grey', fontSize: '2em', color: 'grey' }} />
                </td>
                <td className="text-center" style={{ width: '50px' }}>Profile</td>
                {FILTERING.map((item, id) =>
                  <td key={id} className="text-center" style={{ cursor: 'pointer'}} 
                    onClick={(e) => this.onSetSorting(item.dataField)}>
                    {item.label}
                    <FontAwesomeIcon icon={faLongArrowAltUp} className={sorting==item.dataField?"ml-1":"ml-1 d-none"} style={{ color: 'grey' }} />
                    <FontAwesomeIcon icon={faLongArrowAltDown} className={sorting==`-${item.dataField}`?"ml-1":"ml-1 d-none"} style={{ color: 'grey' }} />
                </td>
                )}
              </tr>
              <tr style={{ border: '1px solid grey', borderWidth: '1px 0px 2px 0px' }}>
                <td></td>
                <td></td>

                {FILTERING.map((item, id) =>
                <td key={id}>
                  <SearchHeader 
                    onChange={(pattern) => this.loadFilteredInvestigators(item.caption, pattern)} 
                    type={item.type} />
                </td>
                )}
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
                      onClick={(e) => this.props.history.push(`${reloaded?'/reloaded/dashboard':''}/project/${this.state.projectOid}/investigator/${item.oid}`)}
                      style={{ cursor: 'pointer' }}></img>
                  </td>

                  <td className="text-center" 
                        style={{ width: '20%'}}>{item.first_name}</td>
                  <td className="text-center" 
                        style={{ width: '20%'}}>{item.last_name}</td>
                  <td className="text-center" 
                        style={{ width: '20%'}}>
                          <EllipsisWithTooltip placement="bottom" style={{ width: '150px'}}>
                          {item.prop_specialties || ''}
                          </EllipsisWithTooltip>
                  </td>
                  <td className="text-center" 
                        style={{ width: '20%'}}>
                        <EllipsisWithTooltip placement="bottom" style={{ width: '150px'}}>
                          {item.focus_areas_reasearch_interests || ''}
                        </EllipsisWithTooltip>
                  </td>
                  <td className="text-center" 
                        style={{ width: '20%'}}>{item.city}</td>
                  <td className="text-center" 
                        style={{ width: '20%'}}>{item.country}</td>
                  <td className="text-center" 
                        style={{ width: '20%'}}>{item.number_linked_publications}</td>
                  <td className="text-center" 
                        style={{ width: '20%'}}>{item.number_linked_events}</td>
                  <td className="text-center" 
                        style={{ width: '20%'}}>{item.number_linked_clinical_trials}</td>
                  <td className="text-center" 
                        style={{ width: '20%'}}>{item.number_linked_institutions_coi}</td>
                  <td className="text-center" 
                        style={{ width: '20%'}}>{item.mesh_counter}</td>

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
