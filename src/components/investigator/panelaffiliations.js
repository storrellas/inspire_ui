import React from 'react';
// Bootstrap
import { Modal, Button } from 'react-bootstrap';

// React Router
import { withRouter } from 'react-router-dom'

// Loading overlay
import LoadingOverlay from 'react-loading-overlay';

// Axios
import axios from 'axios';
import environment from '../../environment.json';

// Project Imports
import InspirePagination from '../shared/pagination'
import SearchHeader, { SEARCH_HEADER } from '../shared/searchheader'

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
      dataTable: []
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

  async retrieveAffiliationsUniversities(page = 1) {
    try{
      this.setState({isLoading: true})

      const token = localStorage.getItem('token')
      const { take, limit } = this.state;

      // Perform request
      let skip = this.state.take * (page-1);
      let offset = this.state.take * (page-1);
      const urlParams = `limit=${limit}&offset=${offset}&skip=${skip}&take=${take}`
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

  async retrieveAffiliationsHospitals(page = 1) {
    try{
      this.setState({isLoading: true})

      const token = localStorage.getItem('token')
      const { take, limit } = this.state;

      // Perform request
      let skip = this.state.take * (page-1);
      let offset = this.state.take * (page-1);
      const urlParams = `limit=${limit}&offset=${offset}&skip=${skip}&take=${take}`
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

  async retrieveAffiliationsAssociations(page = 1) {
    try{
      this.setState({isLoading: true})

      const token = localStorage.getItem('token')
      const { take, limit } = this.state;

      // Perform request
      let skip = this.state.take * (page-1);
      let offset = this.state.take * (page-1);
      const urlParams = `limit=${limit}&offset=${offset}&skip=${skip}&take=${take}`
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

    const item = {
      position: 'Head of',
      name: 'Klinikum Minden	',
      department: 'Klinik für Neurologie',
      subtype: 'Hospital Department',
      pastPosition: 'Yes',
      year: '1999 - 2005',
      city: 'Hamburg',
      country: 'Germany',
    }
    const data = Array(10).fill(item);


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
          <Modal.Body>
            <div className="p-3 h-100" style={{ overflowY: 'scroll', fontSize: '14px'}}>
                <LoadingOverlay
                    active={ this.state.isLoading }
                    spinner>
                <table className="w-100">
                  <thead>
                    <tr>
                      <td className="text-center">Position</td>
                      <td className="text-center">Name</td>
                      <td className="text-center">Department</td>
                      <td className="text-center">Subtype</td>
                      <td className="text-center">Past Position</td>
                      <td className="text-center">Year</td>
                      <td className="text-center">City</td>
                      <td className="text-center">Country</td>
                    </tr>
                    <tr style={{ border: '1px solid grey', borderWidth: '1px 0px 2px 0px' }}>
                      <td>
                        <SearchHeader onChange={(e) => console.log("event", e)} type={SEARCH_HEADER.TEXT} />
                      </td>
                      <td>
                        <SearchHeader onChange={(e) => console.log("event", e)} type={SEARCH_HEADER.TEXT} />
                      </td>
                      <td>
                        <SearchHeader onChange={(e) => console.log("event", e)} type={SEARCH_HEADER.TEXT} />
                      </td>
                      <td>
                        <SearchHeader onChange={(e) => console.log("event", e)} type={SEARCH_HEADER.TEXT} />
                      </td>
                      <td>
                        <SearchHeader onChange={(e) => console.log("event", e)} type={SEARCH_HEADER.TEXT} />
                      </td>
                      <td>
                        <SearchHeader onChange={(e) => console.log("event", e)} type={SEARCH_HEADER.TEXT} />
                      </td>
                      <td>
                        <SearchHeader onChange={(e) => console.log("event", e)} type={SEARCH_HEADER.TEXT} />
                      </td>
                      <td>
                        <SearchHeader onChange={(e) => console.log("event", e)} type={SEARCH_HEADER.TEXT} />
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    {dataTable.map((item, id) =>
                      <tr key={id}>
                        <td style={{ width: '10%'}}>{item.position__name}</td>
                        <td style={{ width: '20%'}}>{item.institution__parent_name}</td>
                        <td style={{ width: '20%'}}>{item.institution__department}</td>
                        <td style={{ width: '20%'}}>{item.institution__institution_subtype__name}</td>
                        <td style={{ width: '10%'}}>{item.past_position}</td>
                        <td style={{ width: '10%'}}>{item.year}</td>
                        <td style={{ width: '10%'}}>{item.institution__city}</td>
                        <td style={{ width: '10%'}}>{item.institution__country__name}</td>
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
