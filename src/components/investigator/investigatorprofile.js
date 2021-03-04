import React from 'react';

// Bootstrap
import { Col, Row } from 'react-bootstrap';

// React Router
import { withRouter } from 'react-router-dom'


class InvestigatorProfile extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
    }
  }


  render() {
    return (
      <Row style={{ padding: '1em' }}>
        <Col sm={3}>
          <img src="https://www.la-tour.ch/sites/default/files/styles/latour_medecin_detail/public/medecins/Roman_Sztajzel_H%C3%B4pital_de_La_Tour_0.jpg?itok=4MjHbHW5" width="150"></img>
        </Col>

        <Col sm={2}>
          <div className="font-weight-bold">Position</div>
          <div>Physician</div>
          <div className="mt-3 font-weight-bold">Career Stage</div>
          <div>Peak</div>
        </Col>
        <Col sm={3}>
          <div className="font-weight-bold">Affiliation</div>
          <div>La Tour Medical Group - Clinique de Carouge</div>
        </Col>
        <Col sm={2}>
          <div className="font-weight-bold">Contact</div>
          <div>0041 22 3094540</div>
          <div><a href="mailto:mail@mail.com">mail@mail.com</a></div>
        </Col>
        <Col sm={2}>
          <div className="font-weight-bold">Private Contact</div>
          <div>0041 22 3094540</div>
          <div><a href="mailto:mail@mail.com">mail@mail.com</a></div>
        </Col>
      </Row>);
  }
}


export default withRouter(InvestigatorProfile);
