import React from 'react';
// Bootstrap
import { Modal, Button, Nav, Row, Col } from 'react-bootstrap';

// React Router
import { withRouter } from 'react-router-dom'

// Styles
import './modal.scss';

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExpandArrowsAlt, faFolder, faBook, faCalendarWeek, faHome } from '@fortawesome/free-solid-svg-icons'

// Cytoscape
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from 'cytoscape';
import euler from 'cytoscape-euler';

// React Select
import Select from 'react-select'

// Project imports
import sourceFile from './source'

// Redux
import { connect } from "react-redux";

// Axios
import axios from 'axios';
import environment from '../../environment.json';

cytoscape.use(euler);

const mapStateToProps = state => {
  return {
    investigatorProfile: state.investigatorProfile,
  };
};


function NodeDetail(props) {

  return (
    <div style={{ fontSize: '14px', color: "#000000" }}>
      <div style={{ fontSize: '18px', color: "#337ab7" }}>Joachim Rother</div>
      <div>Asklepios Kliniken - Asklepios Klinik Altona, Abteilung für Neurologie</div>
      <div>
        <FontAwesomeIcon icon={faFolder} />
        <span className="ml-2">All</span>
      </div>
      <div><FontAwesomeIcon icon={faFolder} />
        <span className="ml-2">Trials</span>
      </div>
      <div>
        <FontAwesomeIcon icon={faCalendarWeek} />
        <span className="ml-2">Events</span>
      </div>
      <div><FontAwesomeIcon icon={faBook} /><span className="ml-2">Publications</span></div>
      <div><FontAwesomeIcon icon={faHome} /><span className="ml-2">Affiliations (past)</span></div>
      <div><FontAwesomeIcon icon={faHome} /><span className="ml-2">Affiliations (present)</span></div>
    </div>
  );
}

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
]

export const connectionStregnthOptions = [  
  { value: 'All', label: 'All'},
  { value: '2', label: '2'},
  { value: '3', label: '3'},
  { value: '4', label: '4'},
  { value: '5', label: '5'},
  { value: '6', label: '6'},
  { value: '7+', label: '7+'},
];


const defaultInitYear = 1990;
const defaultEndYear = (new Date()).getFullYear();
const defaultFilters = {
        strength: ['all'],
        type: ['all'],
        country: ['all'],
        from: defaultInitYear,
        to: defaultEndYear,
    }

