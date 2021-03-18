import React from 'react';
// Bootstrap
import { Col, Row, Alert} from 'react-bootstrap';

// React Router
import { withRouter } from 'react-router-dom'

// Fontawesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

// Axios
import axios from 'axios';

class Login extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      email: '', 
      password: '',
      wrongCredentials: false,
      inProgress: false
    }
  }

  async login(event){
    try{
      this.setState({ inProgress: true })
      const body = {
        username: this.state.username,
        password: this.state.password
      }
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/auth-get-token/`, body)

      // Store in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('project_permissions', JSON.stringify(response.data.user.project_permissions));
      const username = response.data.user.first_name + " " + response.data.user.last_name
      localStorage.setItem('username', username);

      // Move to dashboard
      //this.props.history.push('/dashboard')
      this.props.history.push('/project')
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
      this.setState({ wrongCredentials: true})
      this.setState({ inProgress: false })
    }       
  }

  handleKeyDown(e){
    if (e.keyCode === 13) 
      this.login(e)
  }

  render() {

    // Wrong Credentials
    const alert_wrong_credentials = this.state.wrongCredentials?(
      <Alert variant={'danger'} 
          style={{ fontSize: '14px'}} 
          onClose={(e) => this.setState({wrongCredentials: false})} 
          dismissible>
        <b>ERROR</b>: Please enter a correct username and password. Note that both fields are case-sensitive.
      </Alert>
    ):'';

    return (
      <Row>
        <Col sm={12} className='page-container'>
          <div className="page-title">LOGIN</div>
          <div style={{ margin: '0 auto', padding: '3em 10% 3em 10%', maxWidth: '600px' }}>

            <div>
              <input type="text" className="form-control text-center"
                placeholder="Username" style={{ height: '55px' }}
                onChange={e => this.setState({ username: e.target.value })}
                onKeyDown={ e => this.handleKeyDown(e) } ></input>
            </div>
            <div style={{ paddingTop: '1em' }}>
              <input type="password" className="form-control text-center"
                placeholder="Password" style={{ height: '55px' }}
                onChange={e => this.setState({ password: e.target.value })}
                onKeyDown={ e => this.handleKeyDown(e) } ></input>
            </div>
            <div style={{ paddingTop: '1em' }}>
              <button type="submit" className="btn btn-block"
                style={{ height: '55px', fontSize: '16px', fontWeight: 'bold', backgroundColor: '#4285f4', color: 'white' }}
                onClick={(e) => this.login()}>
                  Login
                  {this.state.inProgress?<FontAwesomeIcon className="ml-2" icon={faSpinner} spin/>:''}</button>
            </div>

            <div style={{ paddingTop: '1em' }}>
              <p className="text-justify" style={{ color: '#C9302C', fontSize: '12px' }}>
                If you experience problems, contact <a href="mailto:support@explicatos.com">support@explicatos.com</a></p>
            </div>
            {alert_wrong_credentials}
          </div>

          

        </Col>        
      </Row>);
  }
}


export default withRouter(Login);
