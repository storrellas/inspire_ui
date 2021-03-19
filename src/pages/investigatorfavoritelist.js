import React, { Suspense } from 'react';

// Bootstrap
import { Nav, Col, Row } from 'react-bootstrap';

// React Router
import { withRouter } from 'react-router-dom'

// Styles

// Assets

// Project imports
import InvestigatorTable from '../components/investigatorlist/investigatortable';
// Lazy import 
//const InvestigatorMap = React.lazy(() => import('../components/investigatorlist/investigatormap'));

class InvestigatorFavoriteList extends React.Component {

  constructor(props) {
    super(props)
    this.state = {

    }
  }


  render() {
    
    const { projectOid } = this.state;

    return (
      <Row className='mt-3 mb-3'>        
        <Col sm={12}>
          <div><b>Investigator Favorites</b></div>
          <div>Favorite list</div>
        </Col>
      </Row>);
  }
}


export default withRouter(InvestigatorFavoriteList);
