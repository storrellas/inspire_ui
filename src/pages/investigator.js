import React, { Suspense } from 'react';
// Bootstrap
import { Col, Row } from 'react-bootstrap';

// React Router
import { withRouter } from 'react-router-dom'

// Loading Overlay
import LoadingOverlay from 'react-loading-overlay';

// Styles
import "./investigator.scss"


// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons'

// Project imports
import InvestigatorProfile from '../components/investigator/investigatorprofile'

import PanelConnections from '../components/investigator/panelconnections';
import PanelCompanyCooperation from '../components/investigator/panelcompanycooperation';
import PanelAffiliations from '../components/investigator/panelaffiliations';
import PanelFeedback from '../components/investigator/panelfeedback';

import PanelResearchProfile from '../components/investigator/panelresearchprofile';
import PanelPublications from '../components/investigator/panelpublications';
import PanelEvents from '../components/investigator/panelevents';
import PanelClinicalTrials from '../components/investigator/panelclinicaltrials';


// Redux
import { 
  setPanelRendered,
  PANEL
} from "../redux";
import { connect } from "react-redux";


import AnimateHeight from 'react-animate-height';


function Panel(props) {

  const classNameStr = (props.height === 0) ? "panel-caret mr-2" : "panel-caret active mr-2";
  return (
    <div style={{ padding: '0.2em 0 0.2em 0' }}>
      <div style={{ backgroundColor: '#F8F8F8', cursor: 'pointer', padding: '1em 0em 1em 1.5em', border: '1px solid #ccc', borderRadius: '5px 5px 0 0' }}
        onClick={(e) => props.handler(props.panel)}>
        <b><FontAwesomeIcon icon={faCaretDown} className={classNameStr} />{props.title}</b>
      </div>
      <AnimateHeight
        id="example-panel"
        height={props.height}
        duration={250}
        className="AnimateHeight"
        onAnimationEnd={ (e) => {
          props.onAnimationEnd(props.panel) 

        }}>
        <div style={{ border: '1px solid #ccc', borderTop: '0', borderRadius: '0 0 5px 5px' }}>
          {props.children}
        </div>
      </AnimateHeight>
    </div>
  );
}

function LoadingOverlayContainer(props) {

  const classNameStr = (props.height === 0) ? "panel-caret mr-2" : "panel-caret active mr-2";
  return (
    <LoadingOverlay
            active
            spinner
            text="Loading ...">
            <div style={{ height: '200px' }}></div>
    </LoadingOverlay>
  );
}


const mapDispatchToProps = (dispatch) => {
  return {
    setPanelRendered: (panel) => dispatch(setPanelRendered(panel))
  };
}

