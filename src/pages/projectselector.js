import React, { useState } from 'react';
// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

import { withRouter } from 'react-router-dom'

// Styles
import "./projectselector.scss"
// Assets

// Project imports


class ProjectSelector extends React.Component {

  constructor(props) {
    super(props)
  }


  render() {

    const items = Array(10).fill(0)
    console.log("items ", items)
    return (

      <div style={{
        backgroundColor: 'white', border: '1px solid',
        borderColor: 'transparent #dee2e6 #dee2e6 #dee2e6', borderRadius: '0 .25rem 0 .25rem',
        minHeight: '50vh', padding: '2em'
      }}>
        <div className="w-100">
          <div style={{ borderBottom: '1px solid #ccc', color: 'grey', background: 'white' }}>SELECT YOUR PLAN</div>
          <div className="d-flex flex-wrap" style={{ padding: '2em' }}>
            {items.map((item, id) =>
              <div key={id} style={{ padding: '1em 1em 0 1em', width: '33%' }} onClick={ (e) => this.props.history.push('/project/123')}>
                <div className="landBtn project project-container btnActive"
                  style={{ height: '10em' }}>
                  <div className="top-triangle project"></div>
                  <div className="bottom-triangle project"></div>
                  <div className="content">
                    <div className="title project">S_Neurology_1_DACH</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>);
  }
}


export default withRouter(ProjectSelector);
