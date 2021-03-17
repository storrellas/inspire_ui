import React from 'react';

// Boostrap
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Container, Navbar, Col, Nav, NavDropdown, Dropdown, Row } from 'react-bootstrap';

// React Router
import { Route } from "react-router-dom";
import { withRouter } from 'react-router-dom'

// Redux
import { connect } from "react-redux";

// Styles
import "./dashboard.scss"

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faBars, faStar, faQuestionCircle, faTasks, faAngleRight } from '@fortawesome/free-solid-svg-icons'

// Assets
import inspireLogo from '../../assets/logo2.png';

// Project imports
import Login from '../login';
import ProjectSelector from '../projectselector';
import InvestigatorList from '../investigatorlist';
import InvestigatorReloaded from './investigatorreloaded';

import AnimateHeight from 'react-animate-height';

const mapStateToProps = (state) => {
    return {
      investigatorProfile: state.investigatorProfile,
    };
  }

class Dashboard extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isToggled: true,
            projectHeight: 0,
            userHeight: 0
        }
    }

    logout(e) {
        e.preventDefault()
        localStorage.clear('token');
        this.props.history.push('/reloaded/')
    }    

    render() {
        const { isToggled } = this.state;
        const { investigatorProfile } = this.props;
        
        const projectList = JSON.parse(localStorage.getItem('project_permissions'));
        const username = localStorage.getItem('username');

        const { match: { params } } = this.props;
        let projectOid = this.props.location.pathname.split('/')[4];
        const name = investigatorProfile?investigatorProfile.name:undefined

        

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
                                    <img src={inspireLogo} alt="logo" style={{ height: '100px' }}></img>
                                </div>
                                <div style={{ marginTop: '3em', cursor: 'pointer' }}>
                                    <div className="d-flex font-weight-bold">
                                        <div><FontAwesomeIcon icon={faUser} /></div>
                                        <span className="align-self-end ml-2" style={{ flexGrow: 1 }}>
                                            <a href="#" style={{ color: 'white' }}
                                                onClick={(e) => this.setState({ projectHeight: this.state.projectHeight == 0 ? 'auto' : 0 })}>
                                                Project
                                            </a>
                                        </span>
                                    </div>
                                    <div className="d-flex flex-column">
                                        <AnimateHeight
                                            height={this.state.projectHeight}
                                            duration={500}>
                                            {projectList.map((item, id) =>
                                                <div key={id} style={{ width: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    <a href={`/reloaded/project/${item.oid}`}
                                                        style={{ color: 'white', marginLeft: '1em' }}>
                                                        {item.name}
                                                    </a>
                                                </div>

                                            )}
                                        </AnimateHeight>
                                    </div>
                                </div>
                                <div className="mt-3" style={{ cursor: 'pointer' }}>
                                    <div className="d-flex font-weight-bold">
                                        <div><FontAwesomeIcon icon={faStar} /></div>
                                        <span className="align-self-end ml-2" style={{ flexGrow: 1 }}>My Favorites</span>
                                    </div>
                                </div>

                                <div className="mt-3" style={{ cursor: 'pointer' }}>
                                    <div className="d-flex font-weight-bold">
                                        <div><FontAwesomeIcon icon={faQuestionCircle} /></div>
                                        <span className="align-self-end ml-2" style={{ flexGrow: 1 }}>Navigation3</span>
                                    </div>
                                </div>

                                <div className="mt-3" style={{ cursor: 'pointer' }}>
                                    <div className="d-flex font-weight-bold">
                                        <div><FontAwesomeIcon icon={faTasks} /></div>
                                        <span className="align-self-end ml-2" style={{ flexGrow: 1 }}>Navigation4</span>
                                    </div>
                                </div>
                            </div>
                            <div className="pb-3">

                                <div className="mt-3" style={{ cursor: 'pointer' }}>
                                    <div className="d-flex font-weight-bold">
                                        <div><FontAwesomeIcon icon={faQuestionCircle} /></div>
                                        <span className="align-self-end ml-2" style={{ flexGrow: 1 }}>Navigation3</span>
                                    </div>
                                </div>
                                <div className="mt-3" style={{ cursor: 'pointer' }}>
                                    <div className="d-flex font-weight-bold">
                                        <div><FontAwesomeIcon icon={faUser} /></div>
                                        <span className="align-self-end ml-2" style={{ flexGrow: 1 }}
                                        onClick={(e) => this.setState({ userHeight: this.state.userHeight == 0 ? 'auto' : 0 })}>{username}</span>

                                    </div>
                                    <AnimateHeight
                                            height={this.state.userHeight}
                                            duration={500}>
                                        <div style={{ width: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            <a href="#" style={{ color: 'white', marginLeft: '1em' }}
                                            onClick={(e) => this.logout(e)}>Logout</a>
                                        </div>
                                    </AnimateHeight>
                                </div>

                            </div>
                        </div>

                    </div>
                    <div className="inspire-page-content">
                        <Container>
                            <Row className="inspire-breadcrumb">
                                <Col sm={12}>
                                    <div className="d-flex">
                                        {(projectOid!==undefined)?
                                            <>
                                                <div>
                                                    <a href="/reloaded/dashboard/">Select Plan</a>
                                                </div>
                                                <div className="ml-2">
                                                    <FontAwesomeIcon icon={faAngleRight} />
                                                </div>
                                                <div className="ml-2">
                                                    <a href={`/reloaded/dashboard/project/${projectOid}`}>Investigators</a>
                                                </div>
                                            </>
                                        :''}
                                        {name!==undefined?
                                            <>
                                                <div className="ml-2"><FontAwesomeIcon icon={faAngleRight} /></div>
                                                <div className="ml-2">{name}</div>
                                            </>
                                        :''}
                                    </div>
                                </Col>
                            </Row>
                            <Row className="inspire-content-reloaded">
                                <Col sm={12}>
                                    <Route path={`${this.props.match.path}`} exact
                                        render={(props) => (<ProjectSelector reloaded />)} />
                                    <Route path={`${this.props.match.path}project/:id`} exact
                                        render={(props) => (<InvestigatorList reloaded />)} />
                                    <Route path={`${this.props.match.path}project/:id/investigator/:subid`} exact
                                        render={(props) => (<InvestigatorReloaded reloaded />)} />
                                </Col>
                            </Row>
                        </Container>
                    </div>
                </div>
            </div>);
    }
}

export default connect(mapStateToProps, null)(withRouter(Dashboard));