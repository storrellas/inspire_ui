import React from 'react';

// Bootstrap
import { Col, Row } from 'react-bootstrap';

// React Router
import { withRouter } from 'react-router-dom'

// Axios
import axios from 'axios';
import environment from '../../environment.json';

// Redux
import { setInvestigatorProfile } from "../../redux";
import { connect } from "react-redux";

const mapDispatchToProps = (dispatch) => {
  return {
    setInvestigatorProfile: (profile) => dispatch(setInvestigatorProfile(profile))
  };
}

class InvestigatorProfile extends React.Component {

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
        this.state.name = response.data.degree
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
        affiliation: this.state.affiliation,
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

  render() {
    return (
      <div>
        <Row style={{ padding: '1em' }}>
          <Col sm={3}>
            <img src={this.state.picture} width="150"></img>
          </Col>

          <Col sm={2}>
            <div className="font-weight-bold">Position</div>
            <div>{this.state.affiliationPosition}</div>
            <div className="mt-3 font-weight-bold">Career Stage</div>
            <div>{this.state.careerStage}</div>
          </Col>
          <Col sm={3}>
            <div className="font-weight-bold">Affiliation</div>
            <div>{this.state.affiliationInsititution}</div>
          </Col>
          <Col sm={2}>
            <div className="font-weight-bold">Contact</div>
            <div>{this.state.affiliationInstitutionPhone}</div>
            <div><a style={{wordBreak: 'break-all'}} 
                  href={"mailto:"+this.state.affiliationInstitutionEmail}>{this.state.affiliationInstitutionEmail}</a></div>
          </Col>
          <Col sm={2}>
            <div className="font-weight-bold">Private Contact</div>
            <div>{this.state.privatePhone}</div>
            <div><a style={{wordBreak: 'break-all'}} href={"mailto:"+this.state.privateEmail}>{this.state.privateEmail}</a></div>
          </Col>
        </Row>
        <div style={{ border: '1px solid #ccc', padding: '1em 0 1em 0' }}>
          <div className="text-right" style={{ padding: '0 1em 1em 1em' }}>Last Updated: {this.state.lastUpdated}</div>

          <div className="d-flex justify-content-between"
            style={{ borderBottom: '1px solid #ccc', padding: '0.5em 1em 0.5em 1em' }}>
            <div className="font-weight-bold">Profile Snapshot</div>
            <div><a href={this.state.cv} className={this.state.cv===''?'d-none':''}>Go To CV</a></div>
          </div>


          <div className="d-flex justify-content-between"
            style={{ borderBottom: '1px solid #ccc', padding: '0.5em 1em 0.5em 1em' }}>
            <div className="font-weight-bold">Specialties</div>
            <div>{this.state.specialties}</div>
          </div>

          <div className="d-flex justify-content-between"
            style={{ borderBottom: '1px solid #ccc', padding: '0.5em 1em 0.5em 1em' }}>
            <div className="font-weight-bold" style={{ width: '30%'}}>Focus Area</div>
            <div>{this.state.focusArea}</div>
          </div>

          <div className="w-100 d-flex justify-content-between"
            style={{ borderBottom: '1px solid #ccc', padding: '0.5em 1em 0.5em 1em' }}>
            <div className="font-weight-bold" style={{ width: '33%' }}>Publications</div>
            <div className='text-center' style={{ width: '33%' }}>
              <div>First Author</div>
              <div>{this.state.publicationsFirstAuthor}</div>
            </div>
            <div className='text-right' style={{ width: '33%' }}>
              <div>Total</div>
              <div>{this.state.publications}</div>
            </div>
          </div>

          <div className="d-flex justify-content-between"
            style={{ borderBottom: '1px solid #ccc', padding: '0.5em 1em 0.5em 1em' }}>
            <div className="font-weight-bold" style={{ width: '33%' }}>Coauthors</div>
            <div className='text-center' style={{ width: '33%' }}>
              <div>Same PA</div>
              <div>{this.state.coauthorsSamePA}</div>
            </div>
            <div className='text-right' style={{ width: '33%' }}>
              <div>Total</div>
              <div>{this.state.coauthors}</div>
            </div>
          </div>

          <div className="d-flex justify-content-between"
            style={{ borderBottom: '1px solid #ccc', padding: '0.5em 1em 0.5em 1em' }}>
            <div className="font-weight-bold" style={{ width: '33%' }}>Events</div>
            <div className='text-center' style={{ width: '33%' }}>
              <div>Chair Person</div>
              <div>{this.state.eventsChairPerson}</div>
            </div>
            <div className='text-right' style={{ width: '33%' }}>
              <div>Total</div>
              <div>{this.state.events}</div>
            </div>
          </div>

          <div className="d-flex justify-content-between"
            style={{ borderBottom: '1px solid #ccc', padding: '0.5em 1em 0.5em 1em' }}>
            <div className="font-weight-bold" style={{ width: '33%' }}>Clinical Trials</div>
            <div className='text-center' style={{ width: '33%' }}>
              <div>Recruiting</div>
              <div>{this.state.ctRecruiting}</div>
            </div>
            <div className='text-right' style={{ width: '33%' }}>
              <div>Total</div>
              <div>{this.state.ct}</div>
            </div>
          </div>
        </div>
      </div>
      );
  }
}


export default connect(undefined, mapDispatchToProps)(withRouter(InvestigatorProfile))

