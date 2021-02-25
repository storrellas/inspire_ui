import React, { useState } from 'react';
// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

import { withRouter } from 'react-router-dom'

import { Accordion, Card, Button } from 'react-bootstrap';

// Styles
import "./investigator.scss"
// Assets

// Project imports
import InvestigatorProfile from '../components/investigator/investigatorprofile'
import InvestigatorSnaphot from '../components/investigator/investigatorsnapshot'

import PanelConnections from '../components/investigator/panelconnections'
import PanelCompanyCooperation from '../components/investigator/panelcompanycooperation'

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

  return (
    <div>
      <div style={{ backgroundColor: '#F8F8F8', cursor: 'pointer', padding: '1em 0em 1em 1.5em', border: '1px solid #ccc' }}
        onClick={(e) => props.handler(props.panel)}>
        {props.title}
      </div>
      <AnimateHeight
        id="example-panel"
        height={props.height}
        duration={250}
        className="AnimateHeight">
        <div style={{ border: '1px solid #ccc' }}>
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

      tab_connections_height: 0,
      tab_company_cooperation_height: 0,
      tab_affiliations_height: 0,
      tab_feedback_height: 0,

      tab_research_profile_height: 0,
      tab_publications_height: 0,
      tab_events_height: 0,
      tab_clinical_trials_height: 0,
    }
  }

  showPanel(panel) {
    const state = {
      tab_connections_height: 0,
      tab_company_cooperation_height: 0,
      tab_affiliations_height: 0,
      tab_feedback_height: 0,

      tab_research_profile_height: 0,
      tab_publications_height: 0,
      tab_events_height: 0,
      tab_clinical_trials_height: 0,
    }
    if (panel === PANEL.CONNECTIONS) 
      state.tab_connections_height = this.state.tab_connections_height === 0 ? 'auto' : 0;;
    if (panel === PANEL.COMPANY_COOPERATION) 
      state.tab_company_cooperation_height = this.state.tab_company_cooperation_height === 0 ? 'auto' : 0;;
    if (panel === PANEL.AFFILIATIONS) 
      state.tab_affiliations_height = this.state.tab_affiliations_height === 0 ? 'auto' : 0;;
    if (panel === PANEL.FEEDBACK) 
      state.tab_feedback_height = this.state.tab_feedback_height === 0 ? 'auto' : 0;;

    if (panel === PANEL.RESEARCH_PROFILE) 
      state.tab_research_profile_height = this.state.tab_research_profile_height === 0 ? 'auto' : 0;;
    if (panel === PANEL.PUBLICATIONS) 
      state.tab_publications_height = this.state.tab_publications_height === 0 ? 'auto' : 0;;
    if (panel === PANEL.EVENTS) 
      state.tab_events_height = this.state.tab_events_height === 0 ? 'auto' : 0;;
    if (panel === PANEL.CLINICAL_TRIALS) 
      state.tab_clinical_trials_height = this.state.tab_clinical_trials_height === 0 ? 'auto' : 0;;

    this.setState({ ...state })
  }

  render() {


    return (
      <div style={{
        backgroundColor: 'white', border: '1px solid',
        borderColor: 'transparent #dee2e6 #dee2e6 #dee2e6', borderRadius: '0 .25rem 0 .25rem',
        minHeight: '50vh', padding: '2em'
      }}>
        <div className="w-100">
          <div style={{ borderBottom: '1px solid #ccc', color: 'grey', background: 'white' }}>
            Professor 123
          </div>

          <InvestigatorProfile />
          <InvestigatorSnaphot />

          <div className="d-flex" style={{ padding: '1em 0 0 0' }}>
            <div className="w-50" style={{ padding: '0 0.5em 0 0' }}>
              <Panel title="Connections" 
                  height={this.state.tab_connections_height} 
                    handler={this.showPanel.bind(this)} panel={PANEL.CONNECTIONS}>
                <div>
                  <PanelConnections />
                </div>
              </Panel>
              <Panel title="Company Cooperation" 
                  height={this.state.tab_company_cooperation_height} 
                    handler={this.showPanel.bind(this)} panel={PANEL.COMPANY_COOPERATION}>
                <div><PanelCompanyCooperation /></div>
              </Panel>
              <Panel title="Affiliations" 
                  height={this.state.tab_affiliations_height} 
                    handler={this.showPanel.bind(this)} panel={PANEL.AFFILIATIONS}>
                <div>This is my test</div>
              </Panel>
              <Panel title="Feedback" 
                  height={this.state.tab_feedback_height} 
                    handler={this.showPanel.bind(this)} panel={PANEL.FEEDBACK}>
                <div>This is my test</div>
              </Panel>
            </div>

            <div className="w-50" style={{ padding: '0 0 0.5em 0' }}>
              <Panel title="Research Profile" 
                  height={this.state.tab_research_profile_height} 
                    handler={this.showPanel.bind(this)} panel={PANEL.RESEARCH_PROFILE}>
                <div>This is my test</div>
              </Panel>
              <Panel title="Publications" 
                  height={this.state.tab_publications_height} 
                    handler={this.showPanel.bind(this)} panel={PANEL.PUBLICATIONS}>
                <div>This is my test</div>
              </Panel>
              <Panel title="Events" 
                  height={this.state.tab_events_height} 
                    handler={this.showPanel.bind(this)} panel={PANEL.EVENTS}>
                <div>This is my test</div>
              </Panel>
              <Panel title="Clinical Trials" 
                  height={this.state.tab_clinical_trials_height} 
                    handler={this.showPanel.bind(this)} panel={PANEL.CLINICAL_TRIALS}>
                <div>This is my test</div>
              </Panel>
            </div>

          </div>

        </div>
      </div>);
  }
}


export default withRouter(Investigator);
