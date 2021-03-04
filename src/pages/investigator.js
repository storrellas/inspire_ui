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

// Redux
import { 
  setPanelRendered,
  PANEL
} from "../redux";
import { connect } from "react-redux";


import AnimateHeight from 'react-animate-height';

// Project imports
import InvestigatorProfile from '../components/investigator/investigatorprofile'
import InvestigatorSnaphot from '../components/investigator/investigatorsnapshot'

//import PanelConnections from '../components/investigator/panelconnections';
//import PanelCompanyCooperation from '../components/investigator/panelcompanycooperation';
// import PanelAffiliations from '../components/investigator/panelaffiliations';
// import PanelFeedback from '../components/investigator/panelfeedback';

// import PanelResearchProfile from '../components/investigator/panelresearchprofile';
// import PanelPublications from '../components/investigator/panelpublications';
// import PanelEvents from '../components/investigator/panelevents';
// import PanelClinicalTrials from '../components/investigator/panelclinicaltrials';

const PanelConnections = React.lazy(() => import('../components/investigator/panelconnections'));
const PanelCompanyCooperation = React.lazy(() => import('../components/investigator/panelcompanycooperation'));
const PanelAffiliations = React.lazy(() => import('../components/investigator/panelaffiliations'));
const PanelFeedback = React.lazy(() => import('../components/investigator/panelfeedback'));

