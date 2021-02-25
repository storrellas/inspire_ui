import React, { useState } from 'react';
// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import { Navbar, Nav, NavDropdown, Dropdown } from 'react-bootstrap';

import { withRouter } from 'react-router-dom'

// Styles

// Assets

// Project imports
import InvestigatorTable from '../components/investigatorlist/investigatortable';
import InvestigatorMap from '../components/investigatorlist/investigatormap';



class InvestigatorList extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      activeTab: 'table'
    }
  }


  render() {

    const base =
    {
      firstName: 'Roman',
      lastName: 'Sztajzel',
      specialties: 'Neurology',
      focusArea: 'MyFocusArea',
      city: 'Carouge',
      country: 'Switzerland',
      publications: 1,
      experiments: 2,
      clinicalTrials: 4,
      conflicOfInterest: 12,
    }
    const data = Array(10).fill(base);

    const { activeTab } = this.state;

    // Select tab to be displayed
    const content = (activeTab==='table')?<InvestigatorTable data={data} />:<InvestigatorMap />;
    return (
      <div>
        <Nav variant="tabs" style={{ width: '100%' }}>
          <Nav.Item>
            <Nav.Link href="#" active={activeTab == 'table'} onClick={(e) => this.setState({ activeTab: 'table' })}>Table</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="#" active={activeTab == 'map'} onClick={(e) => this.setState({ activeTab: 'map' })}>Map</Nav.Link>
          </Nav.Item>
        </Nav>
        { content }
        
      </div>);
  }
}


export default withRouter(InvestigatorList);
