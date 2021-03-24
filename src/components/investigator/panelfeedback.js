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
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="exampleForm.ControlSelect1">
            <Form.Label>Ticket Priority</Form.Label>
            <Form.Control as="select">
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
            </Form.Control>
          </Form.Group>

          <Form.Label className="mt-2">
            Feedback Comment
          </Form.Label>
          <textarea className="w-100" rows="8" style={{ borderColor: '#ced4da', resize: 'none'}}>            
          </textarea>

          <div className="w-100" style={{ padding: '0.2em'}}>
            <button className="mt-3 w-100 inspire-button"
                style={{ paddingLeft: '1em', paddingRight: '1em' }}
                onClick={ (e) => this.showTableUniversities()}>
                Send Feedback
            </button>
          </div>
        </div>
      </div>);
  }
}

export default withRouter(PanelFeedback);
