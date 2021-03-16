import React, { Suspense } from 'react';
// Bootstrap
import { Col, Row, InputGroup, FormControl, Button } from 'react-bootstrap';

// React Router
import { withRouter } from 'react-router-dom'

// Loading Overlay
import LoadingOverlay from 'react-loading-overlay';

// Styles
import "./investigatorreloaded.scss"

import AnimateHeight from 'react-animate-height';

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight, faAngleDown, faStar, faSearch, faArrowCircleDown, faNewspaper } from '@fortawesome/free-solid-svg-icons'



// Axios
import axios from 'axios';
import environment from '../environment.json';


const PROFILE_SNAPSHOT = { SPECIALTIES: 1,  FOCUS_AREA: 2 }
class InvestigatorReloaded extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
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

      snapshotSpecialties: false,
      snapshotFocusArea: false,
    }
  }



  async componentDidMount(){
    try{

      const token = localStorage.getItem('token')

  
      const { match: { params } } = this.props;
      let investigatorId = params.subid;
      investigatorId = investigatorId.split('-')[investigatorId.split('-').length -1 ]
      investigatorId = parseInt( investigatorId )

      // Perform request
      const response = await axios.get(`${environment.base_url}/api/investigator/${investigatorId}`,
        { headers: { "Authorization": "jwt " + token }
      })

      const { state } = this;

      if(response.data.combined_name !== null) 
        this.state.name = response.data.combined_name
      if( response.data.degree !== null )
        this.state.degree = response.data.degree
      if( response.data.cv !== null)
        this.state.cv = response.data.cv
      if( response.data.photo_url != null)
        this.state.picture = response.data.photo_url
      if( response.data.specialties != null)
        this.state.specialties = response.data.specialties
      if( response.data.focus_areas_reasearch_interests != null)
        this.state.focusArea = response.data.focus_areas_reasearch_interests 
      if(response.data.affiliation != null){
        if(response.data.affiliation.position__name != null)
          this.state.affiliationPosition = response.data.affiliation.position__name
        if( response.data.affiliation.institution__combined_name != null)
          this.state.affiliationInsititution = response.data.affiliation.institution__combined_name
        if( response.data.affiliation.institution__phone != null)
          this.state.affiliationInstitutionPhone = response.data.affiliation.institution__phone
        if( response.data.affiliation.institution__email != null)
          this.state.affiliationInstitutionEmail = response.data.affiliation.institution__email          
      }

      if( response.data.number_linked_publications_position_first_author != null)
        this.state.publicationsFirstAuthor = response.data.number_linked_publications_position_first_author
      if( response.data.number_linked_publications != null)
        this.state.publications = response.data.number_linked_publications

      if( response.data.number_co_authors_same_primary_affiliation != null)
        this.state.coauthorsSamePA = response.data.number_co_authors_same_primary_affiliation
      if( response.data.number_co_authors != null)
        this.state.coauthors = response.data.number_co_authors
        
      if( response.data.number_linked_events_position_chairperson != null)
        this.state.eventsChairPerson = response.data.number_linked_events_position_chairperson
      if( response.data.number_linked_events != null)
        this.state.events = response.data.number_linked_events

      if( response.data.number_linked_clinical_trials_recruiting != null)
        this.state.ctRecruiting = response.data.number_linked_clinical_trials_recruiting
      if( response.data.number_linked_clinical_trials != null)
        this.state.ct = response.data.number_linked_clinical_trials
      if( response.data.profile_last_updated_on != null){
        const timestamp = Date.parse(response.data.profile_last_updated_on)          
        const date = new Date(timestamp);
        const date_str = ('0' + date.getDate()).slice(-2) + '/'
           + ('0' + (date.getMonth()+1)).slice(-2) + '/'
           + date.getFullYear();
        this.state.lastUpdated = date_str
      }
      if( response.data.career_stage != null)
        this.state.careerStage = response.data.career_stage
      if( response.data.phone != null)
        this.state.privatePhone = response.data.phone      
      if( response.data.email != null )
        this.state.privateEmail = response.data.email      

      this.setState(state)

      this.props.setInvestigatorProfile({
        name: this.state.name,
        affiliationInstitution: this.state.affiliationInsititution,
        picture: this.state.picture
      })
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

  onClickSnaphot(type){
    const { snapshotSpecialties, snapshotFocusArea } = this.state;
    if( type == PROFILE_SNAPSHOT.SPECIALTIES ){
      this.setState({snapshotFocusArea: false, snapshotSpecialties: !snapshotSpecialties})      
    }else if (type == PROFILE_SNAPSHOT.FOCUS_AREA){
      this.setState({snapshotFocusArea: !snapshotFocusArea, snapshotSpecialties: false})
    }
  }

  render() {

    const { match: { params } } = this.props;
    let projectOid = params.id;

    return (
      <>
        <Row>
          <Col sm={12}>
            <div className="d-flex">
              <div>
                <a href="/reloaded/project/">Select Plan</a>
              </div>
              <div className="ml-2">
                <FontAwesomeIcon icon={faAngleRight} />
              </div>              
              <div className="ml-2">
                <a href={`/reloaded/project/${projectOid}`}>Investigators</a>                
              </div>
              <div className="ml-2">
                <FontAwesomeIcon icon={faAngleRight} />
              </div>
              <div className="ml-2">
                Nicolas Felten
              </div>
            </div>            
          </Col>
        </Row>
        <Row className="mt-3">
          <Col sm={6}>
            <InputGroup className="mb-2" >
              <InputGroup.Prepend>
                <InputGroup.Text style={{ borderRadius: '20px 0 0 20px', backgroundColor: 'white', borderRight: 0 }}>
                  <FontAwesomeIcon icon={faSearch}/>    
                </InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl id="inlineFormInputGroup" placeholder="Search by names, position, field of study"
                 style={{ borderLeft: 0, borderRadius: '0 20px 20px 0',  }}/>
            </InputGroup>
          </Col>
          <Col sm={2}>
            <Button className="w-100 inspire-ghost-button inspire-box-shadow" variant="outline-primary">
              <FontAwesomeIcon icon={faArrowCircleDown} className="mr-2"/>
              Export
              </Button>
          </Col>
          <Col sm={2}>
            <Button className="w-100 inspire-ghost-button inspire-box-shadow" variant="outline-primary" 
                style={{ paddingLeft:0, paddingRight: 0 }}>
              <FontAwesomeIcon icon={faStar} className="mr-2"/>  
              Add to Favorites
            </Button>
          </Col>
          <Col sm={2}>
            <Button className="w-100 inspire-button inspire-box-shadow" variant="primary">Open Project</Button>{' '}
          </Col>
        </Row>
        <Row className="mt-3">
          <Col sm={7}>
            <div className="inspire-panel">
              <Row>
                <Col sm={2}>
                  <img src={this.state.picture} width="71" style={{ borderRadius: '50%' }}></img>
                </Col>
                <Col sm={10}>
                  <div className="h-100 d-flex flex-column justify-content-center">
                    <div>
                      <b>{this.state.name} </b>
                      <span className="ml-3 inspire-text-secondary">{this.state.degree}</span>
                    </div>
                    <div>
                      {this.state.affiliationInstitutionPhone}  | 
                      <span className="ml-3 inspire-text-secondary">
                      <a style={{wordBreak: 'break-all'}} 
                        href={"mailto:"+this.state.affiliationInstitutionEmail}>{this.state.affiliationInstitutionEmail}</a></span>
                    </div>
                  </div>
                </Col>
              </Row>
            
              <Row style={{ marginTop: '3em'}}>
                <Col sm={5}>
                  <div className="inspire-text-secondary" style={{ fontSize: '12px'}}>POSITION</div>
                  <div>{this.state.affiliationPosition}</div>
                  <div className="inspire-text-secondary" style={{ fontSize: '12px'}}>CAREER STAGE</div>
                  <div>{this.state.careerStage}</div>
                </Col>
                <Col sm={4}>
                  <div className="inspire-text-secondary" style={{ fontSize: '12px'}}>AFFILIATION</div>
                  <div>{this.state.affiliationInsititution}</div>
                </Col>
                <Col sm={4}>
                  <div className="inspire-text-secondary" style={{ fontSize: '12px'}}>PRIVATE CONTACT</div>
                  <div><a style={{wordBreak: 'break-all'}} href={"mailto:"+this.state.privateEmail}>{this.state.privateEmail}</a></div>
                </Col>
              </Row>

            </div>
          </Col>
          <Col sm={4}>
            <div className="inspire-panel">

              <Row>
                <Col sm={6}>
                  <b>Profile Snapshot</b>
                  <div>Last Update: {this.state.lastUpdated}</div>
                </Col>
                <Col sm={6} className="text-right">
                  <div>
                    <a href={this.state.cv} className={this.state.cv===''?'d-none':''}>                  
                      Go To CV
                      <FontAwesomeIcon className="ml-2" icon={faNewspaper} />
                    </a>
                  </div>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col>
                  <div className="inspire-snapshot-section">
                    <div className="inspire-text-secondary"  style={{ cursor: 'pointer' }}
                      onClick={(e) => this.onClickSnaphot(PROFILE_SNAPSHOT.SPECIALTIES)}>
                      SPECIALTIES
                      <FontAwesomeIcon className={this.state.snapshotSpecialties?'ml-2 unfolded':"ml-2 folded" }
                        icon={faAngleDown}/>
                    </div>
                    <div className="text-justify">
                      <AnimateHeight
                          height={this.state.snapshotSpecialties?'auto':0}
                          duration={500}>  
                      {this.state.specialties}
                      </AnimateHeight> 
                    </div>

                  </div>
                  <div className="mt-3 inspire-snapshot-section">
                    <div className="inspire-text-secondary" style={{ cursor: 'pointer' }}
                     onClick={(e) => this.onClickSnaphot(PROFILE_SNAPSHOT.FOCUS_AREA)}>
                      FOCUS AREA
                      <FontAwesomeIcon className={this.state.snapshotFocusArea?'ml-2 unfolded':"ml-2 folded" }
                        icon={faAngleDown}/>
                    </div>
                    <div className="text-justify">
                        <AnimateHeight
                          height={this.state.snapshotFocusArea?'auto':0}
                          duration={500}>  
                        {this.state.focusArea}
                        </AnimateHeight> 
                    </div>
                  </div>
                </Col>
              </Row>


            </div>
        </Col>
        </Row>
      </>
    );
  }
}

export default withRouter(InvestigatorReloaded)
