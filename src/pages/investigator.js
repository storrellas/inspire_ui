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
import { setInvestigatorProfile, setPanelActive, PANEL } from "../redux";
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
    setPanelActive: (panel) => dispatch(setPanelActive(panel)),
    setInvestigatorProfile: (profile) => dispatch(setInvestigatorProfile(profile))
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
      mesh: { oid: '', score: '65', label: ''},
      profile: {
        name: '',
        degree: '',
  
        picture: '',
        specialties: '',
        focusArea: '',
        
        affiliationPosition: '',
        affiliationInstitution: '',
        affiliationInstitutionPhone: '',
        affiliationInstitutionEmail: '',
  
        careerStage: '',
        privatePhone: '',
        privateEmail: '',
  
        lastUpdated: '-',
        cv: '',
  
        publicationsFirstAuthor: '',
        publications: '',
  
        coauthorsSamePA: '',
        coauthors: '',
  
        eventsChairPerson: '',
        events: '',
  
        ctRecruiting: '',
        ct: '',
      },
    }

    this.typingTimeout = undefined
  }

  componentDidMount(){   
    const that = this;
    setTimeout(function(){ that.props.setPanelActive(PANEL.CONNECTIONS) }, 1000);
  }

  onSetPanel(panel) {      
    this.setState({ panel })
    // These panels do not require to trigger action
    // if( panel === PANEL.AFFILIATIONS ||
    //   panel === PANEL.FEEDBACK ){
    //     return
    // }    
    this.props.setPanelActive(panel)
  }

  async onSetInvestigatorFavorite(){
    try{
      let { profile } = this.state;

      // Grab ME oid
      const { match: { params } } = this.props;
      const oid = params.subid;

      // Set selection      
      let shortOid = oid.split('-')[oid.split('-').length -1 ]
      const token = localStorage.getItem('token')
      const baseUrl = profile.is_favorite_investigator?
        `${process.env.REACT_APP_API_URL}/api/remove-favorite-investigators/`:
        `${process.env.REACT_APP_API_URL}/api/add-favorite-investigators/`;
      const body = { ids: [ shortOid ] }
      const response = await axios.post(baseUrl, body,
        { headers: { "Authorization": "jwt " + token }
      })

      profile.isFavoriteInvestigator = !profile.isFavoriteInvestigator;

      this.props.setInvestigatorProfile({
        name: profile.name,
        affiliationInstitution: profile.affiliationInsititution,
        picture: profile.picture
      })


      this.setState({profile: profile})
    }catch(error){
      console.log("FAILED", error)
    } 

  }

  async loadMesh(pattern){

    try{
      this.setState({isLoadingMesh: true})

      const token = localStorage.getItem('token')
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/meshs/?limit=10&ordering=name&name=${pattern}`,
        { headers: { "Authorization": "jwt " + token }
      })

      // Autocomplete
      const meshOptions = []
      for(const mesh of response.data.results ){
        meshOptions.push({oid:mesh.oid, score: 77, label: mesh.name})
      }
      this.setState({meshOptions: meshOptions, isLoadingMesh:false})
    }catch(error){
      console.log("FAILED")
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

  async onMeshSelected(mesh){

    // Check if mesh is undefined
    if( mesh === undefined || mesh === null ){
      // Do nothing
      return
    }

    // Mesh oid selection
    let meshOid = mesh.oid
    meshOid = meshOid.split('-')[meshOid.split('-').length -1 ]
    meshOid = parseInt( meshOid )

    // Get investigator Oid
    const { match: { params } } = this.props;
    let investigatorId = params.subid;
    investigatorId = investigatorId.split('-')[investigatorId.split('-').length -1 ]
    investigatorId = parseInt( investigatorId )

    try{

      // Perform request
      let urlParams = `mesh=${meshOid}`;
      const token = localStorage.getItem('token')
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/investigator/${investigatorId}/mesh-score/${meshOid}/`,
        { headers: { "Authorization": "jwt " + token }
      })

      mesh.score = response.data.score
      clearTimeout(this.typingTimeout);

      // Set State
      this.setState({showMeshScore: true, mesh: mesh})
    }catch(error){
      console.log("FAILED")
      clearTimeout(this.typingTimeout);

      // Set State
      mesh.score = 0
      this.setState({showMeshScore: true, mesh: mesh})

    }
  }

  async componentDidMount(){

    try{

      const { match: { params } } = this.props;
      let investigatorId = params.subid;
      investigatorId = investigatorId.split('-')[investigatorId.split('-').length -1 ]
      investigatorId = parseInt( investigatorId )

      // Perform request
      const token = localStorage.getItem('token')      
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/investigator/${investigatorId}/`,
        { headers: { "Authorization": "jwt " + token }
      })

      let profile = {}

      if(response.data.combined_name !== null) 
        profile.name = response.data.combined_name
      if( response.data.degree !== null )
        profile.degree = response.data.degree
      if( response.data.cv !== null)
        profile.cv = response.data.cv
      if( response.data.photo_url != null)
        profile.picture = response.data.photo_url
      if( response.data.specialties != null)
        profile.specialties = response.data.specialties
      if( response.data.focus_areas_reasearch_interests != null)
        profile.focusArea = response.data.focus_areas_reasearch_interests 
      if(response.data.affiliation != null){
        if(response.data.affiliation.position__name != null)
          profile.affiliationPosition = response.data.affiliation.position__name
        if( response.data.affiliation.institution__combined_name != null)
          profile.affiliationInsititution = response.data.affiliation.institution__combined_name
        if( response.data.affiliation.institution__phone != null)
          profile.affiliationInstitutionPhone = response.data.affiliation.institution__phone
        if( response.data.affiliation.institution__email != null)
          profile.affiliationInstitutionEmail = response.data.affiliation.institution__email          
        if( response.data.affiliation.institution__location != null)
          profile.affiliationInstitutionLocation = response.data.affiliation.institution__location          
      }

      if( response.data.number_linked_publications_position_first_author != null)
        profile.publicationsFirstAuthor = response.data.number_linked_publications_position_first_author
      if( response.data.number_linked_publications != null)
        profile.publications = response.data.number_linked_publications

      if( response.data.number_co_authors_same_primary_affiliation != null)
        profile.coauthorsSamePA = response.data.number_co_authors_same_primary_affiliation
      if( response.data.number_co_authors != null)
        profile.coauthors = response.data.number_co_authors
        
      if( response.data.number_linked_events_position_chairperson != null)
        profile.eventsChairPerson = response.data.number_linked_events_position_chairperson
      if( response.data.number_linked_events != null)
        profile.events = response.data.number_linked_events

      if( response.data.number_linked_clinical_trials_recruiting != null)
        profile.ctRecruiting = response.data.number_linked_clinical_trials_recruiting
      if( response.data.number_linked_clinical_trials != null)
        profile.ct = response.data.number_linked_clinical_trials
      if( response.data.profile_last_updated_on != null){
        const timestamp = Date.parse(response.data.profile_last_updated_on)          
        const date = new Date(timestamp);
        const date_str = ('0' + date.getDate()).slice(-2) + '/'
           + ('0' + (date.getMonth()+1)).slice(-2) + '/'
           + date.getFullYear();
        profile.lastUpdated = date_str
      }
      if( response.data.career_stage != null)
        profile.careerStage = response.data.career_stage
      if( response.data.phone != null)
        profile.privatePhone = response.data.phone      
      if( response.data.email != null )
        profile.privateEmail = response.data.email      

      profile.isFavoriteInvestigator = response.data.is_favorite_investigator
      // Refresh
      this.setState({profile:profile})


      //
      this.props.setInvestigatorProfile({
        name: profile.name,
        affiliationInstitution: profile.affiliationInsititution,
        picture: profile.picture
      })

    }catch(error){
      console.log("FAILED")
    }
  }


  render() {

    const { panel, showMeshScore, profile, mesh } = this.state;


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
                <div><b>Score:</b><span className="ml-2">{mesh.score}</span></div>
                <div><b>Key Term:</b><span className="ml-2">{mesh.label}</span></div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="primary" onClick={e => this.setState({showMeshScore: false})}>
                  OK
                </Button>
              </Modal.Footer>
            </Modal>

          </Col>

          <Col sm={3}>
            {profile?
            <Button className={profile.isFavoriteInvestigator?"w-100 inspire-button inspire-box-shadow":"w-100 inspire-ghost-button inspire-box-shadow"} 
              variant="outline-primary"
              style={{ paddingLeft: 0, paddingRight: 0 }} onClick={(e) => this.onSetInvestigatorFavorite()}>

                <>
                  <FontAwesomeIcon icon={profile.isFavoriteInvestigator?farStar:faStar} className="mr-2" />
                  {profile.isFavoriteInvestigator?"Remove from Favorites":"Add to Favorites"}
                </>            
            </Button>
            :''}
          </Col>
          <Col sm={2}>
            <Button className="w-100 inspire-button inspire-box-shadow" variant="primary"
            onClick={ (e) => this.props.history.push(`/dashboard/`)}>Open Project</Button>{' '}
          </Col>
        </Row>



        <InvestigatorProfile profile={this.state.profile} />

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

