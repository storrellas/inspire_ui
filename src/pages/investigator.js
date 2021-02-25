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


class Investigator extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      tab_connections: false,
      tab_company_cooperation: false,
      tab_affiliations: false,
      tab_feedback: false,
      tab_research_profile: false,
      tab_publications: false,
      tab_events: false,
      tab_clinical_trials: false,
      height: 0,

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

  showTab(content) {

    const state = {
      tab_connections: false,
      tab_company_cooperation: false,
      tab_affiliations: false,
      tab_feedback: false,
      tab_research_profile: false,
      tab_publications: false,
      tab_events: false,
      tab_clinical_trials: false,
      height: 0
    }
    if (content === 'connections') state.tab_connections = true
    if (content === 'company_cooperation') state.tab_company_cooperation = true
    if (content === 'affiliations') state.tab_affiliations = true
    if (content === 'feedback') state.tab_feedback = true

    if (content === 'research_profile') state.tab_research_profile = true
    if (content === 'publications') state.tab_publications = true
    if (content === 'events') state.tab_events = true
    if (content === 'clinical_trials') state.tab_clinical_trials = true

    console.log("tab", content, state)
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

          {/*ResearchTopics*/}
          <div className="d-flex" style={{ padding: '1em 0 0 0' }}>
            <div className="w-50" style={{ padding: '0 0.5em 0 0' }}>

              
                <div style={{ backgroundColor: '#F8F8F8', cursor: 'pointer', padding: '1em 0em 1em 1.5em', border: '1px solid #ccc' }}
                  onClick={(e) => this.setState({ tab_connections_height: this.state.tab_connections_height === 0 ? "auto" : 0 })}>
                  Connections
                </div>
                <AnimateHeight
                  id="example-panel"
                  height={this.state.tab_connections_height}
                  duration={250}
                  className="AnimateHeight">
                  <div style={{border: '1px solid #ccc'}}>ConnectionsPanel</div>
                </AnimateHeight>
              
                <div style={{ backgroundColor: '#F8F8F8', cursor: 'pointer', padding: '1em 0em 1em 1.5em', border: '1px solid #ccc' }}
                  onClick={(e) => this.setState({ tab_company_cooperation_height: this.state.tab_company_cooperation_height === 0 ? "auto" : 0 })}>
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
                  onClick={(e) => this.setState({ tab_affiliations_height: this.state.tab_affiliations_height === 0 ? "auto" : 0 })}>
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
                  onClick={(e) => this.setState({ tab_feedback_height: this.state.tab_feedback_height === 0 ? "auto" : 0 })}>
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
                onClick={(e) => this.setState({ tab_research_profile_height: this.state.tab_research_profile_height === 0 ? "auto" : 0 })}>
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
                onClick={(e) => this.setState({ tab_publications_height: this.state.tab_publications_height === 0 ? "auto" : 0 })}>
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
                onClick={(e) => this.setState({ tab_events_height: this.state.tab_events_height === 0 ? "auto" : 0 })}>
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
                onClick={(e) => this.setState({ tab_clinical_trials_height: this.state.tab_clinical_trials_height === 0 ? "auto" : 0 })}>
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
