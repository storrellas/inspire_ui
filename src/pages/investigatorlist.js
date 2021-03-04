import React from 'react';

// Bootstrap
import { Nav, Col, Row } from 'react-bootstrap';

// React Router
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
      <Row>
        <Col sm={12}>
        <Nav variant="tabs" style={{ width: '100%'}}>
          <Nav.Item>
            <Nav.Link href="#" active={activeTab == 'table'} onClick={(e) => this.setState({ activeTab: 'table' })}>Table</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="#" active={activeTab == 'map'} onClick={(e) => this.setState({ activeTab: 'map' })}>Map</Nav.Link>
          </Nav.Item>
        </Nav>
        { content }        
      </Col>
      </Row>);
  }
}


export default withRouter(InvestigatorList);
