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
        onClick={props.handler(props.panel)}>
        Connections
  </div>
      <AnimateHeight
        id="example-panel"
        height={props.height}
        duration={250}
        className="AnimateHeight">
        <div style={{ border: '1px solid #ccc' }}>ConnectionsPanel</div>
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
    //console.log("showing panel", panel)
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
    if (panel === PANEL.CONNECTIONS) state.tab_connections_height = true
    if (panel === PANEL.COMPANY_COOPERATION) state.tab_company_cooperation_height = true
    if (panel === PANEL.AFFILIATIONS) state.tab_affiliations_height = true
    if (panel === PANEL.FEEDBACK) state.tab_feedback_height = true

    if (panel === PANEL.RESEARCH_PROFILE) state.tab_research_profile_height = true
    if (panel === PANEL.PUBLICATIONS) state.tab_publications_height = true
    if (panel === PANEL.EVENTS) state.tab_events_height = true
    if (panel === PANEL.CLINICAL_TRIALS) state.tab_clinical_trials_height = true

    this.setState({ ...state })
  }

  render() {
    console.log(" state ", this.state)
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


              {/* <Panel height={this.state.tab_connections_height} handler={this.showPanel.bind(this)} panel={PANEL.CONNECTIONS}/> */}
              <div style={{ backgroundColor: '#F8F8F8', cursor: 'pointer', padding: '1em 0em 1em 1.5em', border: '1px solid #ccc' }}
                onClick={(e) => this.showPanel(PANEL.CONNECTIONS)}>
                Connections
                </div>
              <AnimateHeight
                id="example-panel"
                height={this.state.tab_connections_height}
                duration={250}
                className="AnimateHeight">
                <div style={{ border: '1px solid #ccc' }}>ConnectionsPanel</div>
              </AnimateHeight>

              <div style={{ backgroundColor: '#F8F8F8', cursor: 'pointer', padding: '1em 0em 1em 1.5em', border: '1px solid #ccc' }}
                onClick={(e) => this.showPanel(PANEL.COMPANY_COOPERATION)}>
                Company Cooperation
                </div>
              <AnimateHeight
                id="example-panel"
                height={this.state.tab_company_cooperation_height}
                duration={250}
                className="AnimateHeight">
                <h3>ConnectionsPanel</h3>
              </AnimateHeight>

              <div style={{ backgroundColor: '#F8F8F8', cursor: 'pointer', padding: '1em 0em 1em 1.5em', border: '1px solid #ccc' }}
                onClick={(e) => this.showPanel(PANEL.AFFILIATIONS)}>
                Affiliations
                </div>
              <AnimateHeight
                id="example-panel"
                height={this.state.tab_affiliations_height}
                duration={250}
                className="AnimateHeight">
                <h3>ConnectionsPanel</h3>
              </AnimateHeight>


              <div style={{ backgroundColor: '#F8F8F8', cursor: 'pointer', padding: '1em 0em 1em 1.5em', border: '1px solid #ccc' }}
                onClick={(e) => this.showPanel(PANEL.FEEDBACK)}>
                Feedback
                </div>
              <AnimateHeight
                id="example-panel"
                height={this.state.tab_feedback_height}
                duration={250}
                className="AnimateHeight">
                <h3>ConnectionsPanel</h3>
              </AnimateHeight>

            </div>


            <div className="w-50" style={{ padding: '0 0 0.5em 0' }}>

              <div style={{ backgroundColor: '#F8F8F8', cursor: 'pointer', padding: '1em 0em 1em 1.5em', border: '1px solid #ccc' }}
                onClick={(e) => this.showPanel(PANEL.RESEARCH_PROFILE)}>
                Research Profile
              </div>
              <AnimateHeight
                id="example-panel"
                height={this.state.tab_research_profile_height}
                duration={250}
                className="AnimateHeight">
                <h3>ConnectionsPanel</h3>
              </AnimateHeight>

              <div style={{ backgroundColor: '#F8F8F8', cursor: 'pointer', padding: '1em 0em 1em 1.5em', border: '1px solid #ccc' }}
                onClick={(e) => this.showPanel(PANEL.PUBLICATIONS)}>
                Publications
              </div>
              <AnimateHeight
                id="example-panel"
                height={this.state.tab_publications_height}
                duration={250}
                className="AnimateHeight">
                <h3>ConnectionsPanel</h3>
              </AnimateHeight>

              <div style={{ backgroundColor: '#F8F8F8', cursor: 'pointer', padding: '1em 0em 1em 1.5em', border: '1px solid #ccc' }}
                onClick={(e) => this.showPanel(PANEL.EVENTS)}>
                Events
              </div>
              <AnimateHeight
                id="example-panel"
                height={this.state.tab_events_height}
                duration={250}
                className="AnimateHeight">
                <h3>ConnectionsPanel</h3>
              </AnimateHeight>

              <div style={{ backgroundColor: '#F8F8F8', cursor: 'pointer', padding: '1em 0em 1em 1.5em', border: '1px solid #ccc' }}
                onClick={(e) => this.showPanel(PANEL.CLINICAL_TRIALS)}>
                Clinical Trials
              </div>
              <AnimateHeight
                id="example-panel"
                height={this.state.tab_clinical_trials_height}
                duration={250}
                className="AnimateHeight">
                <h3>ConnectionsPanel</h3>
              </AnimateHeight>

            </div>

          </div>

        </div>
      </div>);
  }
}


export default withRouter(Investigator);
