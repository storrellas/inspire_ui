import React, { Suspense } from 'react';
// Bootstrap
import { Col, Row, InputGroup, FormControl, Button, Nav } from 'react-bootstrap';

// React Router
import { withRouter } from 'react-router-dom'

// Loading Overlay
import LoadingOverlay from 'react-loading-overlay';


// Styles
import "./investigator.scss"

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight, faAngleDown, faStar, faSearch, faArrowCircleDown, faNewspaper } from '@fortawesome/free-solid-svg-icons'


// Project imports
import InvestigatorProfile from '../components/investigator/investigatorprofile'

// Redux
import { setPanelRendered, PANEL, resetPanel } from "../redux";
import { connect } from "react-redux";


import PanelConnections from '../components/investigator/panelconnections';
import PanelCompanyCooperation from '../components/investigator/panelcompanycooperation';
import PanelAffiliations from '../components/investigator/panelaffiliations';
import PanelFeedback from '../components/investigator/panelfeedback';

import PanelResearchProfile from '../components/investigator/panelresearchprofile';
import PanelPublications from '../components/investigator/panelpublications';
import PanelEvents from '../components/investigator/panelevents';
import PanelClinicalTrials from '../components/investigator/panelclinicaltrials';


const mapDispatchToProps = (dispatch) => {
  return {
    setPanelRendered: (panel) => dispatch(setPanelRendered(panel)),
    resetPanel: () => dispatch(resetPanel())
  };
}

const mapStateToProps = (state) => {
  return {
    investigatorProfile: state.investigatorProfile,
  };
}


class Investigator extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      panel: PANEL.CONNECTIONS,
    }
  }

  componentDidMount(){
    this.props.resetPanel()
    
    const that = this;
    setTimeout(function(){ that.props.setPanelRendered(PANEL.CONNECTIONS) }, 1000);
  }

  onSetPanel(panel) {      
    this.setState({ panel })
    // These panels do not require to trigger action
    if( panel === PANEL.AFFILIATIONS ||
      panel === PANEL.FEEDBACK ){
        return
    }    
    this.props.setPanelRendered(panel)
  }

  render() {


    const { panel } = this.state;
    
    return (
      <>
        <Row className="mt-3">
          <Col sm={6}>
            <InputGroup className="mb-2" >
              <InputGroup.Prepend>
                <InputGroup.Text style={{ borderRadius: '20px 0 0 20px', backgroundColor: 'white', borderRight: 0 }}>
                  <FontAwesomeIcon icon={faSearch} />
                </InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl placeholder="Search by names, position, field of study"
                style={{ borderLeft: 0, borderRadius: '0 20px 20px 0', }} />
            </InputGroup>
          </Col>
          <Col sm={2}>
            <Button className="w-100 inspire-ghost-button inspire-box-shadow" variant="outline-primary">
              <FontAwesomeIcon icon={faArrowCircleDown} className="mr-2" />
              Export
            </Button>
          </Col>
          <Col sm={2}>
            <Button className="w-100 inspire-ghost-button inspire-box-shadow" variant="outline-primary"
              style={{ paddingLeft: 0, paddingRight: 0 }}>
              <FontAwesomeIcon icon={faStar} className="mr-2" />
              Add to Favorites
            </Button>
          </Col>
          <Col sm={2}>
            <Button className="w-100 inspire-button inspire-box-shadow" variant="primary">Open Project</Button>{' '}
          </Col>
        </Row>

        <InvestigatorProfile />

        <Row className="pb-3" style={{ marginTop: '4em'}}>
          <Col sm={12}>
            <Nav variant="tabs" style={{ width: '100%', justifyContent: 'space-between' }}>
              <Nav.Item>
                <Nav.Link href="#" active={panel == PANEL.CONNECTIONS} 
                  onClick={(e) => this.onSetPanel(PANEL.CONNECTIONS)}><b>Connections</b></Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="#" active={panel == PANEL.COMPANY_COOPERATION} 
                  onClick={(e) => this.onSetPanel(PANEL.COMPANY_COOPERATION)}><b>Company Cooperation</b></Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="#" active={panel == PANEL.AFFILIATIONS} 
                  onClick={(e) => this.onSetPanel(PANEL.AFFILIATIONS)}><b>Affiliations</b></Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="#" active={panel == PANEL.RESEARCH_PROFILE} 
                  onClick={(e) => this.onSetPanel(PANEL.RESEARCH_PROFILE)}><b>Research Profile</b></Nav.Link>
              </Nav.Item>


              <Nav.Item>
                <Nav.Link href="#" active={panel == PANEL.PUBLICATIONS} 
                  onClick={(e) => this.onSetPanel(PANEL.PUBLICATIONS)}><b>Publications</b></Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="#" active={panel == PANEL.EVENTS} 
                  onClick={(e) => this.onSetPanel(PANEL.EVENTS)}><b>Events</b></Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="#" active={panel == PANEL.CLINICAL_TRIALS} 
                  onClick={(e) => this.onSetPanel(PANEL.CLINICAL_TRIALS)}><b>Clinical Trials</b></Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="#" active={panel == PANEL.FEEDBACK} 
                  onClick={(e) => this.onSetPanel(PANEL.FEEDBACK)}><b>Feedback</b></Nav.Link>
              </Nav.Item>

            </Nav>
            <div className={panel === PANEL.CONNECTIONS ? 'inspire-panel-content' : 'd-none'}>
                <PanelConnections reloaded />
            </div>
            <div className={panel === PANEL.COMPANY_COOPERATION ? 'inspire-panel-content' : 'd-none'}>
              <PanelCompanyCooperation/>
            </div>
            <div className={panel === PANEL.AFFILIATIONS ? 'inspire-panel-content' : 'd-none'}>
              <PanelAffiliations />
            </div>
            <div className={panel === PANEL.RESEARCH_PROFILE ? 'inspire-panel-content' : 'd-none'}>
              <PanelResearchProfile />                
            </div>


            <div className={panel === PANEL.PUBLICATIONS ? 'inspire-panel-content' : 'd-none'}>
              <PanelPublications />
            </div>
            <div className={panel === PANEL.EVENTS ? 'inspire-panel-content' : 'd-none'}>
              <PanelEvents />
            </div>
            <div className={panel === PANEL.CLINICAL_TRIALS ? 'inspire-panel-content' : 'd-none'}>
              <PanelClinicalTrials />
            </div>
            <div className={panel === PANEL.FEEDBACK ? 'inspire-panel-content' : 'd-none'}>
              <PanelFeedback />
            </div>



          </Col>
        </Row>
      </>
    );
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Investigator))

