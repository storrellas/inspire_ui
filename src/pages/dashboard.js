import React from 'react';

// Boostrap
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Container, Navbar, Col, Nav, NavDropdown, Dropdown, Row } from 'react-bootstrap';

// React Router
import { Route } from "react-router-dom";
import { withRouter } from 'react-router-dom'

// Redux
import { setInvestigatorFixedTopProfile } from "../redux";

import { connect } from "react-redux";

// Styles
import "./dashboard.scss"

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faBars, faStar, faAngleRight } from '@fortawesome/free-solid-svg-icons'

// Assets
import inspireLogo from '../assets/logo2.png';

// Project Imports
import DetectMobile from '../components/shared/mobiledetect';

// Project imports
import ProjectSelector from './projectselector';
import InvestigatorList from './investigatorlist';
import InvestigatorListMobile from './investigatorlistmobile';
import InvestigatorFavoriteList from './investigatorfavoritelist';
import Investigator from './investigator';
import InvestigatorReloaded from './investigatorreloaded';
import Profile from './profile';

import AnimateHeight from 'react-animate-height';

const mapStateToProps = (state) => {
    return {
      investigatorProfile: state.investigatorProfile,
    };
}


const mapDispatchToProps = (dispatch) => {
    return {
        setInvestigatorFixedTopProfile: (payload) => dispatch(setInvestigatorFixedTopProfile(payload)),
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

    onScroll(e){
        const scrollTop = e.target.scrollTop;
        let docHeight = e.target.scrollHeight;
        let clientHeight = e.target.clientHeight;
        let scrollPercent = scrollTop *100 / (docHeight - clientHeight);
        if(scrollPercent > 50 ){
            this.props.setInvestigatorFixedTopProfile({investigatorFixedTopProfile: true})
        }else{
            this.props.setInvestigatorFixedTopProfile({investigatorFixedTopProfile: false})
        }
    }

    render() {
        const { isToggled } = this.state;
        const { investigatorProfile } = this.props;
        
        const projectList = JSON.parse(localStorage.getItem('project_permissions'));
        const username = localStorage.getItem('username');

        const { match: { params } } = this.props;        
        const pathNameList = this.props.location.pathname.split('/');
        const projectOid = pathNameList[3];
        const name = investigatorProfile?investigatorProfile.name:undefined
        const section = this.props.location.pathname.split('/')[2];

        const isMobile = DetectMobile()
        return (
            <div style={{ position: 'relative' }}>

                {!isMobile?
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
                :''}

                <div className={isToggled ? "d-flex inspire-wrapper" : "d-flex inspire-wrapper toggled"}>
                    <div className="inspire-overlay"
                        onClick={(e) => this.setState({ isToggled: !isToggled })}></div>

                    <div className="inspire-sidebar">
                        <div className="h-100 d-flex flex-column justify-content-between" style={{ color: 'white', fontSize: '18px', alignItems: 'center' }}>
                            <div>
                                <div className="text-center">
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
                                                <div key={id} className="inspire-submenu-item">
                                                    <a href={`${this.props.match.path}project/${item.oid}`}
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
                                        <span className="align-self-end ml-2" style={{ flexGrow: 1 }}>
                                            <a href={`${this.props.match.path}favorites/`} style={{ color: 'white' }}>
                                                My Favorites
                                            </a>                                            
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="pb-3">
                              <div className="mt-3" style={{ cursor: 'pointer' }}>
                                  <div className="d-flex font-weight-bold">
                                      <div><FontAwesomeIcon icon={faUser} /></div>
                                      <span className="align-self-end ml-2" style={{ flexGrow: 1 }}
                                      onClick={(e) => this.setState({ userHeight: this.state.userHeight == 0 ? 'auto' : 0 })}>{username}</span>

                                  </div>
                                  <AnimateHeight
                                          height={this.state.userHeight}
                                          duration={500}>
                                      <div className="inspire-submenu-item">
                                          <a href="/dashboard/profile" style={{ color: 'white', marginLeft: '1em' }}>Profile</a>
                                      </div>
                                      <div className="inspire-submenu-item">
                                          <a href="#" style={{ color: 'white', marginLeft: '1em' }}
                                          onClick={(e) => this.logout(e)}>Logout</a>
                                      </div>
                                  </AnimateHeight>
                              </div>
                            </div>
                        </div>

                    </div>
                    <div className="inspire-page-content" onScroll={(e) => this.onScroll(e)}>
                      {isMobile?                
                        <div style={{
                          color:'grey', margin: '0.5em',
                          padding: '0.1em 0.4em 0.1em 0.4em'
                        }}>
                          <FontAwesomeIcon icon={faBars}
                            onClick={(e) => this.setState({ isToggled: !isToggled })} />
                        </div>
                      :''}
                      <Container>
                        
                          <Row className={isMobile?'':"inspire-breadcrumb"}>
                              <Col sm={12}>
                                  <div className="d-flex">
                                      {(section!=='')?
                                          <>
                                              <div><a href="/dashboard/">Select Plan</a></div>
                                          </>
                                      :''}                                                
                                      
                                      {(section==='project')?
                                          <>
                                              <div className="ml-2">
                                                  <FontAwesomeIcon icon={faAngleRight} />
                                              </div>
                                              <div className="ml-2">
                                                  {name === undefined?
                                                  <div>Medical Experts</div>
                                                  :                                                    
                                                  <a href={`/dashboard/project/${projectOid}`}>Medical Experts</a>
                                                  }
                                              </div>
                                          </>
                                      :''}

                                      {(section==='favorites')?
                                          <>
                                              <div className="ml-2">
                                                  <FontAwesomeIcon icon={faAngleRight} />
                                              </div>                                        
                                              <div className="ml-2">Favorites</div>
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
                                      render={(props) => (<ProjectSelector />)} />
                                  <Route path={`${this.props.match.path}project/:id`} exact
                                      render={(props) => (isMobile?<InvestigatorListMobile />:<InvestigatorList />)} />
                                  <Route path={`${this.props.match.path}favorites`} exact
                                      render={(props) => (<InvestigatorFavoriteList />)} />
                                  <Route path={`${this.props.match.path}project/:id/investigator/:subid`} exact
                                      render={(props) => (<Investigator />)} />
                                      
                                  <Route path={`${this.props.match.path}project/:id/investigator/reloaded/:subid`} exact
                                      render={(props) => (<InvestigatorReloaded/>)} />

                                  <Route path={`${this.props.match.path}profile`} exact
                                      render={(props) => (<Profile />)} />

                              </Col>
                          </Row>
                      </Container>
                    </div>
                </div>
            </div>);
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Dashboard));