const TAB = { NETWORK: 1, PROFILES: 2, }
class PanelConnections extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      showModal: false,
      showModalCytoscape: false,
      activeTab: TAB.NETWORK,
      modalNetwork: undefined,
      source: []
    }
    this.cytoscape = undefined
    this.cytoscapeStylesheet = [{
      selector: 'node',
      css: {
        'height': 10,
        'width': 10,
        'background-color': '#FFFFFF',
        'border-color': '#4283f1',
        'border-width': 1,
        'border-opacity': 0.5,
        'background-image': 'data(image)',
        'background-width': '60%',
        'background-height': '60%',
        'label': 'data(label)',
        'font-size': 6,
        'color': 'gray',
      }
    },
    {
      selector: 'edge',
      css: { 'line-color': 'data(color)', 'width': 1, }
    },
    {
      selector: 'node:selected',
      css: {
        'height': 14,
        'width': 14,
        'background-color': '#FFFFFF',
        'border-color': '#4283f1',
        'border-width': 1,
        'border-opacity': 0.5,
        'background-image': 'https://demo.explicatos.com/img/user.png',
        'background-width': '60%',
        'background-height': '60%',
        'label': 'data(label)',
        'font-size': 11,
      }
    }]
    this.cytoscapeLayout = {
      name: 'euler',
      randomize: true,
      animate: false,
    }

  }

  openModal(e) {
    this.setState({ showModal: true })
  }

  closeModal(e) {
    this.cy.resize()
    this.cy.fit();
    this.setState({ showModal: false, showModalCytoscape: false })
  }

  generateProfiles() {
    const base =
    {
      label: 'Roman',
      affiliation: 'Charité Universitätsmedizin Berlin (Campus Benjamin Franklin), Klinik für Neurologie mit Experimenteller Neurologie',
      url: '/project/${user.medical_expert_oid}/'
    }
    const data = Array(10).fill(base);

    return <div style={{ display: "flex", flexWrap: "wrap" }}>
      {data.map((item, id) =>
        <div style={{ width: "33%", padding: '1em' }}>
          {item.url === '' ?
            <p style={{ fontSize: '18px', color: "#337ab7" }}>{item.label}</p>
            :
            <a href="#" target="_blank" >
              <b>{item.label}</b>
            </a>
          }
          <p style={{ fontSize: '14px' }}>{item.affiliation}</p>

        </div>
      )}

    </div>
  }

  componentDidUpdate() {
    if (this.cy !== undefined) {
      this.cy.on('select', 'node', function (evt) {
        var data = evt.target[0].data();
        console.log(data)
      });
    }

  }


  onFilterConnectionStrength(e){
    console.log("e", e)
  }

  onFilterCountry(e){
    console.log("e", e)
  }

  onFilterConnectionType(e){
    console.log("e", e)
  }

  async componentDidMount(){
    try{

      const token = localStorage.getItem('token')
  
      const { match: { params } } = this.props;
      let investigatorId = params.subid;
      investigatorId = investigatorId.split('-')[investigatorId.split('-').length -1 ]
      investigatorId = parseInt( investigatorId )

      // Perform request
      const response = await axios.get(`${environment.base_url}/api/investigator/${investigatorId}/connections/`,
        { headers: { "Authorization": "jwt " + token }
      })

      // collection of nodes
      const investigator_img = "https://demo.explicatos.com/img/user_gray.png";
      const users = [
        { 
          id: 1, 
          label: this.props.investigatorProfile.name, 
          affiliation: this.props.investigatorProfile.affiliation,
          image: this.props.picture || investigator_img, 
          strength: '' 
        }
      ];      
      let connections = [];
      for(const [idx, item] of Object.entries(response.data.results) ){
                
        // prevent adding the node if for some reason, a medical expert is connected more than once
        const node = {
            id: (idx+2), 
            label: "", 
            affiliation: "", 
            image: investigator_img, 
            strength: item.number_common_objects
        }
        users.push(node);
        connections.push({ 
          source: 1, 
          target: node.id, 
          strength: item.number_common_objects 
        }); 
      }

      let filtering = this.getFiltering(users, connections);
      const sourceGenerated = this.generateSource(filtering.users, filtering.connections)

      const that = this;
      setTimeout(function(){ that.setState({source:sourceGenerated}) }, 2000);
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

  getFiltering(users, connections, filters = defaultFilters){

    filters.from = parseInt(filters.from);
    filters.to = parseInt(filters.to);

    // Filtering Connections (Strength,Country, Type)
    // ---------------------

    // Initialise filtered connections
    let filteredConnections = connections.map(a => Object.assign({}, a))

    //if the strength is specified get only the connections with this value(or greater than 7 if '7+' option selected) and connected users
    for( let connection of filteredConnections ){
        connection.id = connection.source + '_' + connection.target;
        connection.color = (connection.number_objects < 7)?'lightgray':'#4283f1'
    }

    // Strength
    // if ( filters.strength.includes('all') == false) {

    //   let filteredConnectionsAux = filteredConnections.map(a => Object.assign({}, a));
    //   filteredConnections = [] // Empty filtered connections
    //   for(const connection of filteredConnectionsAux){

    //       // Equal number_objects
    //       if ( filters.strength.includes( connection.number_objects.toString() ) ) {
    //           console.log("Adding it")
    //           filteredConnections.push(connection);
    //       }                        

    //       // More than 7
    //       if( filters.strength.includes('7+') ){
    //           if( connection.number_objects > 7 )
    //               filteredConnections.push(connection);
    //       }
    //   }
    // }

    // Country    
    // if ( filters.country.includes('all') === false ) {
    //   let filteredConnectionsAux = filteredConnections.map(a => Object.assign({}, a));
    //   filteredConnections = [] // Empty filtered connections
    //   for(const connection of filteredConnectionsAux){
    //       if(filters.country.includes ( connection.country_name) )
    //           filteredConnections.push(connection);            
    //   }
    // }


    return {
      connections: filteredConnections,
      users: users
    }
  }

  generateSource(users, connections){
    const source = [];
    let sourceIndex = 0;
    for (var i = 0; i < users.length; i++) {
        source[sourceIndex] = {};
        source[sourceIndex].data = users[i];
        sourceIndex++;
    }

    for (var i = 0; i < connections.length; i++) {
        source[sourceIndex] = {};
        source[sourceIndex].data = connections[i];
        sourceIndex++;
    }
    return source
  }

  render() {
    console.log("ReRender connections")

    if (this.cytoscapeMax === undefined) {
      this.cytoscapeMax = <CytoscapeComponent
        elements={sourceFile}
        cy={(cy) => { this.cy = cy }}
        style={{ width: '100%', height: '100%' }}
        stylesheet={this.cytoscapeStylesheet}
        layout={this.cytoscapeLayout} />;
    }

    
    let content_cy = <div>Loading</div>
    if(this.state.source.length > 0){
        content_cy = <CytoscapeComponent
                      elements={this.state.source}
                      style={{ width: '100%', height: '300px' }}
                      stylesheet={this.cytoscapeStylesheet}
                      layout={this.cytoscapeLayout} />
    }


    // NetworkContent
    const networkContent = this.state.showModalCytoscape ? this.cytoscapeMax : '';

    const { activeTab } = this.state;
    const content = (activeTab == TAB.NETWORK) ? networkContent : this.generateProfiles()

    // console.log("source imported ")
    // console.log(source)
    // console.log("source generated ")
    // console.log(this.state.source)

    return (
      <div>

        {content_cy}
        <div className="text-right pr-2 pb-1" style={{ cursor: 'pointer' }} onClick={(e) => this.openModal(e)}>
          <FontAwesomeIcon icon={faExpandArrowsAlt} />
        </div>

        <Modal animation centered
          show={this.state.showModal}
          onHide={(e) => this.closeModal(e)}
          onEntered={(e) => this.setState({ showModalCytoscape: true })}
          dialogClassName="connections-modal">
          <Modal.Header closeButton>
            <Modal.Title>Connections</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="d-flex" style={{ height: '100%' }}>
              <div style={{ width: '30%' }}>
                <div style={{ borderRadius: '3px', border: '1px solid #ccc', color: '#555' }}>
                  <div className="font-weight-bold" style={{ padding: '0.5em', paddingLeft: '15%', fontSize: '16px', backgroundColor: '#ddd' }}>FILTERS</div>
                  <div className="p-2">
                    <div className="font-weight-bold">Connection Strength</div>
                    <Select defaultValue={null} 
                      isMulti name="colors" options={connectionStregnthOptions}
                      onChange={ (e) => this.onFilterConnectionStrength(e)}
                    />
                    <div className="font-weight-bold">Country</div>
                    <Select defaultValue={null} 
                      isMulti name="colors" options={connectionStregnthOptions}
                      onChange={ (e) => this.onFilterCountry(e)}
                    />

                    <div className="font-weight-bold">Connection Type</div>
                    <Select defaultValue={null} 
                      isMulti name="colors" options={connectionStregnthOptions}
                      onChange={ (e) => this.onFilterConnectionType(e)}
                    />
                    <div className="d-flex">
                      <div className="w-50 mr-1">
                        <div className="font-weight-bold">From</div>
                        <Select options={options} />
                      </div>
                      <div className="w-50 ml-1">
                        <div className="font-weight-bold">To</div>
                        <Select options={options} />
                      </div>

                    </div>
                    
                  </div>
                </div>
                <div className="mt-3" style={{ borderRadius: '3px', border: '1px solid #ccc', color: '#555' }}>
                  <div className="font-weight-bold" style={{ padding: '0.5em', paddingLeft: '15%', fontSize: '16px', backgroundColor: '#ddd' }}>DETAILS</div>
                  <div className="p-3">
                    <NodeDetail />
                  </div>
                </div>
              </div>
              <div className="ml-3 d-flex h-100 w-100" style={{ flexDirection: 'column' }}>
                <div style={{ width: '100%' }} >
                  <Nav variant="tabs" style={{ width: '100%' }}>
                    <Nav.Item>
                      <Nav.Link href="#" active={activeTab == TAB.NETWORK}
                        onClick={(e) => this.setState({ activeTab: TAB.NETWORK })}>Network</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link href="#" active={activeTab == TAB.PROFILES}
                        onClick={(e) => this.setState({ activeTab: TAB.PROFILES })}>Profiles</Nav.Link>
                    </Nav.Item>
                  </Nav>
                </div>

                <div className="h-100" style={{ borderRadius: '0 3px 3px 3px', border: '1px solid #dee2e6 ', borderTop: 0 }}>
                  {content}
                </div>

              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={(e) => this.closeModal(e)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

      </div>);
  }
}



export default connect(mapStateToProps, undefined)(withRouter(PanelConnections))
