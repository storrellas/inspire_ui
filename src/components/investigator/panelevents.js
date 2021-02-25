import React, { useState } from 'react';
// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

import { withRouter } from 'react-router-dom'

// Styles

// Assets

// Project imports


class PanelEvents extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
    }
  }


  render() {

    return (
      <div>
        <div style={{ padding: '1em 1em 1em 1em'}}>
          Events
        </div>
      </div>);
  }
}

export default withRouter(PanelEvents);
