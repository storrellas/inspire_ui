import React, { useState } from 'react';
// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

import { withRouter } from 'react-router-dom'

// Styles
import "./dashboard.scss"
// Assets

// Project imports


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

          <div style={{ margin: '0 auto', width: '400px', padding: '3em 0 3em 0'}}>
            

            <div>
              <input type="text" className="form-control text-center" 
                  placeholder="Username" style={{ height: '55px'}}></input>
            </div>
            <div style={{ paddingTop: '1em'}}>
              <input type="password" className="form-control text-center" 
                  placeholder="Password" style={{ height: '55px'}}></input>
            </div>
            <div style={{ paddingTop: '1em'}}>
              <button type="submit" className="btn btn-block" 
                  style={{height:'55px', fontSize:'16px', fontWeight:'bold', backgroundColor: '#4285f4', color: 'white'}}
                  onClick={(e) => this.props.history.push('/dashboard')}>Login</button>
            </div>

            <div style={{ paddingTop: '1em'}}>
              <p className="text-justify" style={{color:'#C9302C', fontSize: '12px'}}>
                If you experience problems, contact <a href="mailto:support@explicatos.com">support@explicatos.com</a></p>
              </div>
          </div>
        </div>
      </div>);
  }
}


export default withRouter(Login);
