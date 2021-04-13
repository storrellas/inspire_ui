import React from 'react';
// React Router
import { withRouter } from 'react-router-dom'

// Bootstrap
import { Form, Alert} from 'react-bootstrap';

// Axios
import axios from 'axios';

// Redux
import { connect } from "react-redux";

const mapStateToProps = state => {
  return {
    tabFeedbackOpened: state.tabFeedbackOpened,
  };
};

class PanelFeedback extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
        ticketType: '',
        ticketPriority: '',
        message: '',
        showResponse: false,
        showError: false
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

    this.state.ticketType = this.ticketTypeOptions[1].value
    this.state.ticketPriority = this.ticketPriorityOptions[0].value
  }

  async onSubmitFeedback(){
    try{
        this.setState({showError:false, showResponse: false})
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
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/investigator/${shortOid}/submit-feedback/`, body,
            { headers: { "Authorization": "jwt " + token }
        })

        this.setState({
            showResponse: true, 
            ticketType: this.ticketTypeOptions[0].value, 
            ticketPriority: this.ticketPriorityOptions[0].value,
            message:''})
    }catch(error){
      this.setState({showError:true})
      console.log("FAILED")
    } 
  }


  render() {
    const { ticketType, ticketPriority, message, showResponse, showError } = this.state;

    if( this.props.tabFeedbackOpened == false ){
      this.state.showResponse = false;
      this.state.showError = false;
    }

    return (
      <div style={{ padding: '1em 20% 1em 20%', }}>
        <div style={{  position: 'relative'}}>
          
          <div className={showResponse||showError?'invisible':''}>
            <Form.Group controlId="exampleForm.ControlSelect1">
              <Form.Label>Ticket Type</Form.Label>
              <Form.Control as="select" onChange={e => this.setState({ ticketType: e.target.value })} value={ticketType}>
                  {this.ticketTypeOptions.map( (item, id ) =>
                      <option  key={id} value={item.value}>{item.label}</option>
                  )}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="exampleForm.ControlSelect1">
              <Form.Label>Ticket Priority</Form.Label>
              <Form.Control as="select" onChange={e => this.setState({ ticketPriority: e.target.value })}  value={ticketPriority}>
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
              onChange={e => this.setState({ message: e.target.value })}
              value={message} >
                      
            </textarea>
            <div className="w-100" style={{ padding: '0 20% 0 20%'}}>
              <button className="mt-3 w-100 inspire-button"
                  style={{ padding: '0.5em 1em 0.5em 1em' }}
                  onClick={ (e) => this.onSubmitFeedback()}>
                  Send Feedback
              </button>
            </div>
          </div>
          
          <div className="mt-3 w-100" style={{ position: 'absolute', top: 0}}>
            <Alert className={showResponse?'text-center':'d-none'} variant="primary">
                Your feedback has been submitted!
            </Alert>
            <Alert className={showError?'text-center':'d-none'} variant="danger">
                You need to add a message
            </Alert>
          </div>
        

          


        </div>
      </div>);
  }
}


export default connect(mapStateToProps, undefined)(withRouter(PanelFeedback))