const PanelResearchProfile = React.lazy(() => import('../components/investigator/panelresearchprofile'));
const PanelPublications = React.lazy(() => import('../components/investigator/panelpublications'));
const PanelEvents = React.lazy(() => import('../components/investigator/panelevents'));
const PanelClinicalTrials = React.lazy(() => import('../components/investigator/panelclinicaltrials'));

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
      panelConnectionsActive: false,
      panelCompanyCooperationActive: false,
      panelAffiliationsActive: false,
      tabFeedbackActive: false,

      panelResearchProfileActive: false,
      panelPublicationsActive: false,
      panelEventsActive: false,
      panelClinicalTrialsActive: false,

      panelConnectionsRendered: false,
      panelCompanyCooperationRendered: false,
      panelAffiliationsRendered: false,
      tabFeedbackRendered: false,

      panelResearchProfileRendered: false,
      panelPublicationsRendered: false,
      panelEventsRendered: false,
      panelClinicalTrialsRendered: false,
    }
  }

  togglePanel(panel) {
    const state = this.getInitialState()
    if (panel === PANEL.CONNECTIONS){
      state.panelConnectionsActive = !this.state.panelConnectionsActive;
      state.panelConnectionsRendered = true;
    } 
    if (panel === PANEL.COMPANY_COOPERATION){
      state.panelCompanyCooperationActive = !this.state.panelCompanyCooperationActive;
      state.panelCompanyCooperationRendered = true;
    } 
    if (panel === PANEL.AFFILIATIONS){
      state.panelAffiliationsActive = !this.state.panelAffiliationsActive;
      state.panelAffiliationsRendered = true;
    }
    if (panel === PANEL.FEEDBACK){
      state.panelFeedbackActive = !this.state.panelFeedbackActive;
      state.panelFeedbackRendered = true;
    }
      

    if (panel === PANEL.RESEARCH_PROFILE){
      state.panelResearchProfileActive = !this.state.panelResearchProfileActive;
      state.panelResearchProfileRendered = true;
    }
    if (panel === PANEL.PUBLICATIONS){
      state.panelPublicationsActive = !this.state.panelPublicationsActive;
      state.panelPublicationsRendered = true;
    }      
    if (panel === PANEL.EVENTS){
      state.panelEventsActive = !this.state.panelEventsActive;
      state.panelEventsRendered = true;
    }      
    if (panel === PANEL.CLINICAL_TRIALS){
      state.panelClinicalTrialsActive = !this.state.panelClinicalTrialsActive;
      state.panelClinicalTrialsRendered = true;
    }


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
        <Col sm={12} className='page-container'>
          <div className="page-title">Professor 123</div>

          <InvestigatorProfile />
          <InvestigatorSnaphot />


          <Suspense fallback={<div>Loading...</div>}>            
            <Row style={{ marginTop: '1em' }}>
              <Col sm={6}>
                <Panel title="Connections"
                  height={this.state.panelConnectionsActive?'auto':0}
                  handler={this.togglePanel.bind(this)} panel={PANEL.CONNECTIONS}
                  onAnimationEnd={this.onAnimationEnd.bind(this)}>
                  <Suspense fallback={<div>Loading...</div>}>
                    {this.state.panelConnectionsRendered?<PanelConnections />:''}
                  </Suspense>
                </Panel>
                <Panel title="Company Cooperation"
                  height={this.state.panelCompanyCooperationActive?'auto':0}
                  handler={this.togglePanel.bind(this)} panel={PANEL.COMPANY_COOPERATION}
                  onAnimationEnd={this.onAnimationEnd.bind(this)}>                        
                  <Suspense fallback={<div>Loading...</div>}>
                    {this.state.panelCompanyCooperationRendered?<PanelCompanyCooperation/>:''}
                  </Suspense>
                </Panel>
                <Panel title="Affiliations"
                  height={this.state.panelAffiliationsActive?'auto':0}
                  handler={this.togglePanel.bind(this)} panel={PANEL.AFFILIATIONS}
                  onAnimationEnd={this.onAnimationEnd.bind(this)}>
                  <Suspense fallback={<div>Loading...</div>}>
                    {this.state.panelAffiliationsRendered?<PanelAffiliations />:''}
                  </Suspense>
                </Panel>
                <Panel title="Feedback"
                  height={this.state.panelFeedbackActive?'auto':0}
                  handler={this.togglePanel.bind(this)} panel={PANEL.FEEDBACK}
                  onAnimationEnd={this.onAnimationEnd.bind(this)}>
                  <Suspense fallback={<div>Loading...</div>}>
                    {this.state.panelFeedbackRendered?<PanelFeedback />:''}
                  </Suspense>
                </Panel>

              </Col>
              <Col sm={6}>
                <Panel title="Research Profile"
                  height={this.state.panelResearchProfileActive?'auto':0}
                  handler={this.togglePanel.bind(this)} panel={PANEL.RESEARCH_PROFILE}
                  onAnimationEnd={this.onAnimationEnd.bind(this)}>                
                  <Suspense fallback={<div>Loading...</div>}>
                    {this.state.panelResearchProfileRendered?<PanelResearchProfile />:''}
                  </Suspense>
                </Panel>
                <Panel title="Publications"
                  height={this.state.panelPublicationsActive?'auto':0}
                  handler={this.togglePanel.bind(this)} panel={PANEL.PUBLICATIONS}
                  onAnimationEnd={this.onAnimationEnd.bind(this)}>
                  <Suspense fallback={<div>Loading...</div>}>
                    {this.state.panelPublicationsRendered?<PanelPublications />:''}
                  </Suspense>                  
                </Panel>
                <Panel title="Events"
                  height={this.state.panelEventsActive?'auto':0}
                  handler={this.togglePanel.bind(this)} panel={PANEL.EVENTS}
                  onAnimationEnd={this.onAnimationEnd.bind(this)}>
                  <Suspense fallback={<div>Loading...</div>}>
                    {this.state.panelEventsRendered?<PanelEvents />:''}
                  </Suspense>                  
                </Panel>
                <Panel title="Clinical Trials"
                  height={this.state.panelClinicalTrialsActive?'auto':0}
                  handler={this.togglePanel.bind(this)} panel={PANEL.CLINICAL_TRIALS}
                  onAnimationEnd={this.onAnimationEnd.bind(this)}>
                  <Suspense fallback={<div>Loading...</div>}>
                    {this.state.panelClinicalTrialsRendered?<PanelClinicalTrials />:''}
                  </Suspense>  

                </Panel>
              </Col>
            </Row>
          </Suspense>



        </Col>
      </Row>
    );
  }
}


//export default withRouter(Investigator);
export default connect(undefined, mapDispatchToProps)(withRouter(Investigator))
