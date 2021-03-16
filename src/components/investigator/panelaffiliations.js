import React from 'react';
// Bootstrap
import { Modal, Button } from 'react-bootstrap';

// React Router
import { withRouter } from 'react-router-dom'

// Loading overlay
import LoadingOverlay from 'react-loading-overlay';

// EllipsisWithTooltip
import EllipsisWithTooltip from 'react-ellipsis-with-tooltip'

// Axios
import axios from 'axios';
import environment from '../../environment.json';

// Project Imports
import InspirePagination from '../shared/pagination'
import SearchHeader, { SEARCH_HEADER } from '../shared/searchheader'

const FILTERING = [
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


class PanelAffiliations extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      showModalUniversities: false,
      showModalHospitals: false,
      showModalAssociations: false,
      modalTitle: '',
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
      filtering : {
        position: '',
        name: '',
        department: '', 
        subtype: '',
        pastPosition: '',
        year: '',
        city: '',
        country: '',
      }
    }
  }

  closeModal(){
    this.setState({
      showModalUniversities: false,
      showModalHospitals: false,
      showModalAssociations: false
    })
  }

  async retrieveAffiliations() {
    try{

      const token = localStorage.getItem('token')

      // Perform request
      const url = `${environment.base_url}/api/investigator/${this.state.investigatorId}/affiliations-per-institution-type/`
      const response = await axios.get(url,
        { headers: { "Authorization": "jwt " + token }
      })

      // Chart data
      this.setState({affiliations: response.data.results})

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

  async retrieveAffiliationsUniversities(page = 1, filtering = undefined) {
    try{
      this.setState({isLoading: true})

      const token = localStorage.getItem('token')
      const { take, limit } = this.state;

      // Perform request
      let skip = this.state.take * (page-1);
      let offset = this.state.take * (page-1);
      let urlParams = `limit=${limit}&offset=${offset}&skip=${skip}&take=${take}`

      // Add filtering
      if( filtering !== undefined ){
        for(const item of FILTERING ){
          if( filtering[item.caption] !== '' ){
            urlParams = `${urlParams}&${item.dataField}=${filtering[item.caption]}`;
          }
        }      
      }

      const url = `${environment.base_url}/api/investigator/${this.state.investigatorId}/affiliations-universities/?${urlParams}`
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

  async retrieveAffiliationsHospitals(page = 1, filtering = undefined) {
    try{
      this.setState({isLoading: true})

      const token = localStorage.getItem('token')
      const { take, limit } = this.state;

      // Perform request
      let skip = this.state.take * (page-1);
      let offset = this.state.take * (page-1);
      let urlParams = `limit=${limit}&offset=${offset}&skip=${skip}&take=${take}`

      // Add filtering
      if( filtering !== undefined ){
        for(const item of FILTERING ){
          if( filtering[item.caption] !== '' ){
            urlParams = `${urlParams}&${item.dataField}=${filtering[item.caption]}`;
          }
        }      
      }

      const url = `${environment.base_url}/api/investigator/${this.state.investigatorId}/affiliations-hospitals/?${urlParams}`
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

  async retrieveAffiliationsAssociations(page = 1, filtering = undefined) {
    try{
      this.setState({isLoading: true})

      const token = localStorage.getItem('token')
      const { take, limit } = this.state;

      // Perform request
      let skip = this.state.take * (page-1);
      let offset = this.state.take * (page-1);
      let urlParams = `limit=${limit}&offset=${offset}&skip=${skip}&take=${take}`

      // Add filtering
      if( filtering !== undefined ){
        for(const item of FILTERING ){
          if( filtering[item.caption] !== '' ){
            urlParams = `${urlParams}&${item.dataField}=${filtering[item.caption]}`;
          }
        }      
      }

      const url = `${environment.base_url}/api/investigator/${this.state.investigatorId}/affiliations-associations/?${urlParams}`
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

  showModalUniversities(){
    this.setState({
      showModalUniversities: true, 
      modalTitle: 'Affiliations - Universities',
      currentPage: 1,
      totalPage: 10,
      take: 10,
      limit: 10,
      isLoading: false,
    })
    this.retrieveAffiliationsUniversities(1) 
  }

  
  showModalHospitals(){
    this.setState({
      showModalHospitals: true, 
      modalTitle: 'Affiliations - Hospitals',
      currentPage: 1,
      totalPage: 10,
      take: 10,
      limit: 10,
      isLoading: false,
    })
    this.retrieveAffiliationsHospitals(1) 
  }

  showModalAssociations(){
    this.setState({
      showModalAssociations: true, 
      modalTitle: 'Affiliations - Associations',
      currentPage: 1,
      totalPage: 10,
      take: 10,
      limit: 10,
      isLoading: false,
    })
    this.retrieveAffiliationsAssociations(1) 
  }

  retrieveAffiliationsFiltered(key, value){
    
    let { currentPage, filtering } = this.state;
    for(const candidate_item of FILTERING ){
      if( key === candidate_item.caption ){
        filtering[candidate_item.caption] = value
      }
    }

    // Clear timeout
    const that = this;
    if ( this.typingTimeout ) {
      clearTimeout(this.typingTimeout);
    }
    this.typingTimeout = 
      setTimeout(function () { 
        if( that.state.showModalUniversities ){
          that.retrieveAffiliationsUniversities(currentPage, filtering) 
        }else if( that.state.showModalHospitals ){
          that.retrieveAffiliationsHospitals(currentPage, filtering) 
        }else if( that.state.showModalAssociations ){
          that.retrieveAffiliationsAssociations(currentPage, filtering) 
        }
      }, 2000)

  }

  componentDidMount(){

    const { match: { params } } = this.props;
    this.state.investigatorId = params.subid;
    this.state.investigatorId = this.state.investigatorId.split('-')[this.state.investigatorId.split('-').length -1 ]
    this.state.investigatorId = parseInt( this.state.investigatorId )

    this.retrieveAffiliations()
  }  

  navigatePage(page) {
    if( this.state.showModalUniversities ){
      this.retrieveAffiliationsUniversities(page) 
    }else if( this.state.showModalHospitals ){
      this.retrieveAffiliationsHospitals(page) 
    }else if( this.state.showModalAssociations ){
      this.retrieveAffiliationsAssociations(page) 
    }
    
  }

  render() {

    const { affiliations, modalTitle, dataTable } = this.state;
    const { currentPage, totalPage} = this.state;

    let nUniversities = "-";
    let nHospitals = "-";
    let nAssociations = "-";
    if( affiliations ){
      nUniversities = affiliations.filter(x => x.affiliation_type === 'universities')[0].total
      nHospitals = affiliations.filter(x => x.affiliation_type === 'hospitals')[0].total
      nAssociations = affiliations.filter(x => x.affiliation_type === 'associations')[0].total
    }

    return (
      <div>
        <div className="d-flex" style={{ margin: '0 0.2em 0 0.2em'}}>
          <div className="text-center" style={{ width: '33%', margin: '1em 0.2em 1em 0.2em', border: '1px solid #4780c4' }}>
            <img className="w-100" src="https://demo.explicatos.com/img/icons_37_37_px-13.png" alt=" "></img>
            <div>{nUniversities}</div>
            <div style={{ padding: '0.4em'}}>
              <button className="btn btn-primary" style={{ width: '80%', backgroundColor: '#4780c4', fontSize: '14px'  }}
                onClick={ (e) => this.showModalUniversities()}>
                Universities
              </button>
            </div>
          </div>
          <div className="text-center" style={{ width: '33%', margin: '1em 0.2em 1em 0.2em', border: '1px solid #4780c4'  }}>
            <img className="w-100" src="https://demo.explicatos.com/img/icons_37_37_px-14.png" alt=" "></img>
            <div>{nHospitals}</div>
            <div style={{ padding: '0.4em'}}>
              <button className="btn btn-primary" style={{ width: '80%', backgroundColor: '#4780c4', fontSize: '14px' }}
                onClick={ (e) => this.showModalHospitals()}>
                Hospitals
              </button>
            </div>
          </div>
          <div className="text-center" style={{ width: '33%', margin: '1em 0.2em 1em 0.2em', border: '1px solid #4780c4'  }}>
            <img className="w-100" src="https://demo.explicatos.com/img/icons_37_37_px-12.png" alt=" "></img>
            <div>{nAssociations}</div>
            <div style={{ padding: '0.2em'}}>
              <button className="btn btn-primary" style={{ width: '80%', backgroundColor: '#4780c4', fontSize: '14px'  }}
                onClick={ (e) => this.showModalAssociations()}>
                  Associations
              </button>
            </div>
          </div>
        </div>

        <Modal animation centered
          show={this.state.showModalAssociations || this.state.showModalHospitals || this.state.showModalUniversities}
          onHide={(e) => this.closeModal(e)}
          dialogClassName="affiliations-modal">
          <Modal.Header closeButton>
            <Modal.Title>{modalTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body  style={{ overflowY: 'scroll', height: '100%'}}>
            <div className="p-3 h-100" style={{ fontSize: '14px'}}>
                <LoadingOverlay
                    active={ this.state.isLoading }
                    spinner>
                <table className="w-100">
                  <thead>
                    <tr>
                      {FILTERING.map((item, id) =>
                        <td key={id} className="text-center">{item.label}</td>
                      )}
                    </tr>
                    <tr style={{ border: '1px solid grey', borderWidth: '1px 0px 2px 0px' }}>
                      {FILTERING.map((item, id) =>
                        <td key={id} className="text-center">
                          <SearchHeader 
                            onChange={(pattern) => this.retrieveAffiliationsFiltered(item.caption, pattern)} 
                            type={item.type} />
                        </td>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {dataTable.map((item, id) =>
                      <tr key={id}>
                        <td  className="text-center" style={{ width: '10%'}}>{item.position__name}</td>
                        <td  className="text-center" style={{ width: '200px'}}>
                          <EllipsisWithTooltip placement="bottom" style={{ width: '300px'}}>
                          {item.institution__parent_name}
                          </EllipsisWithTooltip>
                        </td>
                        <td  className="text-center" style={{ width: '20%'}}>
                          <EllipsisWithTooltip placement="bottom" style={{ width: '100px'}}>
                          {item.institution__department}
                          </EllipsisWithTooltip>
                        </td>
                        <td  className="text-center" style={{ width: '20%'}}>{item.institution__institution_subtype__name}</td>
                        <td  className="text-center" style={{ width: '10%'}}>{item.past_position}</td>
                        <td  className="text-center" style={{ width: '10%'}}>{item.year}</td>
                        <td  className="text-center" style={{ width: '10%'}}>{item.institution__city}</td>
                        <td  className="text-center" style={{ width: '10%'}}>{item.institution__country__name}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
                </LoadingOverlay>
                <InspirePagination currentPage={currentPage} totalPage={totalPage} onClick={this.navigatePage.bind(this)}/>

            </div>
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

export default withRouter(PanelAffiliations);
