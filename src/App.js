import React from 'react';
// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';


import { Container } from 'react-bootstrap';
import { Navbar, Col, Nav, NavDropdown, Dropdown, Row } from 'react-bootstrap';
import { Switch, Route } from "react-router-dom";

import { withRouter } from 'react-router-dom'

// Styles
import "./App.scss"
// Assets
import inspire_logo from './assets/logo.png';

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faStar, faDirections } from '@fortawesome/free-solid-svg-icons'


// Project imports
import Login from './pages/login';
import ProjectSelector from './pages/projectselector';
import InvestigatorList from './pages/investigatorlist';
import Investigator from './pages/investigator';


class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {
    console.log("ReRender")
    const isLogin = this.props.location.pathname == '/'
    return (
      <div className='inspire-main'>
        <Navbar variant="dark" className="inspire-navbar navbar" expand="sm">

          <Navbar.Brand href="#home" className="h-100">
            <img src={inspire_logo} alt="logo" style={{ height: '50px' }}></img>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse className="h-100 justify-content-end">
            <Nav className="h-100 inspire-nav" style={{ backgroundColor: '#343547' }}>
              {isLogin ? '' :
                <Nav.Link href="#home">
                  <div className="inspire-navbar-link" style={{ display: 'inline', padding: '0.5em' }}>
                    <FontAwesomeIcon style={{ color: 'white' }} icon={faDirections} />
                  </div>
                </Nav.Link>
              }

              {isLogin ? '' :
                <Nav.Link href="#link">
                  <div className="inspire-navbar-link" style={{ display: 'inline', padding: '0.5em' }}>
                    <FontAwesomeIcon style={{ color: 'white' }} icon={faStar} />
                  </div>
                </Nav.Link>
              }

              {isLogin ? '' :
                <NavDropdown title="Project" bsPrefix="inspire-reponsive-dropdown">
                  <NavDropdown.Item href="/project/123">Project1</NavDropdown.Item>
                  <NavDropdown.Item href="/project/123">Project2</NavDropdown.Item>
                  <NavDropdown.Item href="/project/123">Project3</NavDropdown.Item>
                  <NavDropdown.Item href="/project/123">Project4</NavDropdown.Item>
                </NavDropdown>
              }
              {isLogin ? '' :
                <NavDropdown title="Custom" bsPrefix="inspire-reponsive-dropdown">
                  <NavDropdown.Item href="#">Authors</NavDropdown.Item>
                  <NavDropdown.Item href="#">Market Access</NavDropdown.Item>
                  <NavDropdown.Item href="#">Company Cooperation / Conflict of Interest</NavDropdown.Item>
                  <NavDropdown.Item href="#">Other</NavDropdown.Item>
                </NavDropdown>
              }

              {isLogin ? '' :
                <Dropdown>
                  <div style={{ margin: '0.5em' }}>
                    <Dropdown.Toggle className="inspire-dropdown-toggle" bsPrefix="test" variant="success" id="dropdown-basic">
                      <FontAwesomeIcon icon={faUser} />
                    </Dropdown.Toggle>

                    <Dropdown.Menu align="right">
                      <Dropdown.Item href="#/action-1">Sergi Torrellas</Dropdown.Item>
                      <Dropdown.Item href="#/action-2">Logout</Dropdown.Item>
                    </Dropdown.Menu>
                  </div>
                </Dropdown>
              }
            </Nav>

          </Navbar.Collapse>
        </Navbar>
        <Container>
          <Row className="inspire-content">
            <Col sm={12}>
              <Route path={`${this.props.match.path}/`} exact component={Login} />
              <Route path={`${this.props.match.path}project`} exact component={ProjectSelector} />
              <Route path={`${this.props.match.path}project/:id`} exact component={InvestigatorList} />
              <Route path={`${this.props.match.path}project/:id/investigator/:subid`} exact component={Investigator} />
              </Col>
          </Row>
        </Container>
      </div>);
  }
}

export default withRouter(App);