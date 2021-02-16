import React from 'react';
// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import { Navbar, Nav } from 'react-bootstrap';


import { withRouter } from 'react-router-dom'

// Styles
import "./dashboard.scss"
// Assets
import inspire_logo from '../assets/logo.png';

// Project imports

// Content list

class Dashboard extends React.Component {

  constructor(props){
    super(props)
    this.state = {
    }
  }


  render() {

    return (
      <Container fluid className='meatze_main'>
        <Navbar variant="dark" className="meatze_navbar navbar">
          <Navbar.Brand href="#home" style={{ height: '100%'}}>
            <img src={inspire_logo} alt="logo" style={{ height: '100%'}}></img>
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
          </Nav>
        </Navbar>
        <div className="meatze_content">
        </div>
    </Container>);
  }
}

export default withRouter(Dashboard);