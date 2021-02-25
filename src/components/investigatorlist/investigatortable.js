import React, { useState } from 'react';
// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

import { Dropdown } from 'react-bootstrap';
import { withRouter } from 'react-router-dom'

// Styles
//import "./dashboard.scss"
// Assets
import arrow from '../../assets/arrow.png';

// Project imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faStar, faSearch } from '@fortawesome/free-solid-svg-icons'


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

const InvestigatorTable = (props) => {

  return (
    <div style={{
      backgroundColor: 'white', border: '1px solid',
      borderColor: 'transparent #dee2e6 #dee2e6 #dee2e6', borderRadius: '0 .25rem 0 .25rem',
      minHeight: '50vh', padding: '2em'
    }}>
      <div className="w-100">
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
            {props.data.map((item, id) =>
              <tr key={id}>
                <td style={{ cursor: 'pointer' }}>
                  <FontAwesomeIcon icon={faStar} style={{ border: '1px solid grey', fontSize: '2em', color: 'grey' }} />
                </td>
                <td>
                  <img src={arrow} width="40" 
                        onClick={(e) => props.history.push('/project/123/investigator/123')}
                        style={{ cursor: 'pointer' }}></img>
                </td>
                <td>{item.firstName}</td>
                <td>{item.lastName}</td>
                <td>{item.specialties}</td>
                <td>{item.focusArea}</td>
                <td>{item.city}</td>
                <td>{item.country}</td>
                <td>{item.publications}</td>
                <td>{item.experiments}</td>
                <td>{item.clinicalTrials}</td>
                <td>{item.conflicOfInterest}</td>
                <td></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}



export default withRouter(InvestigatorTable);
