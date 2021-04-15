import React, { Suspense } from 'react';

// Bootstrap
import { Nav, Col, Row } from 'react-bootstrap';

// React Router
import { withRouter } from 'react-router-dom'

// Styles

// Assets

// Project imports
import InvestigatorTable from '../components/investigatorlist/investigatortable';
import InvestigatorTableMobile from '../components/investigatorlist/investigatortablemobile';
import InvestigatorMap from '../components/investigatorlist/investigatormap';

const TAB = { TABLE: 1, MAP: 2, }
class InvestigatorList extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      activeTab: TAB.TABLE,
      map: undefined,
      projectOid: undefined,
    }
  }

  render(){
    const { projectOid } = this.state;

    // Activate tab
    const { activeTab } = this.state;
    if( this.state.map === undefined && activeTab == TAB.MAP ){
      this.state.map = <InvestigatorMap projectOid={projectOid} />                    
    }
    return (
      <Row className='mt-3 mb-3'>        
        <Col sm={12} className={window.mobile?'no-padding no-margin':''}>
          <h5 className={window.mobile?'ml-2':'d-none'}>Project Results</h5>
          <Nav className={window.mobile?'d-none':''} variant="tabs">
            <Nav.Item>
              <Nav.Link href="#" active={activeTab == TAB.TABLE} onClick={(e) => this.setState({ activeTab: TAB.TABLE })}><b>Table</b></Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="#" active={activeTab == TAB.MAP} onClick={(e) => this.setState({ activeTab: TAB.MAP, isMapOpened: true })}><b>Map</b></Nav.Link>
            </Nav.Item>
          </Nav>
          <Row style={{ padding: 0, margin: 0 }}>
            <Col sm={12} className={window.mobile?"p-2 page-container":"page-container"} style={{
              borderColor: 'transparent #dee2e6 #dee2e6 #dee2e6', borderRadius: '0 .25rem 0 .25rem',
            }}>
              <div className={activeTab === TAB.TABLE ? '' : 'd-none'}>
                <InvestigatorTable />
              </div>
              <div className={activeTab === TAB.MAP ? '' : 'd-none'}>
                {this.state.map}
              </div>
            </Col>
          </Row>

        </Col>
      </Row>);
  }


}


export default withRouter(InvestigatorList);
