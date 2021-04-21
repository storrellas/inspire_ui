import React from 'react';

// Bootstrap
import { Col, Row, InputGroup, FormControl, Button } from 'react-bootstrap';

// React Router
import { withRouter } from 'react-router-dom'

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight, faAngleDown, faStar, faSearch, faArrowCircleDown, faNewspaper } from '@fortawesome/free-solid-svg-icons'

// Redux
import { connect } from "react-redux";

// Styles
import "./investigatorprofile.scss"

// AnimateHeight
import AnimateHeight from 'react-animate-height';


const mapDispatchToProps = (dispatch) => {
  return {
  };
}

const mapStateToProps = (state) => {
  return {
  };
}

const PROFILE_SNAPSHOT = { SPECIALTIES: 1,  FOCUS_AREA: 2 }
class InvestigatorProfileSnapshot extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      snapshotSpecialties: true, 
      snapshotFocusArea: false,
    }
    this.mapRef = React.createRef();
  }

  onClickSnaphot(type){
    const { snapshotSpecialties, snapshotFocusArea } = this.state;
    if( type == PROFILE_SNAPSHOT.SPECIALTIES ){
      this.setState({snapshotFocusArea: false, snapshotSpecialties: !snapshotSpecialties})      
    }else if (type == PROFILE_SNAPSHOT.FOCUS_AREA){
      this.setState({snapshotFocusArea: !snapshotFocusArea, snapshotSpecialties: false})
    }
  }

  render(){
    return (
        <>

          <Row>
            <Col sm={6}>
              <b>Profile Snapshot</b>
              <div>Last Update: {this.props.profile.lastUpdated}</div>
            </Col>
            <Col sm={6} className="text-right">
              <div>
                <a href={this.props.profile.cv} className={this.props.profile.cv===''?'d-none':''} target="_blank">                  
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
                  <>{this.props.profile.specialties}</>
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
                    <div className={this.props.profile.snapshotFocusArea?'d-none':''} 
                      style={{ width:'100%', textOverflow: 'ellipsis', overflow:'hidden', whiteSpace: 'nowrap'}}>
                      {this.props.profile.focusArea}
                    </div>
                    <AnimateHeight
                      height={this.state.snapshotFocusArea?'auto':0}
                      duration={500}>  
                    <>{this.props.profile.focusArea}</>
                    </AnimateHeight> 
                </div>
              </div>
            </Col>
          </Row>

          <Row>
            <Col>
              <div className="mt-3 inspire-snapshot-section">
                <b>Publications</b>
                <Row>
                  <Col>
                    <div className="inspire-text-secondary" style={{ fontSize: '12px'}}>FIRST AUTHOR</div>
                    <div style={{ fontSize: '12px'}}>{this.props.profile.publicationsFirstAuthor}</div>
                  </Col>
                  <Col>
                    <div className="inspire-text-secondary" style={{ fontSize: '12px'}}>TOTAL</div>
                    <div style={{ fontSize: '12px'}}>{this.props.profile.publications}</div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>

          <Row>
            <Col sm={12}>
              <div className="mt-3 inspire-snapshot-section">
                <b>Coauthors</b>
                <Row>
                  <Col>
                    <div className="inspire-text-secondary" style={{ fontSize: '12px'}}>SAME PA</div>
                    <div style={{ fontSize: '12px'}}>{this.props.profile.coauthorsSamePA}</div>
                  </Col>
                  <Col>
                    <div className="inspire-text-secondary" style={{ fontSize: '12px'}}>TOTAL</div>
                    <div style={{ fontSize: '12px'}}>{this.props.profile.coauthors}</div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>


          <Row>
            <Col>
              <div className="mt-3 inspire-snapshot-section">
                <b>Events</b>
                <Row>
                  <Col>
                    <div className="inspire-text-secondary" style={{ fontSize: '12px'}}>CHAIR PERSON</div>
                    <div style={{ fontSize: '12px'}}>{this.props.profile.eventsChairPerson}</div>
                  </Col>
                  <Col>
                    <div className="inspire-text-secondary" style={{ fontSize: '12px'}}>TOTAL</div>
                    <div style={{ fontSize: '12px'}}>{this.props.profile.events}</div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>

          <Row>
            <Col>
              <div className="mt-3 inspire-snapshot-section">
                <b>Clinical Trials</b>
                <Row>
                  <Col>
                    <div className="inspire-text-secondary" style={{ fontSize: '12px'}}>RECRUITING</div>
                    <div style={{ fontSize: '12px'}}>{this.props.profile.ctRecruiting}</div>
                  </Col>
                  <Col>
                    <div className="inspire-text-secondary" style={{ fontSize: '12px'}}>TOTAL</div>
                    <div style={{ fontSize: '12px'}}>{this.props.profile.ct}</div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
          </>

    )
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(InvestigatorProfileSnapshot))

