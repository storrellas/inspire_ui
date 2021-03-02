import React, { useState } from 'react';
// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Row } from 'react-bootstrap';


import { withRouter } from 'react-router-dom'

import { Accordion, Card, Button } from 'react-bootstrap';

// Styles
import "./investigator.scss"
// Assets

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons'

// Project imports
import InvestigatorProfile from '../components/investigator/investigatorprofile'
import InvestigatorSnaphot from '../components/investigator/investigatorsnapshot'

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



const mapDispatchToProps = (dispatch) => {
  return {
    setPanelRendered: (panel) => dispatch(setPanelRendered(panel))
  };
}

class Investigator extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      ... this.getInitialState()
    }
  }

  getInitialState(){
    return {
      tabConnectionsActive: false,
      tabCompanyCooperationActive: false,
      tabAffiliationsActive: false,
      tabFeedbackActive: false,

      tabResearchProfileActive: false,
      tabPublicationsActive: false,
      tabEventsActive: false,
      tabClinicalTrialsActive: false,
    }
  }

  togglePanel(panel) {
    const state = this.getInitialState()
    if (panel === PANEL.CONNECTIONS)
      state.tabConnectionsActive = !this.state.tabConnectionsActive;
    if (panel === PANEL.COMPANY_COOPERATION)
      state.tabCompanyCooperationActive = !this.state.tabCompanyCooperationActive;
    if (panel === PANEL.AFFILIATIONS)
      state.tabAffiliationsActive = !this.state.tabAffiliationsActive;
    if (panel === PANEL.FEEDBACK)
      state.tabFeedbackActive = !this.state.tabFeedbackActive;

    if (panel === PANEL.RESEARCH_PROFILE)
      state.tabResearchProfileActive = !this.state.tabResearchProfileActive;
    if (panel === PANEL.PUBLICATIONS)
      state.tabPublicationsActive = !this.state.tabPublicationsActive;
    if (panel === PANEL.EVENTS)
      state.tabEventsActive = !this.state.tabEventsActive;
    if (panel === PANEL.CLINICAL_TRIALS)
      state.tabClinicalTrialsActive = !this.state.tabClinicalTrialsActive;

    this.setState({ ...state })
  }

  onAnimationEnd(panel){  
    // These panels do not require to trigger action
    if( panel === PANEL.CONNECTIONS || 
        panel === PANEL.AFFILIATIONS ||
        panel === PANEL.FEEDBACK ){
          return
    }    
    this.props.setPanelRendered(panel)
  }

  render() {

    return (
      <Row>
        <Col sm={12} style={{
          backgroundColor: 'white', border: '1px solid',
          borderColor: 'transparent #dee2e6 #dee2e6 #dee2e6', borderRadius: '0 .25rem 0 .25rem',
          minHeight: '50vh', padding: '2em'
        }}>

          <div style={{ borderBottom: '1px solid #ccc', color: 'grey', background: 'white' }}>
            Professor 123
          </div>
          <InvestigatorProfile />
          <InvestigatorSnaphot />

          <Row style={{ marginTop: '1em' }}>
            <Col sm={6}>
              <Panel title="Connections"
                height={this.state.tabConnectionsActive?'auto':0}
                handler={this.togglePanel.bind(this)} panel={PANEL.CONNECTIONS}
                onAnimationEnd={this.onAnimationEnd.bind(this)}>
                <PanelConnections />
              </Panel>
              <Panel title="Company Cooperation"
                height={this.state.tabCompanyCooperationActive?'auto':0}
                handler={this.togglePanel.bind(this)} panel={PANEL.COMPANY_COOPERATION}
                onAnimationEnd={this.onAnimationEnd.bind(this)}>                        
                <PanelCompanyCooperation/>
              </Panel>
              <Panel title="Affiliations"
                height={this.state.tabAffiliationsActive?'auto':0}
                handler={this.togglePanel.bind(this)} panel={PANEL.AFFILIATIONS}
                onAnimationEnd={this.onAnimationEnd.bind(this)}>
                <PanelAffiliations />
              </Panel>
              <Panel title="Feedback"
                height={this.state.tabFeedbackActive?'auto':0}
                handler={this.togglePanel.bind(this)} panel={PANEL.FEEDBACK}
                onAnimationEnd={this.onAnimationEnd.bind(this)}>
                <PanelFeedback />
              </Panel>

            </Col>
            <Col sm={6}>
              <Panel title="Research Profile"
                height={this.state.tabResearchProfileActive?'auto':0}
                handler={this.togglePanel.bind(this)} panel={PANEL.RESEARCH_PROFILE}
                onAnimationEnd={this.onAnimationEnd.bind(this)}>                
                <PanelResearchProfile />
              </Panel>
              <Panel title="Publications"
                height={this.state.tabPublicationsActive?'auto':0}
                handler={this.togglePanel.bind(this)} panel={PANEL.PUBLICATIONS}
                onAnimationEnd={this.onAnimationEnd.bind(this)}>
                <PanelPublications />
              </Panel>
              <Panel title="Events"
                height={this.state.tabEventsActive?'auto':0}
                handler={this.togglePanel.bind(this)} panel={PANEL.EVENTS}
                onAnimationEnd={this.onAnimationEnd.bind(this)}>
                <PanelEvents />
              </Panel>
              <Panel title="Clinical Trials"
                height={this.state.tabClinicalTrialsActive?'auto':0}
                handler={this.togglePanel.bind(this)} panel={PANEL.CLINICAL_TRIALS}
                onAnimationEnd={this.onAnimationEnd.bind(this)}>
                <PanelClinicalTrials />
              </Panel>
            </Col>
          </Row>


        </Col>
      </Row>
    );
  }
}


//export default withRouter(Investigator);
export default connect(undefined, mapDispatchToProps)(withRouter(Investigator))