class Investigator extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      ... this.getInitialState(),
      showPanels: false,
    }
  }

  getInitialState(){
    return {
      panelConnectionsActive: false,
      panelCompanyCooperationActive: false,
      panelAffiliationsActive: false,
      tabFeedbackActive: false,

      panelResearchProfileActive: false,
      panelPublicationsActive: false,
      panelEventsActive: false,
      panelClinicalTrialsActive: false,
    }
  }

  togglePanel(panel) {
    const state = this.getInitialState()
    if (panel === PANEL.CONNECTIONS)
      state.panelConnectionsActive = !this.state.panelConnectionsActive;
    if (panel === PANEL.COMPANY_COOPERATION)
      state.panelCompanyCooperationActive = !this.state.panelCompanyCooperationActive;
    if (panel === PANEL.AFFILIATIONS)
      state.panelAffiliationsActive = !this.state.panelAffiliationsActive;
    if (panel === PANEL.FEEDBACK)
      state.panelFeedbackActive = !this.state.panelFeedbackActive;

    if (panel === PANEL.RESEARCH_PROFILE)
      state.panelResearchProfileActive = !this.state.panelResearchProfileActive;
    if (panel === PANEL.PUBLICATIONS)
      state.panelPublicationsActive = !this.state.panelPublicationsActive;
    if (panel === PANEL.EVENTS)
      state.panelEventsActive = !this.state.panelEventsActive;
    if (panel === PANEL.CLINICAL_TRIALS)
      state.panelClinicalTrialsActive = !this.state.panelClinicalTrialsActive;

    this.setState({ ...state })
  }

  onAnimationEnd(panel){  
    // These panels do not require to trigger action
    if( panel === PANEL.AFFILIATIONS ||
        panel === PANEL.FEEDBACK ){
          return
    }    
    this.props.setPanelRendered(panel)
  }

  componentDidMount(){
    const that = this;
    setTimeout(function () { that.setState({showPanels:true}) }, 500);
  }

  render() {

    return (
      <Row>
        <Col sm={12} className='page-container'>
          <InvestigatorProfile />

          <Suspense fallback={<div style={{color: 'black' }}>Loading...</div>}>
            {this.state.showPanels?          
            <Row style={{ marginTop: '1em' }}>
              <Col sm={6}>
                <Panel title="Connections"
                  height={this.state.panelConnectionsActive?'auto':0}
                  handler={this.togglePanel.bind(this)} panel={PANEL.CONNECTIONS}
                  onAnimationEnd={this.onAnimationEnd.bind(this)}>
                  <PanelConnections />
                </Panel>
                <Panel title="Company Cooperation"
                  height={this.state.panelCompanyCooperationActive?'auto':0}
                  handler={this.togglePanel.bind(this)} panel={PANEL.COMPANY_COOPERATION}
                  onAnimationEnd={this.onAnimationEnd.bind(this)}>                        
                  <PanelCompanyCooperation/>
                </Panel>
                <Panel title="Affiliations"
                  height={this.state.panelAffiliationsActive?'auto':0}
                  handler={this.togglePanel.bind(this)} panel={PANEL.AFFILIATIONS}
                  onAnimationEnd={this.onAnimationEnd.bind(this)}>
                  <PanelAffiliations />
                </Panel>
                <Panel title="Feedback"
                  height={this.state.panelFeedbackActive?'auto':0}
                  handler={this.togglePanel.bind(this)} panel={PANEL.FEEDBACK}
                  onAnimationEnd={this.onAnimationEnd.bind(this)}>
                  <PanelFeedback />
                </Panel>

              </Col>
              <Col sm={6}>
                <Panel title="Research Profile"
                  height={this.state.panelResearchProfileActive?'auto':0}
                  handler={this.togglePanel.bind(this)} panel={PANEL.RESEARCH_PROFILE}
                  onAnimationEnd={this.onAnimationEnd.bind(this)}>                
                  <PanelResearchProfile />
                </Panel>
                <Panel title="Publications"
                  height={this.state.panelPublicationsActive?'auto':0}
                  handler={this.togglePanel.bind(this)} panel={PANEL.PUBLICATIONS}
                  onAnimationEnd={this.onAnimationEnd.bind(this)}>
                  <PanelPublications />
                </Panel>
                <Panel title="Events"
                  height={this.state.panelEventsActive?'auto':0}
                  handler={this.togglePanel.bind(this)} panel={PANEL.EVENTS}
                  onAnimationEnd={this.onAnimationEnd.bind(this)}>
                  <PanelEvents />
                </Panel>
                <Panel title="Clinical Trials"
                  height={this.state.panelClinicalTrialsActive?'auto':0}
                  handler={this.togglePanel.bind(this)} panel={PANEL.CLINICAL_TRIALS}
                  onAnimationEnd={this.onAnimationEnd.bind(this)}>
                  <PanelClinicalTrials />
                </Panel>
              </Col>
            </Row>
            :<LoadingOverlayContainer />}
          </Suspense>



        </Col>
      </Row>
    );
  }
}

export default connect(undefined, mapDispatchToProps)(withRouter(Investigator))
