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


    const elements = [
      { data: { id: 'one', label: 'Node 1' }, position: { x: 100, y: 100 } },
      { data: { id: 'two', label: 'Node 2' }, position: { x: 100, y: 0 } },
      { data: { source: 'one', target: 'two', label: 'Edge from Node1 to Node2' } }
    ];

    const img_default_user_gray = '/img/user_gray.png'
    const img_default_user = '/img/user.png'

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
