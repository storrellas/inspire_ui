import React, { Suspense } from 'react';
// Bootstrap
import { Col, Row, Modal, Button, Nav } from 'react-bootstrap';

// React Router
import { withRouter } from 'react-router-dom'

// Loading Overlay
import LoadingOverlay from 'react-loading-overlay';

// Axios
import axios from 'axios';

// Styles
import "./investigator.scss"

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons'
import { faAngleRight, faAngleDown, faStar, faSearch, faArrowCircleDown, faNewspaper } from '@fortawesome/free-solid-svg-icons'


// Project imports
import InvestigatorProfile from '../components/investigator/investigatorprofile'

// Redux
import { setPanelRendered, PANEL, resetPanel } from "../redux";
import { connect } from "react-redux";

// React Select
import Select from 'react-select';


// Panels
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
      isFavorite: false,
      meshOptions: [],
      showMeshScore: false,
      meshScore: 0,
      mesh: { value: '', label: ''},
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

  async onSetInvestigatorFavorite(){
    try{
      let { isFavorite } = this.state;

      // Grab ME oid
      const { match: { params } } = this.props;
      const oid = params.subid;

      // Set selection      
      let shortOid = oid.split('-')[oid.split('-').length -1 ]
      const token = localStorage.getItem('token')
      const baseUrl = isFavorite?
        `${process.env.REACT_APP_BASE_URL}/api/remove-favorite-investigators/`:
        `${process.env.REACT_APP_BASE_URL}/api/add-favorite-investigators/`;
      const body = { ids: [ shortOid ] }
      const response = await axios.post(baseUrl, body,
        { headers: { "Authorization": "jwt " + token }
      })

      this.setState({isFavorite: !isFavorite})
    }catch(error){

      // Error
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
          console.log(error.request);
      } else {
          console.log('Error', error.message);
      }

    } 

  }

  async loadMesh(pattern){

    try{
      this.setState({isLoadingMesh: true})

      const token = localStorage.getItem('token')
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/meshs/?limit=10&ordering=name&name=${pattern}`,
        { headers: { "Authorization": "jwt " + token }
      })

      // Autocomplete
      const meshOptions = []
      for(const mesh of response.data.results ){
        meshOptions.push({value:mesh.oid, label: mesh.name})
      }
      this.setState({meshOptions: meshOptions, isLoadingMesh:false})
    }catch(error){

      // Error
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
          console.log(error.request);
      } else {
          console.log('Error', error.message);
      }

    }   
  }

  onMeshFill(pattern){
    const that = this;

    // Clear timeout
    if ( this.typingTimeout ) {
      clearTimeout(this.typingTimeout);
    }
    this.typingTimeout = 
      setTimeout(function () {that.loadMesh(pattern);}, 1000)
  }

  onMeshSelected(mesh){
    const { currentPage } = this.state;

    // Check if mesh is undefined
    if( mesh === undefined || mesh === null ){
      // Do nothing
      return
    }

    // Set selection
    let meshOid = mesh.value
    meshOid = meshOid.split('-')[meshOid.split('-').length -1 ]
    meshOid = parseInt( meshOid )

    this.setState({showMeshScore: true, mesh: mesh})
  }




  render() {

    const { panel, showMeshScore } = this.state;

    console.log("showMeshScore ", showMeshScore)
    return (
      <>

        <Row className="mt-3">
          <Col sm={7}>

            <div className="d-flex">
                <div className="d-flex justify-content-center flex-column pl-3 pr-2" 
                  style={{ background: 'white', border: '1px solid #ced4da', borderRight: 0, borderRadius: '20px 0 0 20px'}}>
                  <FontAwesomeIcon icon={faSearch}/>
                </div>                
                <Select isLoading={this.state.isLoadingMesh} isClearable 
                    isSearchable options={this.state.meshOptions} 
                    onInputChange={(e) => this.onMeshFill(e)} 
                    onChange={ (e) => this.onMeshSelected(e)}
                    placeholder={'Search by names, position, field of study'}
                    styles={{ 
                      control: (provided) => ({ ...provided, borderLeft: 0, borderRadius: '0 20px 20px 0'}),
                      indicatorsContainer: (provided) => ({ ...provided, width:0, overflow: 'hidden'}),
                    }}
                    className="w-100 inspire-form-control"
                    />
            </div>

            <Modal show={showMeshScore} onHide={e => this.setState({showMeshScore: false})} centered>
              <Modal.Header closeButton>
                <Modal.Title>Activities</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div>65</div>
                <div>{this.state.mesh.label}</div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="primary" onClick={e => this.setState({showMeshScore: false})}>
                  OK
                </Button>
              </Modal.Footer>
            </Modal>

          </Col>

          <Col sm={3}>
            <Button className="w-100 inspire-ghost-button inspire-box-shadow" variant="outline-primary"
              style={{ paddingLeft: 0, paddingRight: 0 }} onClick={(e) => this.onSetInvestigatorFavorite()}>
              <FontAwesomeIcon icon={this.state.isFavorite?farStar:faStar} className="mr-2" />
              {this.state.isFavorite?"Remove from Favorites":"Add to Favorites"}
            </Button>
          </Col>
          <Col sm={2}>
            <Button className="w-100 inspire-button inspire-box-shadow" variant="primary"
            onClick={ (e) => this.props.history.push(`/dashboard/`)}>Open Project</Button>{' '}
          </Col>
        </Row>



        <InvestigatorProfile />

        <Row className="pb-3" style={{ marginTop: '4em'}}>
          <Col sm={12}>
            <Nav variant="tabs" style={{ width: '100%' }}>
              <Nav.Item className="mr-2">
                <Nav.Link href="#" active={panel == PANEL.CONNECTIONS} 
                  onClick={(e) => this.onSetPanel(PANEL.CONNECTIONS)}><b>Connections</b></Nav.Link>
              </Nav.Item>
              <Nav.Item className="mr-2">
                <Nav.Link href="#" active={panel == PANEL.COMPANY_COOPERATION} 
                  onClick={(e) => this.onSetPanel(PANEL.COMPANY_COOPERATION)}><b>Company Cooperation</b></Nav.Link>
              </Nav.Item>
              <Nav.Item className="mr-2">
                <Nav.Link href="#" active={panel == PANEL.AFFILIATIONS} 
                  onClick={(e) => this.onSetPanel(PANEL.AFFILIATIONS)}><b>Affiliations</b></Nav.Link>
              </Nav.Item>
              <Nav.Item className="mr-2">
                <Nav.Link href="#" active={panel == PANEL.RESEARCH_PROFILE} 
                  onClick={(e) => this.onSetPanel(PANEL.RESEARCH_PROFILE)}><b>Research Profile</b></Nav.Link>
              </Nav.Item>


              <Nav.Item className="mr-2">
                <Nav.Link href="#" active={panel == PANEL.PUBLICATIONS} 
                  onClick={(e) => this.onSetPanel(PANEL.PUBLICATIONS)}><b>Publications</b></Nav.Link>
              </Nav.Item>
              <Nav.Item className="mr-2">
                <Nav.Link href="#" active={panel == PANEL.EVENTS} 
                  onClick={(e) => this.onSetPanel(PANEL.EVENTS)}><b>Events</b></Nav.Link>
              </Nav.Item>
              <Nav.Item className="mr-2">
                <Nav.Link href="#" active={panel == PANEL.CLINICAL_TRIALS} 
                  onClick={(e) => this.onSetPanel(PANEL.CLINICAL_TRIALS)}><b>Clinical Trials</b></Nav.Link>
              </Nav.Item>
              <Nav.Item className="mr-2">
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

