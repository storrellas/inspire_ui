import React from 'react';

// Bootstrap
import { Nav, Col, Row, Form } from 'react-bootstrap';

// React Router
import { withRouter } from 'react-router-dom'

// Styles

// Assets

// Project imports
// import InvestigatorTable from '../components/investigatorlist/investigatortable';
// import InvestigatorMap from '../components/investigatorlist/investigatormap';


class Profile extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
    }
  }


  render() {
    
    return (
      <Row className='mt-3 mb-3'>
        <Col sm={12} className='page-container'>
          <div><b>PROFILE</b></div>
          <Row>
            <Col className="pt-3" sm={{ span: 4, offset: 4 }}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="Enter email" disabled />
              </Form.Group>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>First Name</Form.Label>
                <Form.Control type="text" placeholder="Enter email" disabled />
              </Form.Group>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Last Name</Form.Label>
                <Form.Control type="text" placeholder="Enter email" disabled />
              </Form.Group>
              <Form.Group controlId="exampleForm.ControlSelect2">
                <Form.Label>Example multiple select</Form.Label>
                <Form.Control as="select" multiple>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>

        </Col>
      </Row>);
  }
}


export default withRouter(Profile);
