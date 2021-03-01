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


import AnimateHeight from 'react-animate-height';

const PANEL = {
  CONNECTIONS: 1,
  COMPANY_COOPERATION: 2,
  AFFILIATIONS: 3,
  FEEDBACK: 4,

  RESEARCH_PROFILE: 5,
  PUBLICATIONS: 6,
  EVENTS: 7,
  CLINICAL_TRIALS: 8,
}

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
        onAnimationEnd={ (e) => props.onAnimationEnd(props.panel) }>
        <div style={{ border: '1px solid #ccc', borderTop: '0', borderRadius: '0 0 5px 5px' }}>
          {props.children}
        </div>
      </AnimateHeight>
    </div>
  );
}


class Investigator extends React.Component {

  constructor(props) {
    super(props)
    this.state = {

      tab_connections: 0,
      tab_company_cooperation: 0,
      tab_affiliations: 0,
      tab_feedback: 0,

      tab_research_profile: 0,
      tab_publications: 0,
      tab_events: 0,
      tab_clinical_trials: 0,
    }
  }

  showPanel(panel) {
    const state = {
      tab_connections: 0,
      tab_company_cooperation: 0,
      tab_affiliations: 0,
      tab_feedback: 0,

      tab_research_profile: 0,
      tab_publications: 0,
      tab_events: 0,
      tab_clinical_trials: 0,
    }
    if (panel === PANEL.CONNECTIONS)
      state.tab_connections = this.state.tab_connections === 0 ? 'auto' : 0;;
    if (panel === PANEL.COMPANY_COOPERATION)
      state.tab_company_cooperation = this.state.tab_company_cooperation === 0 ? 'auto' : 0;;
    if (panel === PANEL.AFFILIATIONS)
      state.tab_affiliations = this.state.tab_affiliations === 0 ? 'auto' : 0;;
    if (panel === PANEL.FEEDBACK)
      state.tab_feedback = this.state.tab_feedback === 0 ? 'auto' : 0;;

    if (panel === PANEL.RESEARCH_PROFILE)
      state.tab_research_profile = this.state.tab_research_profile === 0 ? 'auto' : 0;;
    if (panel === PANEL.PUBLICATIONS)
      state.tab_publications = this.state.tab_publications === 0 ? 'auto' : 0;;
    if (panel === PANEL.EVENTS)
      state.tab_events = this.state.tab_events === 0 ? 'auto' : 0;;
    if (panel === PANEL.CLINICAL_TRIALS)
      state.tab_clinical_trials = this.state.tab_clinical_trials === 0 ? 'auto' : 0;;

    this.setState({ ...state })
  }

  onAnimationEnd(panel){
    console.log("OnAnimation end", panel)
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
          <div>This is my animation</div>                      
          <InvestigatorProfile />
          <InvestigatorSnaphot />

          <Row style={{ marginTop: '1em' }}>
            <Col sm={6}>
              <Panel title="Connections"
                height={this.state.tab_connections}
                handler={this.showPanel.bind(this)} panel={PANEL.CONNECTIONS}
                onAnimationEnd={this.onAnimationEnd.bind(this)}>
                <div><PanelConnections /></div>                
              </Panel>
              <Panel title="Company Cooperation"
                height={this.state.tab_company_cooperation}
                handler={this.showPanel.bind(this)} panel={PANEL.COMPANY_COOPERATION}
                onAnimationEnd={this.onAnimationEnd.bind(this)}>
                <div>This is my animation</div>         
                {/* <div><PanelCompanyCooperation open={this.state.tab_company_cooperation == 'auto'}/></div> */}
              </Panel>
              <Panel title="Affiliations"
                height={this.state.tab_affiliations}
                handler={this.showPanel.bind(this)} panel={PANEL.AFFILIATIONS}
                onAnimationEnd={this.onAnimationEnd.bind(this)}>
                <div>This is my animation</div>    
                {/* <div><PanelAffiliations /></div> */}
              </Panel>
              <Panel title="Feedback"
                height={this.state.tab_feedback}
                handler={this.showPanel.bind(this)} panel={PANEL.FEEDBACK}
                onAnimationEnd={this.onAnimationEnd.bind(this)}>
                <div>This is my animation</div>    
                {/* <div><PanelFeedback /></div> */}
              </Panel>

            </Col>
            <Col sm={6}>
              <Panel title="Research Profile"
                height={this.state.tab_research_profile}
                handler={this.showPanel.bind(this)} panel={PANEL.RESEARCH_PROFILE}
                onAnimationEnd={this.onAnimationEnd.bind(this)}>
                <div>This is my animation</div>                      
                {/* <div><PanelResearchProfile /></div> */}
              </Panel>
              <Panel title="Publications"
                height={this.state.tab_publications}
                handler={this.showPanel.bind(this)} panel={PANEL.PUBLICATIONS}
                onAnimationEnd={this.onAnimationEnd.bind(this)}>
                <div>This is my animation</div>                      
                {/* <div><PanelPublications /></div> */}
              </Panel>
              <Panel title="Events"
                height={this.state.tab_events}
                handler={this.showPanel.bind(this)} panel={PANEL.EVENTS}
                onAnimationEnd={this.onAnimationEnd.bind(this)}>
                  <div>This is my animation</div>                      
                {/* <div><PanelEvents /></div> */}
              </Panel>
              <Panel title="Clinical Trials"
                height={this.state.tab_clinical_trials}
                handler={this.showPanel.bind(this)} panel={PANEL.CLINICAL_TRIALS}
                onAnimationEnd={this.onAnimationEnd.bind(this)}>
                <div>This is my animation</div>                      
                {/* <div><PanelClinicalTrials /></div> */}
              </Panel>
            </Col>
          </Row>


        </Col>
      </Row>
    );
  }
}


export default withRouter(Investigator);
