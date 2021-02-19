import React from 'react';
// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import { Navbar, Nav, NavDropdown, Dropdown } from 'react-bootstrap';


import { withRouter } from 'react-router-dom'

// Styles
import "./dashboard.scss"
// Assets
import inspire_logo from '../assets/logo.png';

// Project imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faSignOut } from '@fortawesome/free-solid-svg-icons'

// Content list

class Dashboard extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
    }
  }


  render() {

    return (
      <Container fluid className='meatze_main'>
        <Navbar variant="dark" className="meatze_navbar navbar">
          <Navbar.Brand href="#home" style={{ height: '100%' }}>
            <img src={inspire_logo} alt="logo" style={{ height: '100%' }}></img>
          </Navbar.Brand>
          <Nav className="ml-auto w-50">
            <Nav.Link href="#home" className='w_33 text-center' >
              <div className="submenu">BITCOIN METRICS</div>
            </Nav.Link>
            <Nav.Link href="#features" className='w_33 text-center'>
              <div className="submenu">PROJECT CONFIGURATION</div>
            </Nav.Link>
            <Nav.Link href="#pricing" className='w_33 text-center'>
              <div className="submenu">POWER MARKETS</div>
            </Nav.Link>


            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic" style={{ backgroundColor: 'transparent', borderColor: 'white' }}>
                <FontAwesomeIcon style={{ color: 'white' }} icon={faUser} />
              </Dropdown.Toggle>

              <Dropdown.Menu align="right">
                <Dropdown.Item href="#/action-1">Sergi Torrellas</Dropdown.Item>
                <Dropdown.Item href="#/action-2">Logout</Dropdown.Item>
                <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

          </Nav>
        </Navbar>
        <div className="meatze_content">
        </div>
      </Container>);
  }
}

export default withRouter(Dashboard);