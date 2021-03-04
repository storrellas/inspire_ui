import React from 'react';
// React Router
import { withRouter } from 'react-router-dom'

class PanelFeedback extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
    }
  }


  render() {

    return (
      <div>
        <div style={{ padding: '1em 1em 1em 1em'}}>
          <textarea className="w-100" rows="8" ></textarea>
          <div className="w-100" style={{ padding: '0.2em'}}>
            <button className="btn btn-primary" style={{ backgroundColor: '#4780c4', fontSize: '14px', width: '100%'  }}>Send</button>
          </div>
        </div>
      </div>);
  }
}

export default withRouter(PanelFeedback);
