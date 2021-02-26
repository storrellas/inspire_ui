import React, { useState } from 'react';
// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

import { withRouter } from 'react-router-dom'



// Styles

// Assets

// Project imports
import CytoscapeComponent from 'react-cytoscapejs';

import cytoscape from 'cytoscape';
import euler from 'cytoscape-euler';
import source from './source'

cytoscape.use( euler );

class PanelConnections extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
    }
  }


  render() {
    return (
      <div>
        <CytoscapeComponent 
          elements={source} 
          style={{ width: '100%', height: '300px' }} 
          stylesheet={
          [{
              selector: 'node',
              css: {
                  'height': 10,
                  'width': 10,
                  'background-color': '#FFFFFF',
                  'border-color': '#4283f1',
                  'border-width': 1,
                  'border-opacity': 0.5,
                  'background-image': 'data(image)',
                  'background-width': '60%',
                  'background-height': '60%',
                  'label': 'data(label)',
                  'font-size': 6,
                  'color': 'gray',
              }
          },
          {
              selector: 'edge',
              css: {
                  'line-color': 'data(color)',
                  'width': 1,
              }
          },
          {
              selector: 'node:selected',
              css: {
                  'height': 14,
                  'width': 14,
                  'background-color': '#FFFFFF',
                  'border-color': '#4283f1',
                  'border-width': 1,
                  'border-opacity': 0.5,
                  'background-image': 'https://demo.explicatos.com/img/user.png',
                  'background-width': '60%',
                  'background-height': '60%',
                  'label': 'data(label)',
                  'font-size': 11,
              }
          }]}
  
          layout={{
              name: 'euler',
              randomize: true,
              animate: false,
          }}/>
      </div>);
  }
}


export default withRouter(PanelConnections);
