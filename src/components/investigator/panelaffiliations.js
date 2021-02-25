import React, { useState } from 'react';
// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

import { withRouter } from 'react-router-dom'

// Styles

// Assets

// Project imports


class PanelAffiliations extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
    }
  }


  render() {

    return (
      <div>
        <div className="d-flex" style={{ margin: '0 0.2em 0 0.2em'}}>
          <div className="text-center" style={{ width: '33%', margin: '1em 0.2em 1em 0.2em', border: '1px solid #4780c4' }}>
            <img className="w-100" src="https://demo.explicatos.com/img/icons_37_37_px-13.png" alt=" "></img>
            <div>7</div>
            <div style={{ padding: '0.4em'}}>
              <button className="btn btn-primary" style={{ backgroundColor: '#4780c4', fontSize: '14px'  }}>Universities</button>
            </div>
          </div>
          <div className="text-center" style={{ width: '33%', margin: '1em 0.2em 1em 0.2em', border: '1px solid #4780c4'  }}>
            <img className="w-100" src="https://demo.explicatos.com/img/icons_37_37_px-14.png" alt=" "></img>
            <div>15</div>
            <div style={{ padding: '0.4em'}}>
              <button className="w-100 btn btn-primary" style={{ backgroundColor: '#4780c4', fontSize: '14px' }}>Hospitals</button>
            </div>
          </div>
          <div className="text-center" style={{ width: '33%', margin: '1em 0.2em 1em 0.2em', border: '1px solid #4780c4'  }}>
            <img className="w-100" src="https://demo.explicatos.com/img/icons_37_37_px-12.png" alt=" "></img>
            <div>4</div>
            <div style={{ padding: '0.2em'}}>
              <button className="btn btn-primary" style={{ backgroundColor: '#4780c4', fontSize: '14px'  }}>Associations</button>
            </div>
          </div>
        </div>
      </div>);
  }
}


export default withRouter(PanelAffiliations);
