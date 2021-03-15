import React from 'react';

// Boostrap
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Container, Navbar, Col, Nav, NavDropdown, Dropdown, Row } from 'react-bootstrap';

// React Router
import { Route } from "react-router-dom";
import { withRouter } from 'react-router-dom'

// Styles
import "./AppReloaded.scss"

// Assets
import inspire_logo from '../assets/logo.png';

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faStar, faDirections } from '@fortawesome/free-solid-svg-icons'

// Project imports
import Login from './login';
import ProjectSelector from './projectselector';
import InvestigatorList from './investigatorlist';
import Investigator from './investigator';
import { height } from '@amcharts/amcharts4/.internal/core/utils/Utils';


class AppReloaded extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isToggled: true,
            height: undefined
        }
    }

    logout(e) {
        localStorage.clear('token');
        this.props.history.push('/')
    }

    componentDidMount() {
        const height = document.getElementById('page-content-wrapper').clientHeight;
        this.setState({ height });
    }

    render() {
        console.log("ReRender ")
        const { isToggled } = this.state;
        return (
            <div style={{ position: 'relative', backgroundColor: 'yellow' }}>
                <div className="hamburguer" style={{ backgroundColor: 'green' }}>
                    <Button className="w-100" variant="primary" onClick={(e) => this.setState({ isToggled: !isToggled })}>Primary</Button>
                </div>
                
                <div id="wrapper" className={isToggled ? "d-flex" : "d-flex toggled"}
                    style={{ backgroundColor: 'yellow' }}>
                    <div id="overlay"></div>

                    <div id="sidebar-wrapper" style={{ backgroundColor: 'purple', height: this.state.height + 'px' }}>
                        My Header
                    </div>
                    <div id="page-content-wrapper" style={{ paddingTop: '3em', backgroundColor: 'blue' }}>
                        <div style={{ padding: '3em'}}>MyContent</div>
                        <div style={{ padding: '3em'}}>MyContent</div>
                        <div style={{ padding: '3em'}}>MyContent</div>
                        <div style={{ padding: '3em'}}>MyContent</div>
                        <div style={{ padding: '3em'}}>MyContent</div>
                        <div style={{ padding: '3em'}}>MyContent</div>
                        <div style={{ padding: '3em'}}>MyContent</div>
                        <div style={{ padding: '3em'}}>MyContent</div>
                        <div style={{ padding: '3em'}}>MyContent</div>
                        

                    </div>
                </div>
            </div>);
    }
}

export default withRouter(AppReloaded);