import React from 'react';
// React Router
import { withRouter } from 'react-router-dom'

// Bootstrap
import { Form, Alert} from 'react-bootstrap';

// Axios
import axios from 'axios';

class PanelFeedback extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
        ticketType: '',
        ticketPriority: '',
        message: '',
        showResponse: false,
    }

    this.ticketTypeOptions = [
        { value: 'coverage_issue', label: 'Coverage Issue' },
        { value: 'data_consistency_issue', label: 'Data Consistency Issue' },
        { value: 'technical_issue', label: 'Technical Issue' },
    ]
    this.ticketPriorityOptions = [
        { value: 'normal', label: 'Normal' },
        { value: 'critical', label: 'Critical' },
        { value: 'high', label: 'High' },
    ]

    this.state.ticketType = this.ticketTypeOptions[0].value
    this.state.ticketPriority = this.ticketPriorityOptions[0].value
  }

  async onSubmitFeedback(){
    try{
        const  { ticketType, ticketPriority, message } = this.state;

        // Grab ME oid
        const { match: { params } } = this.props;
        const oid = params.subid;
  
        const shortOid = oid.split('-')[oid.split('-').length -1 ]

        // Perform request
        const body = {
            ticket_type: ticketType,
            ticket_priority: ticketPriority,
            message: message
        }
        const token = localStorage.getItem('token')
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/investigator/${shortOid}/submit-feedback/`, body,
            { headers: { "Authorization": "jwt " + token }
        })

        this.setState({showResponse: true})
    }catch(error){

    // Error
    if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
    } else if (error.request) {
        console.log(error.request);
    } else {
        console.log('Error', error.message);
    }

    } 

  }


  render() {
    const { showResponse } = this.state;

    return (
      <div>
        <div style={{ padding: '1em 20% 1em 20%'}}>

          <Form.Group controlId="exampleForm.ControlSelect1">
            <Form.Label>Ticket Type</Form.Label>
            <Form.Control as="select" onChange={e => this.setState({ ticketType: e.target.value })}>
                {this.ticketTypeOptions.map( (item, id ) =>
                    <option key={id} value={item.value}>{item.label}</option>
                )}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="exampleForm.ControlSelect1">
            <Form.Label>Ticket Priority</Form.Label>
            <Form.Control as="select" onChange={e => this.setState({ ticketPriority: e.target.value })}>
                {this.ticketPriorityOptions.map( (item, id ) =>
                    <option key={id} value={item.value}>{item.label}</option>
                )}
            </Form.Control>
          </Form.Group>

          <Form.Label className="mt-2">
            Feedback Comment
          </Form.Label>
          <textarea className="w-100" rows="8" 
            style={{ borderColor: '#ced4da', resize: 'none'}}
            onChange={e => this.setState({ message: e.target.value })}>            
          </textarea>
        
          <div className="mt-3">
            <Alert className={showResponse?'':'d-none'} variant="primary">
                Your feedback has been submitted!
            </Alert>
          </div>
          

          <div className="w-100" style={{ padding: '0 20% 0 20%'}}>
            <button className="mt-3 w-100 inspire-button"
                style={{ padding: '0.5em 1em 0.5em 1em' }}
                onClick={ (e) => this.onSubmitFeedback()}>
                Send Feedback
            </button>
          </div>
        </div>
      </div>);
  }
}

export default withRouter(PanelFeedback);
