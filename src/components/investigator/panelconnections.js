import React, { useState } from 'react';
// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

import { withRouter } from 'react-router-dom'



// Styles

// Assets

// Project imports

import CytoscapeComponent from 'react-cytoscapejs';

class PanelConnections extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
    }
  }


  render() {


    const elements = [
      { data: { id: 'one', label: 'Node 1' }, position: { x: 100, y: 100 } },
      { data: { id: 'two', label: 'Node 2' }, position: { x: 100, y: 0 } },
      { data: { source: 'one', target: 'two', label: 'Edge from Node1 to Node2' } }
    ];

    return (
      <div>
        <CytoscapeComponent elements={elements} style={{ width: '100%', height: '300px' }} />
      </div>);
  }
}


export default withRouter(PanelConnections);
