import React, { Suspense } from 'react';

// Bootstrap
import { Nav, Col, Row } from 'react-bootstrap';

// React Router
import { withRouter } from 'react-router-dom'

// Styles

// Assets

// Project imports
import InvestigatorTable from '../components/investigatorlist/investigatortable';
import InvestigatorMap from '../components/investigatorlist/investigatormap';
// Lazy import 
//const InvestigatorMap = React.lazy(() => import('../components/investigatorlist/investigatormap'));


const TAB = { TABLE: 1, MAP: 2, }
class InvestigatorListMobile extends React.Component {

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

    // Activate tab
    const { activeTab } = this.state;
    if( this.state.map === undefined && activeTab == TAB.MAP ){
      this.state.map = <InvestigatorMap projectOid={projectOid} />                    
    }
    return (
      <Row className='mt-3 mb-3'>        
      <div>THIS IS MOBILE</div>
        <Col sm={12} className="page-container" style={{
            borderColor: 'transparent #dee2e6 #dee2e6 #dee2e6', borderRadius: '0 .25rem 0 .25rem',
          }}>
          <InvestigatorTable />

        </Col>
      </Row>);
  }
}


export default withRouter(InvestigatorListMobile);
