import React from 'react';
// React Router
import { withRouter } from 'react-router-dom'

// Bootstrap
import { Form } from 'react-bootstrap';

class PanelFeedback extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
    }
  }


  render() {

    return (
      <div>
        <div style={{ padding: '1em 20% 1em 20%'}}>

          <Form.Group controlId="exampleForm.ControlSelect1">
            <Form.Label>Ticket Type</Form.Label>
            <Form.Control as="select">
              <option>Coverage Issue</option>
              <option>Data Consistency Issue</option>
              <option>Technical Issue</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="exampleForm.ControlSelect1">
            <Form.Label>Ticket Priority</Form.Label>
            <Form.Control as="select">
              <option>Normal</option>
              <option>Critical</option>
              <option>High</option>
            </Form.Control>
          </Form.Group>

          <Form.Label className="mt-2">
            Feedback Comment
          </Form.Label>
          <textarea className="w-100" rows="8" style={{ borderColor: '#ced4da', resize: 'none'}}>            
          </textarea>

          <div className="w-100" style={{ padding: '0 20% 0 20%'}}>
            <button className="mt-3 w-100 inspire-button"
                style={{ padding: '0.5em 1em 0.5em 1em' }}
                onClick={ (e) => console.log("Not implemented yet")}>
                Send Feedback
            </button>
          </div>
        </div>
      </div>);
  }
}

export default withRouter(PanelFeedback);
