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

// Axios
import axios from 'axios';


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

// // Add a response interceptor
// axios.interceptors.response.use(function (response) {
//   // Any status code that lie within the range of 2xx cause this function to trigger
//   // Do something with response data
//   console.log("all ok")
//   return response;
// }, function (error) {
//   // Any status codes that falls outside the range of 2xx cause this function to trigger
//   // Do something with response error
//   alert("error", error)
//   // Simulate a mouse click:
//   window.location.href = process.env.REACT_APP_API_URL;
//   return Promise.reject(error);
// });

export default withRouter(AppReloaded);