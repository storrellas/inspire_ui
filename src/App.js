import React from 'react';
// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import { Navbar, Nav, NavDropdown, Dropdown, Form, FormControl, Button } from 'react-bootstrap';
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

    const isLogin = this.props.location.pathname == '/'
    return (
      <Container fluid className='inspire-main'>

      <Navbar variant="dark" className="inspire-navbar navbar" expand="lg" style={{padding: '0 10% 0 10%'}}>
        <Navbar.Brand href="#home" className="h-100"><img src={inspire_logo} alt="logo" style={{ height: '100%' }}></img></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="h-100 justify-content-end">
          <Nav className="h-100 align-items-center">
            <Nav.Link href="#home" className="inspire-dropdown" >
              <FontAwesomeIcon style={{ color: 'white' }} icon={faDirections} />
            </Nav.Link>
            <Nav.Link href="#link">
            <FontAwesomeIcon style={{ color: 'white' }} icon={faStar} />
            </Nav.Link>
            <NavDropdown title="Project" bsPrefix="inspire-reponsive-dropdown">
              <NavDropdown.Item href="/project/123">Project1</NavDropdown.Item>
              <NavDropdown.Item href="/project/123">Project2</NavDropdown.Item>
              <NavDropdown.Item href="/project/123">Project3</NavDropdown.Item>
              <NavDropdown.Item href="/project/123">Project4</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Custom" bsPrefix="inspire-reponsive-dropdown">
              <NavDropdown.Item href="#">Authors</NavDropdown.Item>
              <NavDropdown.Item href="#">Market Access</NavDropdown.Item>
              <NavDropdown.Item href="#">Company Cooperation / Conflict of Interest</NavDropdown.Item>
              <NavDropdown.Item href="#">Other</NavDropdown.Item>
            </NavDropdown>
            <Dropdown>
            <Dropdown.Toggle className="inspire-dropdown-toggle" variant="success" id="dropdown-basic"
              style={{ backgroundColor: 'transparent', borderColor: 'white' }}>
              <FontAwesomeIcon style={{ color: 'white' }} icon={faUser} />
            </Dropdown.Toggle>

            <Dropdown.Menu align="right">
              <Dropdown.Item href="#/action-1">Sergi Torrellas</Dropdown.Item>
              <Dropdown.Item href="#/action-2">Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          </Nav>

        </Navbar.Collapse>
      </Navbar>

        {/* <Navbar variant="dark" className="inspire-navbar navbar" style={{ padding: '0 10% 0 10%' }}>
          <Navbar.Brand href="#home" style={{ height: '100%' }}>
            <img src={inspire_logo} alt="logo" style={{ height: '100%' }}></img>
          </Navbar.Brand>
          <Nav className="h-100 ml-auto w-50 d-flex justify-content-end">


            {isLogin ? '' :
              <div className="inspire-dropdown d-flex align-items-center" style={{ padding: '0 1em 0 1em' }}>
                <Dropdown >
                  <Dropdown.Toggle className="inspire-dropdown-toggle" variant="success" id="dropdown-basic" style={{ backgroundColor: 'transparent', borderColor: 'white' }}>
                    <FontAwesomeIcon style={{ color: 'white' }} icon={faDirections} />
                  </Dropdown.Toggle>
                </Dropdown>
              </div>
            }
            {isLogin ? '' :
              <div className="inspire-dropdown d-flex align-items-center" style={{ padding: '0 1em 0 1em' }}>
                <Dropdown >
                  <Dropdown.Toggle className="inspire-dropdown-toggle" variant="success" id="dropdown-basic" style={{ backgroundColor: 'transparent', borderColor: 'white' }}>
                    <FontAwesomeIcon style={{ color: 'white' }} icon={faStar} />
                  </Dropdown.Toggle>
                </Dropdown>
              </div>
            }
            {isLogin ? '' :
              <div className="inspire-dropdown d-flex align-items-center">
                <Dropdown >
                  <Dropdown.Toggle variant="success" id="dropdown-basic" style={{ backgroundColor: 'transparent', border: 0, boxShadow: 'none' }}>
                    Project
                </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item href="/project/123">Project1</Dropdown.Item>
                    <Dropdown.Item href="/project/123">Project2</Dropdown.Item>
                    <Dropdown.Item href="/project/123">Project3</Dropdown.Item>
                    <Dropdown.Item href="/project/123">Project4</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            }
            {isLogin ? '' :
              <div className="inspire-dropdown d-flex align-items-center mr-3">
                <Dropdown >
                  <Dropdown.Toggle variant="success" id="dropdown-basic" style={{ backgroundColor: 'transparent', border: 0, boxShadow: 'none' }}>
                    Custom
                </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item href="#/action-1">Authors</Dropdown.Item>
                    <Dropdown.Item href="#/action-2">Market Access</Dropdown.Item>
                    <Dropdown.Item href="#/action-2">Company Cooperation / Conflict of Interest</Dropdown.Item>
                    <Dropdown.Item href="#/action-2">Other</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            }

            {isLogin ? '' :
              <div className="d-flex align-items-center">
                <Dropdown >
                  <Dropdown.Toggle className="inspire-dropdown-toggle" variant="success" id="dropdown-basic"
                    style={{ backgroundColor: 'transparent', borderColor: 'white' }}>
                    <FontAwesomeIcon style={{ color: 'white' }} icon={faUser} />
                  </Dropdown.Toggle>

                  <Dropdown.Menu align="right">
                    <Dropdown.Item href="#/action-1">Sergi Torrellas</Dropdown.Item>
                    <Dropdown.Item href="#/action-2">Logout</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            }

          </Nav>
        </Navbar> */}
        <div className="inspire-content">
          <Switch>
            <Route path={`${this.props.match.path}/`} exact component={Login} />
            <Route path={`${this.props.match.path}project`} exact component={ProjectSelector} />
            <Route path={`${this.props.match.path}project/:id`} exact component={InvestigatorList} />
            <Route path={`${this.props.match.path}project/:id/investigator/:subid`} exact component={Investigator} />
          </Switch>
        </div>
      </Container>);
  }
}

export default withRouter(App);