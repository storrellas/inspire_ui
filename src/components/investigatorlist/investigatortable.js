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

// Project Imports
import InspirePagination from '../shared/pagination'

const SearchHeader = (props) => {

  const [show, setShow] = useState(false);

  function handleOpen(e) {
    e.preventDefault();
    setShow(true);
  }

  function handleClose(e) {
    e.preventDefault();
    setShow(false);
  }
  return (
    <div className="text-right" style={{ cursor: 'pointer' }}>
      <Dropdown
        onMouseEnter={(e) => handleOpen(e)}
        onMouseLeave={(e) => handleClose(e)}
        show={show}>
        <Dropdown.Toggle variant="success" id="dropdown-basic" style={{ backgroundColor: 'transparent', border: 0, boxShadow: 'none' }}>
          <FontAwesomeIcon icon={faSearch} style={{ fontSize: '1em', color: 'grey' }} />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item href="#/action-1">Project1</Dropdown.Item>
          <Dropdown.Item href="#/action-1">Project2</Dropdown.Item>
          <Dropdown.Item href="#/action-1">Project3</Dropdown.Item>
          <Dropdown.Item href="#/action-1">Project4</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}

class InvestigatorTable extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      currentPage: 1,
      totalPage: 10,
      take: 100,
      limit: 100,
      investigatorList: []
    }
  }

  async loadInvestigators(page){
    try{
      const { match: { params } } = this.props;
      const projectOid = params.id;
      const { take, limit } = this.state;

      // Request investigators
      let skip = this.state.take * this.state.currentPage;
      let offset = this.state.take * this.state.currentPage;
      const token = localStorage.getItem('token')
      const urlParams = `project=${projectOid}&limit=${limit}&offset=${offset}&skip=${skip}&take=${take}`
      const response = await axios.get(`${environment.base_url}/api/investigators/?${urlParams}`,
        { headers: { "Authorization": "jwt " + token }
      })

      const totalPage = Math.ceil(response.data.count / take);

      this.setState({
        investigatorList: response.data.results, 
        projectOid: projectOid,
        currentPage: page,
        totalPage: totalPage
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
    // Load Investigators
    this.loadInvestigators(this.state.currentPage)
  }

  render() {
    const { currentPage, totalPage } = this.state;

    return (
      <Row style={{ padding: 0, margin: 0 }}>
        <Col sm={12} style={{
          backgroundColor: 'white', border: '1px solid',
          borderColor: 'transparent #dee2e6 #dee2e6 #dee2e6', borderRadius: '0 .25rem 0 .25rem',
          minHeight: '50vh', padding: '2em', overflow: 'hidden'
        }}>

          <table className="w-100">
            <thead>
              <tr>
                <td style={{ cursor: 'pointer' }}>
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
                <td><SearchHeader /></td>
                <td><SearchHeader /></td>
                <td><SearchHeader /></td>
                <td><SearchHeader /></td>
                <td><SearchHeader /></td>
                <td><SearchHeader /></td>
                <td><SearchHeader /></td>
                <td><SearchHeader /></td>
                <td><SearchHeader /></td>
                <td><SearchHeader /></td>
                <td><SearchHeader /></td>
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

          {/* <div className="w-100 text-right">
            <div style={{ display: 'inline-block', padding: '1em' }}>
              <Pagination bsPrefix="inspire-pagination">
                <Pagination.First disabled={currentPage === 1}
                  onClick={(e) => this.setState({ currentPage: (currentPage - 1) })} />
                {items}
                <Pagination.Last disabled={currentPage === totalPage}
                  onClick={(e) => this.setState({ currentPage: (currentPage + 1) })} />
              </Pagination>
            </div>
          </div> */}
          <InspirePagination currentPage={currentPage} totalPage={totalPage} onClick={this.navigatePage.bind(this)}/>


        </Col>
      </Row>

    );
  }

}



export default withRouter(InvestigatorTable);
