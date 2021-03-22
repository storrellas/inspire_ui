import React from 'react';

// Boostrap
import 'bootstrap/dist/css/bootstrap.min.css';

// React Router
import { BrowserRouter, Redirect, Switch, Route } from "react-router-dom";
import { withRouter } from 'react-router-dom'

// Styles
import "./App.scss"

// Project imports
import Dashboard from './pages/dashboard'
import Login from './pages/login'


class AppReloaded extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
    }
  }


  render() {
    console.log("ReRender")
    return (
      <Switch>
        <Route path={`${this.props.match.path}`} exact
          render={(props) => (<Login />)} />
        <Route path={`${this.props.match.path}dashboard/`}
          render={(props) => (<Dashboard reloaded />)} />
        <Redirect to='/' />
      </Switch>
    );
  }
}

export default withRouter(AppReloaded);