import React from 'react';
// Bootstrap
import { Container, Col, Row, Alert} from 'react-bootstrap';

// React Router
import { withRouter } from 'react-router-dom'

// Fontawesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

// Axios
import axios from 'axios';

// Assets
import inspireLogo from '../assets/logo2Large.png';

import './login.scss'

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
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth-get-token/`, body)

      // Store in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('project_permissions', JSON.stringify(response.data.user.project_permissions));
      const username = response.data.user.first_name + " " + response.data.user.last_name
      localStorage.setItem('username', username);

      // Move to dashboard
      this.props.history.push('/dashboard/')
    }catch(error){
      console.log("FAILED")
      this.setState({ wrongCredentials: true})
      this.setState({ inProgress: false })
    }       
  }

  handleKeyDown(e){
    if (e.keyCode === 13) 
      this.login(e)
  }

  render() {
    // Clear previous session
    localStorage.removeItem('token');
    localStorage.removeItem('project_permissions');
    localStorage.removeItem('username');

    // Wrong Credentials
    const alert_wrong_credentials = this.state.wrongCredentials?(
      <Alert className="mt-3" variant={'danger'} 
          style={{ fontSize: '14px'}} 
          onClose={(e) => this.setState({wrongCredentials: false})} 
          dismissible>
        <b>ERROR</b>: Please enter a correct username and password. Note that both fields are case-sensitive.
      </Alert>
    ):'';

    return (
      <Container fluid className="inspire-login-page d-flex flex-column align-items-center" style={{padding: 0}}>
        <Row>
          <Col>
            <div className="inspire-login-logo" style={{ marginTop: '5em', }}>
              <img className="w-100" src={inspireLogo} alt="logo"></img>
            </div>
          </Col>
        </Row>


        <Row className="w-100" style={{ margin:0}}>
          <Col md={{ span: 6, offset: 3 }} className="d-flex justify-content-center">
            <div className="w-100" style={{ maxWidth: '600px', backgroundColor: 'white', padding: '3em', borderRadius: '10px' }}>
              <div>
                <b>Username</b>
                <input type="text" className="mt-3 form-control text-center"
                  placeholder="Username" style={{ height: '55px' }}
                  onChange={e => this.setState({ username: e.target.value })}
                  onKeyDown={e => this.handleKeyDown(e)} ></input>
              </div>
              <div style={{ paddingTop: '1em' }}>
                <b>Password</b>
                <input type="password" className="mt-3 form-control text-center"
                  placeholder="Password" style={{ height: '55px' }}
                  onChange={e => this.setState({ password: e.target.value })}
                  onKeyDown={e => this.handleKeyDown(e)} ></input>
              </div>
              {alert_wrong_credentials}
              <div style={{ paddingTop: '1em' }}>
                <button type="submit" className="btn btn-block inspire-login-btn"
                  onClick={(e) => this.login()}>
                  Login
                    {this.state.inProgress ? <FontAwesomeIcon className="ml-2" icon={faSpinner} spin /> : ''}</button>
              </div>
            </div>
          </Col>
        </Row>

        <div style={{ paddingTop: '1em' }}>
          <p className="text-center" style={{ color: 'whitesmoke' }}>
            If you experience problems, contact <br></br>
            <a href="mailto:support@explicatos.com">support@explicatos.com</a></p>
        </div>
      </Container>
      );
  }
}


export default withRouter(Login);
