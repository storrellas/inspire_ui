import React from 'react';

// Bootstrap
import { Col, Row, InputGroup, FormControl, Button } from 'react-bootstrap';

// React Router
import { withRouter } from 'react-router-dom'

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons'
import { faAngleRight, faAngleDown, faStar, faSearch, faArrowCircleDown, faNewspaper } from '@fortawesome/free-solid-svg-icons'
// Redux
import { connect } from "react-redux";

// Styles
import "./investigatorprofile.scss"

// Project imports
import InvestigatorProfileSnapshot from './investigatorprofilesnaphot'

// AnimateHeight
import AnimateHeight from 'react-animate-height';

// See https://github.com/PaulLeCam/react-leaflet/issues/453
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow });
L.Marker.prototype.options.icon = DefaultIcon;

const mapDispatchToProps = (dispatch) => {
  return {
  };
}

const mapStateToProps = (state) => {
  return {
  };
}


const PROFILE_SNAPSHOT = { SPECIALTIES: 1, FOCUS_AREA: 2 }
class InvestigatorProfileMobile extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      snapshotSpecialties: true,
      snapshotFocusArea: false,
    }
    this.mapRef = React.createRef();
  }

  onClickSnaphot(type) {
    const { snapshotSpecialties, snapshotFocusArea } = this.state;
    if (type == PROFILE_SNAPSHOT.SPECIALTIES) {
      this.setState({ snapshotFocusArea: false, snapshotSpecialties: !snapshotSpecialties })
    } else if (type == PROFILE_SNAPSHOT.FOCUS_AREA) {
      this.setState({ snapshotFocusArea: !snapshotFocusArea, snapshotSpecialties: false })
    }
  }

  render() {

    // Only render when profile is not undefined
    if (this.props.profile === undefined)
      return <></>

    // Map completition
    const { profile } = this.props;
    const { affiliationInstitutionLocation } = profile;
    
    console.log("affiliationInstitutionLocation ", affiliationInstitutionLocation)

    let lat = 47.5162;
    let lng = 14.5501;
    if (affiliationInstitutionLocation && this.mapRef.current) {
      const location = affiliationInstitutionLocation.split('(')[1].slice(0, -1).split(' ')
      lat = parseFloat(location[1])
      lng = parseFloat(location[0])
      // this.mapRef.current.flyTo([lat,lng], 14, {
      //   duration: 2
      // });

      this.mapRef.current.setView([lat, lng], 17);
    }

    return (
      <>
          <div className="pl-3 pr-3">            
            <div className="d-flex align-items-center">
              <div className="w-25">
                <img src={profile.picture} style={{ width: '90%', borderRadius: '50%' }}></img>
              </div>
              <div className="w-75">
                <div>
                  <span className="inspire-text-secondary">{profile.degree}</span>
                  <span className="ml-3"><b>{profile.name} </b></span>
                </div>
              </div>
            </div>

            <div className="d-flex mt-3">
              <div className="text-center" style={{ width: "49%" }}>
                {profile.affiliationInstitutionPhone}
              </div>
              <div className="text-center" style={{ width: "2%" }}>|</div>
              <div className="ml-3 text-center inspire-text-secondary" style={{ width: "49%" }}>
                <a style={{ wordBreak: 'break-all' }}
                  href={"mailto:" + profile.affiliationInstitutionEmail}>{profile.affiliationInstitutionEmail}</a>
              </div>
            </div>

            <div className="mt-3 d-flex">

              <Button className="mr-1 w-100 inspire-button inspire-box-shadow" variant="primary"
                onClick={(e) => this.props.history.push(`/dashboard/`)}>Open Project</Button>

              {profile ?
                <Button className={profile.isFavoriteInvestigator ? "ml-1 w-100 inspire-button inspire-box" : "ml-1 w-100 inspire-ghost-button inspire-box-shadow"}
                  variant="outline-primary"
                  style={{ paddingLeft: 0, paddingRight: 0 }} onClick={(e) => this.onSetInvestigatorFavorite()}>

                  <>
                    <FontAwesomeIcon icon={profile.isFavoriteInvestigator ? farStar : faStar} className="mr-2" />
                    {profile.isFavoriteInvestigator ? "Remove from Favorites" : "Add to Favorites"}
                  </>
                </Button>
                : ''}
            </div>
          </div>

          <div className="mt-3 page-container" style={{ borderColor: '#dee2e6', borderRadius: '.25rem', padding: 0 }}>
            <div style={{ padding: '2em', paddingBottom: '1em'}}>
              <div className="d-flex">
                <div className="w-50 d-flex flex-column  justify-content-between">
                  <div>
                    <div className="inspire-text-secondary" style={{ fontSize: '12px' }}>POSITION</div>
                    <div>{profile.affiliationPosition}</div>
                  </div>
                  <div>
                    <div className="inspire-text-secondary" style={{ fontSize: '12px' }}>CAREER STAGE</div>
                    <div>{profile.careerStage}</div>
                  </div>
                </div>
                <div className="w-50">
                  <div className="inspire-text-secondary" style={{ fontSize: '12px' }}>AFFILIATION</div>
                  <div>{profile.affiliationInsititution}</div>
                </div>
              </div>
              <div className="mt-3">
                <div className="inspire-text-secondary" style={{ fontSize: '12px' }}>PRIVATE CONTACT</div>
                <div><a style={{ wordBreak: 'break-all' }} href={"mailto:" + profile.privateEmail}>{profile.privateEmail}</a></div>
              </div>
            </div>
            <div className="p-2">
              <MapContainer 
                whenCreated={ mapInstance => { this.mapRef.current = mapInstance; this.forceUpdate() } }
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
            <div className="pl-3 pr-3">
              <InvestigatorProfileSnapshot profile={this.props.profile}/>
            </div>

          </div>

      </>
    );
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(InvestigatorProfileMobile))

