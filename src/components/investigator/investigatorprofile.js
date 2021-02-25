import React, { useState } from 'react';
// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

import { withRouter } from 'react-router-dom'



// Styles

// Assets

// Project imports

class InvestigatorProfile extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
    }
  }


  render() {
    return (
      <div className="d-flex justify-content-between" style={{ padding: '1em 0 1em 0' }}>
    <div>
      <img src="https://www.la-tour.ch/sites/default/files/styles/latour_medecin_detail/public/medecins/Roman_Sztajzel_H%C3%B4pital_de_La_Tour_0.jpg?itok=4MjHbHW5" width="150"></img>
    </div>

    <div>
      <div className="font-weight-bold">Position</div>
      <div>Physician</div>
      <div className="mt-3 font-weight-bold">Career Stage</div>
      <div>Peak</div>
    </div>

    <div>
      <div className="font-weight-bold">Affiliation</div>
      <div>La Tour Medical Group - Clinique de Carouge</div>
    </div>

    <div>
      <div className="font-weight-bold">Contact</div>
      <div>0041 22 3094540</div>
      <div><a href="mailto:mail@mail.com">mail@mail.com</a></div>
    </div>

    <div>
      <div className="font-weight-bold">Private Contact</div>
      <div>0041 22 3094540</div>
      <div><a href="mailto:mail@mail.com">mail@mail.com</a></div>
    </div>
  </div>);
  }
}


export default withRouter(InvestigatorProfile);
