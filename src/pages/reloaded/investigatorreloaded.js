import React, { Suspense } from 'react';
// Bootstrap
import { Col, Row, InputGroup, FormControl, Button, Nav } from 'react-bootstrap';

// React Router
import { withRouter } from 'react-router-dom'

// Loading Overlay
import LoadingOverlay from 'react-loading-overlay';

// Redux
import { setInvestigatorProfile } from "../../redux";
import { connect } from "react-redux";

// Styles
import "./investigatorreloaded.scss"

import AnimateHeight from 'react-animate-height';

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight, faAngleDown, faStar, faSearch, faArrowCircleDown, faNewspaper } from '@fortawesome/free-solid-svg-icons'

// Axios
import axios from 'axios';
import environment from '../../environment.json';

// Project imports
import InvestigatorProfileReloaded from '../../components/investigator/reloaded/investigatorprofilereloaded'



const mapDispatchToProps = (dispatch) => {
  return {
    setInvestigatorProfile: (profile) => dispatch(setInvestigatorProfile(profile))
  };
}

const TAB = { 
  CONNECTIONS: 1, COMPANY_COOPERATION: 2, AFFILIATIONS: 3, RESEARCH_PROFILE: 4, 
  PUBLICATIONS: 5, EVENTS: 6, CLINICAL_TRIALS: 7, FEEDBACK: 8 
}
class InvestigatorReloaded extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      activeTab: TAB.CONNECTIONS,
    }
  }

  async componentDidMount(){
  }

  render() {

    const { match: { params } } = this.props;
    let projectOid = params.id;

    const { activeTab } = this.state;
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
                  <FontAwesomeIcon icon={faSearch} />
                </InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl id="inlineFormInputGroup" placeholder="Search by names, position, field of study"
                style={{ borderLeft: 0, borderRadius: '0 20px 20px 0', }} />
            </InputGroup>
          </Col>
          <Col sm={2}>
            <Button className="w-100 inspire-ghost-button inspire-box-shadow" variant="outline-primary">
              <FontAwesomeIcon icon={faArrowCircleDown} className="mr-2" />
              Export
              </Button>
          </Col>
          <Col sm={2}>
            <Button className="w-100 inspire-ghost-button inspire-box-shadow" variant="outline-primary"
              style={{ paddingLeft: 0, paddingRight: 0 }}>
              <FontAwesomeIcon icon={faStar} className="mr-2" />
              Add to Favorites
            </Button>
          </Col>
          <Col sm={2}>
            <Button className="w-100 inspire-button inspire-box-shadow" variant="primary">Open Project</Button>{' '}
          </Col>
        </Row>

        <InvestigatorProfileReloaded />

        <Row className="mt-3">
          <Col sm={12}>
            <Nav variant="tabs" style={{ width: '100%', justifyContent: 'space-between' }}>
              <Nav.Item>
                <Nav.Link href="#" active={activeTab == TAB.CONNECTIONS} 
                  onClick={(e) => this.setState({ activeTab: TAB.CONNECTIONS })}>CONNECTIONS</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="#" active={activeTab == TAB.COMPANY_COOPERATION} 
                  onClick={(e) => this.setState({ activeTab: TAB.COMPANY_COOPERATION })}>COMPANY_COOPERATION</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="#" active={activeTab == TAB.AFFILIATIONS} 
                  onClick={(e) => this.setState({ activeTab: TAB.AFFILIATIONS })}>COMPANY_COOPERATION</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="#" active={activeTab == TAB.RESEARCH_PROFILE} 
                  onClick={(e) => this.setState({ activeTab: TAB.RESEARCH_PROFILE })}>RESEARCH_PROFILE</Nav.Link>
              </Nav.Item>
            </Nav>
            <Nav variant="tabs" style={{ width: '100%', justifyContent: 'space-between'  }}>

              <Nav.Item>
                <Nav.Link href="#" active={activeTab == TAB.PUBLICATIONS} 
                  onClick={(e) => this.setState({ activeTab: TAB.PUBLICATIONS })}>PUBLICATIONS</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="#" active={activeTab == TAB.EVENTS} 
                  onClick={(e) => this.setState({ activeTab: TAB.EVENTS })}>EVENTS</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="#" active={activeTab == TAB.CLINICAL_TRIALS} 
                  onClick={(e) => this.setState({ activeTab: TAB.CLINICAL_TRIALS })}>CLINICAL_TRIALS</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="#" active={activeTab == TAB.FEEDBACK} 
                  onClick={(e) => this.setState({ activeTab: TAB.FEEDBACK })}>FEEDBACK</Nav.Link>
              </Nav.Item>

            </Nav>
            <div className={activeTab === TAB.CONNECTIONS ? '' : 'd-none'}>
              <div style={{
                backgroundColor: 'white', border: '1px solid',
                borderColor: 'transparent #dee2e6 #dee2e6 #dee2e6', borderRadius: '0 .25rem 0 .25rem',
                minHeight: '50vh', padding: '2em'
              }}>
                This is my table1
              </div>
            </div>
            <div className={activeTab === TAB.COMPANY_COOPERATION ? '' : 'd-none'}>
              <div style={{
                backgroundColor: 'white', border: '1px solid',
                borderColor: 'transparent #dee2e6 #dee2e6 #dee2e6', borderRadius: '0 .25rem 0 .25rem',
                minHeight: '50vh', padding: '2em'
              }}>
                This is my table2
              </div>
            </div>
          </Col>
        </Row>
      </>
    );
  }
}


export default connect(undefined, mapDispatchToProps)(withRouter(InvestigatorReloaded))

