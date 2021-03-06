import React, { Suspense } from 'react';

// Bootstrap
import { Nav, Col, Row } from 'react-bootstrap';

// React Router
import { withRouter } from 'react-router-dom'

// Styles

// Assets

// Project imports
import InvestigatorTableLegacy from '../../components/investigatorlist/legacy/investigatortablelegacy';
import InvestigatorMap from '../../components/investigatorlist/investigatormap';
// Lazy import 
//const InvestigatorMap = React.lazy(() => import('../components/investigatorlist/investigatormap'));


const TAB = { TABLE: 1, MAP: 2, }
class InvestigatorListLegacy extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      activeTab: TAB.TABLE,
      map: undefined,
      projectOid: undefined,
    }
  }


  render() {
    
    const { projectOid } = this.state;
    const { reloaded } = this.props;

    // Activate tab
    const { activeTab } = this.state;
    if( this.state.map === undefined && activeTab == TAB.MAP ){
      this.state.map = <InvestigatorMap projectOid={projectOid} />                    
    }
    return (
      <Row className={reloaded?'mt-3 mb-3':'mt-3'}>
        <Col sm={12}>
          <Nav variant="tabs" style={{ width: '100%' }}>
            <Nav.Item>
              <Nav.Link href="#" active={activeTab == TAB.TABLE} onClick={(e) => this.setState({ activeTab: TAB.TABLE })}><b>Table</b></Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="#" active={activeTab == TAB.MAP} onClick={(e) => this.setState({ activeTab: TAB.MAP, isMapOpened: true })}><b>Map</b></Nav.Link>
            </Nav.Item>
          </Nav>
          <div className={activeTab === TAB.TABLE ? '' : 'd-none'}>
            <InvestigatorTableLegacy reloaded={reloaded} />
          </div>
          <div className={activeTab === TAB.MAP ? '' : 'd-none'}>
            {this.state.map}
          </div>
        </Col>
      </Row>);
  }
}


export default withRouter(InvestigatorListLegacy);
