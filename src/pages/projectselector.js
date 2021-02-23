import React, { useState } from 'react';
// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

import { withRouter } from 'react-router-dom'

// Styles
import "./dashboard.scss"
// Assets

// Project imports


class ProjectSelector extends React.Component {

  constructor(props) {
    super(props)
  }


  render() {
    return (

      <div style={{
        backgroundColor: 'white', border: '1px solid',
        borderColor: 'transparent #dee2e6 #dee2e6 #dee2e6', borderRadius: '0 .25rem 0 .25rem',
        minHeight: '50vh', padding: '2em'
      }}>
        <div className="w-100">
          <div style={{ borderBottom: '1px solid #ccc', color: 'grey', background: 'white'}}>SELECT YOUR PLAN</div>

          <div style={{ margin: '0 auto', width: '400px', padding: '3em 0 3em 0'}}>
            
            List of projects
          </div>
        </div>
      </div>);
  }
}


export default withRouter(ProjectSelector);
