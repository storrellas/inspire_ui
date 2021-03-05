import React, { useState } from 'react';
// Bootstrap
import { Col, Row, Dropdown } from 'react-bootstrap';

// React Router
import { withRouter } from 'react-router-dom'

// Assets
import arrow from '../../assets/arrow.png';

// React Paginate
import ReactPaginate from 'react-paginate';

import './investigatortable.scss'

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faSearch } from '@fortawesome/free-solid-svg-icons'

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
  constructor(props){
    super(props)
    this.state = {
      pageCount: 10
    }
  }

  pageSelected(e){
    
  }

  render(){
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
              {this.props.investigatorList.map((item, id) =>
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

          <div className="text-right">
            <div style={{ display: 'inline-block'}}>
            <ReactPaginate
              previousLabel={''}
              nextLabel={'next'}
              breakLabel={'...'}
              breakClassName={'break-me'}
              pageCount={this.state.pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              initialPage={3}
              forcePage={3}
              onPageChange={this.handlePageClick}
              containerClassName={'inspire-pagination'}
              subContainerClassName={'pages pagination'}
              activeClassName={'active'}
            />
            </div>
          </div>


        </Col>
      </Row>

    );
  }
}



export default withRouter(InvestigatorTable);
