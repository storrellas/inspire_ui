import React from 'react';
// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import { Navbar, Nav, NavDropdown, Dropdown } from 'react-bootstrap';
import { Switch, Route } from "react-router-dom";

import { withRouter } from 'react-router-dom'

// Styles
import "./App.scss"
// Assets
import inspire_logo from './assets/logo.png';

//Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faStar, faDirections } from '@fortawesome/free-solid-svg-icons'


// Project imports
import Login from './pages/login';
import ProjectSelector from './pages/projectselector';
import InvestigatorList from './pages/investigatorlist';

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
        <Navbar variant="dark" className="inspire-navbar navbar" style={{ padding: '0 10% 0 10%' }}>
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
                    <Dropdown.Item href="#/action-1">Project1</Dropdown.Item>
                    <Dropdown.Item href="#/action-1">Project2</Dropdown.Item>
                    <Dropdown.Item href="#/action-1">Project3</Dropdown.Item>
                    <Dropdown.Item href="#/action-1">Project4</Dropdown.Item>
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
        </Navbar>
        <div className="inspire-content">
        <Switch>
          <Route path={`${this.props.match.path}/`} exact component={Login} />
          <Route path={`${this.props.match.path}project`} exact component={ProjectSelector} />
          <Route path={`${this.props.match.path}project/:id`} exact component={InvestigatorList} />
          </Switch>
        </div>
      </Container>);
  }
}

export default withRouter(App);