import React, { Suspense } from 'react';

// Bootstrap
import { Nav, Col, Row } from 'react-bootstrap';

// React Router
import { withRouter } from 'react-router-dom'

// Styles

// Assets

// Project imports
import InvestigatorTable from '../components/investigatorlist/investigatortable';
import InvestigatorMap from '../components/investigatorlist/investigatormap';
// Lazy import 
//const InvestigatorMap = React.lazy(() => import('../components/investigatorlist/investigatormap'));


// Axios
import axios from 'axios';
import environment from '../environment.json';

const TAB = { TABLE: 1, MAP: 2, }
class InvestigatorList extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      activeTab: TAB.TABLE,
      map: undefined,
      projectOid: undefined,
      offset: 0,
      skip: 0,
      take: 100,
      limit: 100,
      investigatorList: []
    }
  }



  async loadInvestigators(event){
    try{
      const { match: { params } } = this.props;
      const projectOid = params.id;
      const { offset, skip, take, limit } = this.state;

      // Request investigators
      const token = localStorage.getItem('token')
      const urlParams = `project=${projectOid}&limit=${limit}&offset=${offset}&skip=${skip}&take=${take}`
      const response = await axios.get(`${environment.base_url}/api/investigators/?${urlParams}`,
        { headers: { "Authorization": "jwt " + token }
      })

      this.setState({investigatorList: response.data.results, projectOid: projectOid})
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

  componentDidMount(){
   
    // Load Investigators
    this.loadInvestigators()
  }

  render() {
    
    const { investigatorList, projectOid } = this.state;


    // Activate tab
    const { activeTab } = this.state;
    if( this.state.map === undefined && activeTab == TAB.MAP ){
      this.state.map = <InvestigatorMap />                    
    }
    return (
      <Row>
        <Col sm={12}>
          <Nav variant="tabs" style={{ width: '100%' }}>
            <Nav.Item>
              <Nav.Link href="#" active={activeTab == TAB.TABLE} onClick={(e) => this.setState({ activeTab: TAB.TABLE })}>Table</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="#" active={activeTab == TAB.MAP} onClick={(e) => this.setState({ activeTab: TAB.MAP, isMapOpened: true })}>Map</Nav.Link>
            </Nav.Item>
          </Nav>
          <div className={activeTab === TAB.TABLE ? '' : 'd-none'}>
            <InvestigatorTable projectOid={projectOid} investigatorList={investigatorList} />
          </div>
          <div className={activeTab === TAB.MAP ? '' : 'd-none'}>
            {this.state.map}
          </div>
        </Col>
      </Row>);
  }
}


export default withRouter(InvestigatorList);
