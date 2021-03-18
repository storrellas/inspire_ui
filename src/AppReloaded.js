import React from 'react';

// Boostrap
import 'bootstrap/dist/css/bootstrap.min.css';

// React Router
import { Route } from "react-router-dom";
import { withRouter } from 'react-router-dom'

// Styles
import "./App.scss"

// Project imports
import Dashboard from './pages/dashboard'
import LoginReloaded from './pages/loginreloaded'


class AppReloaded extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
    }
  }


  render() {
    console.log("ReRender")
    return (
      <>      
        <Route path={`${this.props.match.path}`} exact
          render={(props) => (<LoginReloaded />)} />
        <Route path={`${this.props.match.path}dashboard/`}
          render={(props) => (<Dashboard reloaded />)} />
      </>);
  }
}

export default withRouter(AppReloaded);