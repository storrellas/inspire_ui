import React, { useState } from 'react';
// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

import { withRouter } from 'react-router-dom'

import { Accordion, Card, Button } from 'react-bootstrap';

// Styles
import "./investigator.scss"
// Assets

// Project imports


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
      tab_clinical_trials: false
    }
  }

  showTab(content){
    console.log("tab", content)

    const state = {
      tab_connections: false,
      tab_company_cooperation: false,
      tab_affiliations: false,
      tab_feedback: false,
      tab_research_profile: false,
      tab_publications: false,
      tab_events: false,
      tab_clinical_trials: false
    }
    if(content === 'connections') state.tab_connections = true
    if(content === 'company_cooperation') state.tab_company_cooperation = true
    if(content === 'affiliations') state.tab_affiliations = true
    if(content === 'feedback') state.tab_feedback = true

    if(content === 'research_profile') state.tab_research_profile = true
    if(content === 'publications') state.tab_publications = true
    if(content === 'events') state.tab_events = true
    if(content === 'clinical_trials') state.tab_clinical_trials = true

    console.log("tab", content, state)
    this.setState({...state})
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
          <div className="d-flex justify-content-between" style={{ padding: '1em 0 1em 0'}}>
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
          <div style={{ border: '1px solid #ccc', padding: '1em 0 1em 0'}}>
            <div className="text-right" style={{ padding: '0 0 1em 0' }}>Last Updated: 25/02/2020</div>
            
            <div className="d-flex justify-content-between" 
                  style={{ borderBottom: '1px solid #ccc', padding: '0.5em 1em 0.5em 1em'}}>
              <div className="font-weight-bold">Profile Snapshot</div>
              <div><a href='#'>Go To CV</a></div>
            </div>
            

            <div className="d-flex justify-content-between" 
                  style={{borderBottom: '1px solid #ccc', padding: '0.5em 1em 0.5em 1em'}}>
              <div className="font-weight-bold">Specialties</div>
              <div>Neurology</div>
            </div>

            <div className="d-flex justify-content-between" 
                  style={{borderBottom: '1px solid #ccc', padding: '0.5em 1em 0.5em 1em'}}>
              <div className="font-weight-bold">Focus Area</div>
              <div>-</div>
              <div>-</div>
            </div>

            <div className="w-100 d-flex justify-content-between" 
                  style={{borderBottom: '1px solid #ccc', padding: '0.5em 1em 0.5em 1em' }}>
              <div className="font-weight-bold" style={{ width: '33%'}}>Publications</div>
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
                    style={{borderBottom: '1px solid #ccc', padding: '0.5em 1em 0.5em 1em'}}>
              <div className="font-weight-bold" style={{ width: '33%'}}>Coauthors</div>
              <div className='text-center' style={{ width: '33%'}}>
                <div>Same PA</div>
                <div>0</div>
              </div>
              <div className='text-right' style={{ width: '33%'}}>
                <div>Total</div>
                <div>0</div>
              </div>
            </div>

            <div className="d-flex justify-content-between" 
                    style={{borderBottom: '1px solid #ccc', padding: '0.5em 1em 0.5em 1em'}}>
              <div className="font-weight-bold" style={{ width: '33%'}}>Events</div>
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
                    style={{borderBottom: '1px solid #ccc', padding: '0.5em 1em 0.5em 1em'}}>
              <div className="font-weight-bold" style={{ width: '33%'}}>Clinical Trials</div>
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
          <div className="d-flex" style={{ padding: '1em 0 0 0'}}>
            <div className="w-50" style={{ padding: '0 0.5em 0 0'}}>


              <div>
                <div style={{ backgroundColor: 'blue', cursor: 'pointer'}} 
                  onClick={(e) => this.setState({tab_connections: !this.state.tab_connections})}>
                  MyTest
                </div>
                <div className={this.state.tab_connections?"inspire-accordion-show":"inspire-accordion-hide"} style={{ backgroundColor: 'red', display:'block'}}>
                  MyTest
                  <br></br>
                  MyTest
                  <br></br>
                  MyTest
                  <br></br>
                  MyTest
                  <br></br>

                  MyTest
                  <br></br>
                  MyTest
                  <br></br>


                </div>

              </div>

              <Accordion defaultActiveKey="0">
                <Card>
                  <Card.Header>
                    <Accordion.Toggle as={Button} variant="transparent" 
                      onClick={ (e) => this.showTab('connections') } eventKey="1">
                      Connections
                    </Accordion.Toggle>
                  </Card.Header>
                  <Accordion.Collapse 
                          className={"accordion-main"} 
                          eventKey="1">
                    <Card.Body>
                      Hello! I'm the bodyasdfadfadsfdsfadsf
                      <br></br>
                      Hello! I'm the bodyasdfadfadsfdsfadsf
                      <br></br>
                      Hello! I'm the bodyasdfadfadsfdsfadsf

                    </Card.Body>
                  </Accordion.Collapse>
                </Card>

                <Card>
                  <Card.Header>
                    <Accordion.Toggle as={Button} variant="transparent" 
                      onClick={ (e) => this.showTab('company_cooperation') }  eventKey="2">
                      Company Cooperation
                    </Accordion.Toggle>
                  </Card.Header>
                  <Accordion.Collapse 
className={"accordion-main"}                          eventKey="2">
                    <Card.Body>Hello! I'm another body</Card.Body>
                  </Accordion.Collapse>
                </Card>

                <Card>
                  <Card.Header>
                    <Accordion.Toggle as={Button} variant="transparent" 
                      onClick={ (e) => this.showTab('affiliations') }  eventKey="3">
                      Affiliations
                    </Accordion.Toggle>
                  </Card.Header>
                  <Accordion.Collapse 
className={"accordion-main"}                          eventKey="3">
                    <Card.Body>Hello! I'm another body</Card.Body>
                  </Accordion.Collapse>
                </Card>

                <Card>
                  <Card.Header>
                    <Accordion.Toggle as={Button} variant="transparent" 
                      onClick={ (e) => this.showTab('feedback') }  eventKey="4">
                      Feedback
                    </Accordion.Toggle>
                  </Card.Header>
                  <Accordion.Collapse 
className={"accordion-main"}                          eventKey="4">
                    <Card.Body>Hello! I'm another body</Card.Body>
                  </Accordion.Collapse>
                </Card>

              </Accordion>
            </div>


            <div className="w-50" style={{ padding: '0 0 0.5em 0'}}>
              <Accordion defaultActiveKey="0">
                <Card>
                  <Card.Header>
                    <Accordion.Toggle as={Button} variant="transparent"  
                      onClick={ (e) => this.showTab('research_profile') }  eventKey="1">
                      Research Profile
                    </Accordion.Toggle>
                  </Card.Header>
                  <Accordion.Collapse 
                          className={this.state.tab_research_profile?"accordion-main show":"accordion-main"} 
                          eventKey="1">
                    <Card.Body>Hello! I'm the body</Card.Body>
                  </Accordion.Collapse>
                </Card>

                <Card>
                  <Card.Header>
                    <Accordion.Toggle as={Button} variant="transparent"  
                      onClick={ (e) => this.showTab('publications') }   eventKey="2">
                      Publications
                    </Accordion.Toggle>
                  </Card.Header>
                  <Accordion.Collapse 
                          className={this.state.tab_publications?"accordion-main show":"accordion-main"} 
                          eventKey="2">
                    <Card.Body>Hello! I'm another body</Card.Body>
                  </Accordion.Collapse>
                </Card>

                <Card>
                  <Card.Header>
                    <Accordion.Toggle as={Button} variant="transparent"  
                      onClick={ (e) => this.showTab('events') }    eventKey="3">
                      Events
                    </Accordion.Toggle>
                  </Card.Header>
                  <Accordion.Collapse 
                          className={this.state.tab_events?"accordion-main show":"accordion-main"} 
                          eventKey="3">
                    <Card.Body>Hello! I'm another body</Card.Body>
                  </Accordion.Collapse>
                </Card>

                <Card>
                  <Card.Header>
                    <Accordion.Toggle as={Button} variant="transparent"  
                      onClick={ (e) => this.showTab('clinical_trials') }     eventKey="4">
                      Clinical Trials
                    </Accordion.Toggle>
                  </Card.Header>
                  <Accordion.Collapse 
                          className={this.state.tab_clinical_trials?"accordion-main show":"accordion-main"} 
                          eventKey="4">
                    <Card.Body>Hello! I'm another body</Card.Body>
                  </Accordion.Collapse>
                </Card>

              </Accordion>
            </div>

          </div>

        </div>
      </div>);
  }
}


export default withRouter(Investigator);
