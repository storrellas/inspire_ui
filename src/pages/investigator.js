import React, { useState } from 'react';
// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

import { withRouter } from 'react-router-dom'

import { Accordion, Card, Button } from 'react-bootstrap';

// Styles
import "./investigator.scss"
// Assets

// Project imports

import AnimateHeight from 'react-animate-height';

class Test extends React.Component {
  state = {
    height: "auto"
  };

  handleClick = () => {
    const { height } = this.state;

    this.setState({
      height: height === 0 ? "auto" : 0
    });
  };

  render() {
    const { height } = this.state;

    return (
      <div className="App">
        <button
          aria-controls="example-panel"
          aria-expanded={height !== 0}
          onClick={this.handleClick}
        >
          Toggledsafdsf
        </button>

        <AnimateHeight
          id="example-panel"
          height={height}
          duration={250}
          className="AnimateHeight"
        >
          <h1>Hello</h1>
          <h2>Click toggle button to animate height</h2>
        </AnimateHeight>
      </div>
    );
  }
}


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
          {/*Profile*/}
          <div className="d-flex justify-content-between" style={{ padding: '1em 0 1em 0' }}>
            <div>
              <img src="https://www.la-tour.ch/sites/default/files/styles/latour_medecin_detail/public/medecins/Roman_Sztajzel_H%C3%B4pital_de_La_Tour_0.jpg?itok=4MjHbHW5" width="150"></img>
            </div>

            <div>
              <div className="font-weight-bold">Position</div>
              <div>Physician</div>
              <div className="mt-3 font-weight-bold">Career Stage</div>
              <div>Peak</div>
            </div>

            <div>
              <div className="font-weight-bold">Affiliation</div>
              <div>La Tour Medical Group - Clinique de Carouge</div>
            </div>

            <div>
              <div className="font-weight-bold">Contact</div>
              <div>0041 22 3094540</div>
              <div><a href="mailto:mail@mail.com">mail@mail.com</a></div>
            </div>

            <div>
              <div className="font-weight-bold">Private Contact</div>
              <div>0041 22 3094540</div>
              <div><a href="mailto:mail@mail.com">mail@mail.com</a></div>
            </div>
          </div>

          {/*Snapshot*/}
          <div style={{ border: '1px solid #ccc', padding: '1em 0 1em 0' }}>
            <div className="text-right" style={{ padding: '0 0 1em 0' }}>Last Updated: 25/02/2020</div>

            <div className="d-flex justify-content-between"
              style={{ borderBottom: '1px solid #ccc', padding: '0.5em 1em 0.5em 1em' }}>
              <div className="font-weight-bold">Profile Snapshot</div>
              <div><a href='#'>Go To CV</a></div>
            </div>


            <div className="d-flex justify-content-between"
              style={{ borderBottom: '1px solid #ccc', padding: '0.5em 1em 0.5em 1em' }}>
              <div className="font-weight-bold">Specialties</div>
              <div>Neurology</div>
            </div>

            <div className="d-flex justify-content-between"
              style={{ borderBottom: '1px solid #ccc', padding: '0.5em 1em 0.5em 1em' }}>
              <div className="font-weight-bold">Focus Area</div>
              <div>-</div>
              <div>-</div>
            </div>

            <div className="w-100 d-flex justify-content-between"
              style={{ borderBottom: '1px solid #ccc', padding: '0.5em 1em 0.5em 1em' }}>
              <div className="font-weight-bold" style={{ width: '33%' }}>Publications</div>
              <div className='text-center' style={{ width: '33%' }}>
                <div>First Author</div>
                <div>0</div>
              </div>
              <div className='text-right' style={{ width: '33%' }}>
                <div>Total</div>
                <div>0</div>
              </div>
            </div>

            <div className="d-flex justify-content-between"
              style={{ borderBottom: '1px solid #ccc', padding: '0.5em 1em 0.5em 1em' }}>
              <div className="font-weight-bold" style={{ width: '33%' }}>Coauthors</div>
              <div className='text-center' style={{ width: '33%' }}>
                <div>Same PA</div>
                <div>0</div>
              </div>
              <div className='text-right' style={{ width: '33%' }}>
                <div>Total</div>
                <div>0</div>
              </div>
            </div>

            <div className="d-flex justify-content-between"
              style={{ borderBottom: '1px solid #ccc', padding: '0.5em 1em 0.5em 1em' }}>
              <div className="font-weight-bold" style={{ width: '33%' }}>Events</div>
              <div className='text-center' style={{ width: '33%' }}>
                <div>Chair Person</div>
                <div>0</div>
              </div>
              <div className='text-right' style={{ width: '33%' }}>
                <div>Total</div>
                <div>0</div>
              </div>
            </div>

            <div className="d-flex justify-content-between"
              style={{ borderBottom: '1px solid #ccc', padding: '0.5em 1em 0.5em 1em' }}>
              <div className="font-weight-bold" style={{ width: '33%' }}>Clinical Trials</div>
              <div className='text-center' style={{ width: '33%' }}>
                <div>Recruiting</div>
                <div>0</div>
              </div>
              <div className='text-right' style={{ width: '33%' }}>
                <div>Total</div>
                <div>0</div>
              </div>
            </div>
          </div>

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
                  <h3>ConnectionsPanel</h3>
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
