import React, { useState } from 'react';
// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import { Navbar, Nav, NavDropdown, Dropdown } from 'react-bootstrap';

import { withRouter } from 'react-router-dom'

// Styles
import "./dashboard.scss"
// Assets
import arrow from '../assets/arrow.png';

// Project imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faStar, faSearch } from '@fortawesome/free-solid-svg-icons'

class Login extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      activeTab: 'table'
    }
  }


  render() {
    return (

      <div style={{
        backgroundColor: 'white', border: '1px solid',
        borderColor: 'transparent #dee2e6 #dee2e6 #dee2e6', borderRadius: '0 .25rem 0 .25rem',
        minHeight: '50vh', padding: '2em'
      }}>
        <div className="w-100">
          <div style={{ borderBottom: '1px solid #ccc', color: 'grey', background: 'white'}}>LOGIN</div>

          <div style={{ padding: '3em 0 3em 0'}} className="text-center">
            
            {/* <input type="text" className="form-control text-center" 
              placeholder="Username" style={{ height: '55px'}}></input> */}
            <div className="w-50" style={{ margin: '0 auto', minWidth: '300px'}}>
              <input type="text" className="form-control text-center" 
                  placeholder="Username" style={{ height: '55px'}}></input>
            </div>
            <div className="w-50" style={{ margin: '0 auto', minWidth: '300px', paddingTop: '1em'}}>
              <input type="password" className="form-control text-center" 
                  placeholder="Password" style={{ height: '55px'}}></input>
            </div>

            <div className="w-50" style={{ margin: '0 auto', minWidth: '300px', paddingTop: '1em'}}>
              <p style={{color:'#C9302C', fontSize: '12px', textAlign: 'justify'}}>
                If you experience problems, contact <a href="mailto:support@explicatos.com">support@explicatos.com</a></p>
              </div>
          </div>
        </div>
      </div>);
  }
}


export default withRouter(Login);
