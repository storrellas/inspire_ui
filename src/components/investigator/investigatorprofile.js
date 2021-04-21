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

// Project imports
import InvestigatorProfileSnapshot from './investigatorprofilesnaphot'

// See https://github.com/PaulLeCam/react-leaflet/issues/453
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow});
L.Marker.prototype.options.icon = DefaultIcon;

const mapDispatchToProps = (dispatch) => {
  return {
  };
}

const mapStateToProps = (state) => {
  return {
    investigatorFixedTopProfile: state.investigatorFixedTopProfile,
  };
}

class InvestigatorProfile extends React.Component {

  constructor(props) {
    super(props)
    this.state = {}
    this.mapRef = React.createRef();
  }

  render() {

    // Only render when profile is not undefined
    if(this.props.profile === undefined)
      return <></>

    // Map completition
    const { affiliationInstitutionLocation } = this.props.profile;
    
    let lat = 47.5162;
    let lng = 14.5501;
    if( affiliationInstitutionLocation && this.mapRef.current){    
      const location = affiliationInstitutionLocation.split('(')[1].slice(0, -1).split(' ')
      
      

      lat = parseFloat( location[1] )
      lng = parseFloat( location[0] )
      // this.mapRef.current.flyTo([lat,lng], 14, {
      //   duration: 2
      // });

      this.mapRef.current.setView([lat,lng], 17);
    }

    return (
      <>

        <div style={{ fontSize: '20px', borderRadius: '2px', 
                      position: 'fixed', backgroundColor: 'white', 
                      top: 0, left: 0, zIndex: 10000, width: '100%' }}>
        <AnimateHeight
            height={this.props.investigatorFixedTopProfile?'auto':0}
            duration={500}>  

          <div className="d-flex p-3 justify-content-between inspire-box-shadow">

            <div className="d-flex justify-content-center align-items-center">
              <img src={this.props.profile.picture} style={{ width: '100px', borderRadius: '50%' }}></img>
              <div className="inspire-text-secondary ml-3">{this.props.profile.degree}</div>
              <div className="ml-3"><b>{this.props.profile.name} </b></div>
            </div>

            <div className="d-flex justify-content-center align-items-center">
              <div>{this.props.profile.affiliationInstitutionPhone}</div>
              <div className="ml-3"> | </div>
              <div className="ml-3">
                <a style={{wordBreak: 'break-all'}} 
                              href={"mailto:"+this.state.affiliationInstitutionEmail}>{this.state.affiliationInstitutionEmail}</a>
              </div>
            </div>
          </div>
          </AnimateHeight>
          </div>
          <div className={this.props.investigatorFixedTopProfile?"":"d-none"}>
        </div>
        

        <Row className="mt-3 align-items-stretch">
          <Col sm={7}>
            <div className="inspire-panel">
              <Row>
                <Col sm={3} className="text-center">
                  <img src={this.props.profile.picture} style={{ width: '90%', borderRadius: '50%' }}></img>
                </Col>
                <Col sm={9}>
                  <div className="h-100 d-flex flex-column justify-content-center" style={{ fontSize: '18px'}}>
                    <div>
                      <span className="inspire-text-secondary">{this.props.profile.degree}</span>
                      <span className="ml-3"><b>{this.props.profile.name} </b></span>                      
                    </div>
                    <div>
                      {this.props.profile.affiliationInstitutionPhone}  | 
                      <span className="ml-3 inspire-text-secondary">
                        <a style={{wordBreak: 'break-all'}} 
                          href={"mailto:"+this.props.profile.affiliationInstitutionEmail}>{this.props.profile.affiliationInstitutionEmail}</a>
                      </span>
                    </div>
                  </div>
                </Col>
              </Row>
            
              <Row style={{ marginTop: '3em'}}>
                <Col sm={4}>
                  <div className="inspire-text-secondary" style={{ fontSize: '12px'}}>POSITION</div>
                  <div>{this.props.profile.affiliationPosition}</div>
                  <div className="inspire-text-secondary" style={{ fontSize: '12px'}}>CAREER STAGE</div>
                  <div>{this.props.profile.careerStage}</div>
                </Col>
                <Col sm={4}>
                  <div className="inspire-text-secondary" style={{ fontSize: '12px'}}>AFFILIATION</div>
                  <div>{this.props.profile.affiliationInsititution}</div>
                </Col>
                <Col sm={4}>
                  <div className="inspire-text-secondary" style={{ fontSize: '12px'}}>PRIVATE CONTACT</div>
                  <div><a style={{wordBreak: 'break-all'}} href={"mailto:"+this.props.profile.privateEmail}>{this.props.profile.privateEmail}</a></div>
                </Col>
              </Row>

            </div>
            <div className="mt-3 p-3 inspire-panel" style={{ backgroundColor: 'white'}}>

            <MapContainer 
              whenCreated={ mapInstance => { this.mapRef.current = mapInstance } }
              center={[lat, lng]} zoom={18} scrollWheelZoom 
              style={{ height: "200px", width: '100%', borderRadius: '5px'}}>
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[lat, lng]}>
                <Popup>
                  Position: {lat} {lng}
                </Popup>
              </Marker>
            </MapContainer>

            </div>
          </Col>
          <Col sm={5}>
            <div className="inspire-panel h-100" style={{ padding: 0, position:'relative', overflowY:'scroll', overflowX: 'hidden' }}>
              <div className="p-3 w-100" style={{ position:'absolute'}}>
                <InvestigatorProfileSnapshot profile={this.props.profile}/>
              </div>
            </div>
          </Col>
        </Row>
      </>
      );
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(InvestigatorProfile))

