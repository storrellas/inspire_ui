import React from 'react';

// Boostrap
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Container, Navbar, Col, Nav, NavDropdown, Dropdown, Row } from 'react-bootstrap';

// React Router
import { Route } from "react-router-dom";
import { withRouter } from 'react-router-dom'

// Styles
import "./AppReloaded.scss"

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faBars, faStar, faQuestionCircle, faTasks } from '@fortawesome/free-solid-svg-icons'

// Assets
import inspire_logo from '../assets/logo2.png';


// Project imports
import Login from './login';
import ProjectSelector from './projectselector';
import InvestigatorList from './investigatorlist';
import Investigator from './investigator';


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

    render() {
        console.log("ReRender ")
        const { isToggled } = this.state;
        return (
            <div style={{ position: 'relative' }}>
                <div className="hamburguer">
                    <div style={{
                        backgroundColor: '#343547', margin: '0.5em',
                        padding: '0.1em 0.4em 0.1em 0.4em', borderRadius: '20px',
                        border: '2px solid grey', display: 'inline-block'
                    }}>
                        <FontAwesomeIcon icon={faBars}
                            onClick={(e) => this.setState({ isToggled: !isToggled })} />
                    </div>

                </div>

                <div className={isToggled ? "d-flex inspire-wrapper" : "d-flex inspire-wrapper toggled"}>
                    <div className="inspire-overlay"
                        onClick={(e) => this.setState({ isToggled: !isToggled })}></div>

                    <div className="inspire-sidebar">
                        <div className="h-100 d-flex flex-column justify-content-between" style={{ color: 'white', fontSize: '18px', alignItems: 'center' }}>
                            <div>
                                <div>
                                    <img src={inspire_logo} alt="logo" style={{ height: '100px' }}></img>
                                </div>
                                <div style={{ marginTop: '3em', cursor: 'pointer' }}>
                                    <div className="d-flex">
                                        <div><FontAwesomeIcon icon={faUser} /></div>
                                        <span className="align-self-end ml-2" style={{ flexGrow: 1 }}>Project Home</span>
                                    </div>
                                </div>
                                <div className="mt-3" style={{ cursor: 'pointer' }}>
                                    <div className="d-flex">
                                        <div><FontAwesomeIcon icon={faStar} /></div>
                                        <span className="align-self-end ml-2" style={{ flexGrow: 1 }}>My Favories</span>
                                    </div>
                                </div>

                                <div className="mt-3" style={{ cursor: 'pointer' }}>
                                    <div className="d-flex">
                                        <div><FontAwesomeIcon icon={faQuestionCircle} /></div>
                                        <span className="align-self-end ml-2" style={{ flexGrow: 1 }}>Navigation3</span>
                                    </div>
                                </div>

                                <div className="mt-3" style={{ cursor: 'pointer' }}>
                                    <div className="d-flex">
                                        <div><FontAwesomeIcon icon={faTasks} /></div>
                                        <span className="align-self-end ml-2" style={{ flexGrow: 1 }}>Navigation4</span>
                                    </div>
                                </div>
                            </div>
                            <div className="pb-3">

                                <div className="mt-3" style={{ cursor: 'pointer' }}>
                                    <div className="d-flex">
                                        <div><FontAwesomeIcon icon={faQuestionCircle} /></div>
                                        <span className="align-self-end ml-2" style={{ flexGrow: 1 }}>Navigation3</span>
                                    </div>
                                </div>
                                <div className="mt-3" style={{ cursor: 'pointer' }}>
                                    <div className="d-flex">
                                        <div><FontAwesomeIcon icon={faUser} /></div>
                                        <span className="align-self-end ml-2" style={{ flexGrow: 1 }}>User Name</span>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                    <div className="inspire-page-content">
                        <Container>
                            <Row className="inspire-content">
                                <Col sm={12}>
                                    <Route path={`${this.props.match.path}/`} exact component={Login} />
                                    <Route path={`${this.props.match.path}project`} exact component={ProjectSelector} />
                                    <Route path={`${this.props.match.path}project/:id`} exact component={InvestigatorList} />
                                    <Route path={`${this.props.match.path}project/:id/investigator/:subid`} exact component={Investigator} />
                                </Col>
                            </Row>
                        </Container>
                    </div>
                </div>
            </div>);
    }
}

export default withRouter(AppReloaded);