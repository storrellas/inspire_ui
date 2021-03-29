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

// am4charts
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
import am4geodata_data_countries2 from "@amcharts/amcharts4-geodata/data/countries2";

// Cytoscape
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from 'cytoscape';
import euler from 'cytoscape-euler';

// React Select
import Select from 'react-select'

// Project imports
import sourceFile from './source'
import userGray from '../../assets/userGray.png';


// Redux
import { connect } from "react-redux";

// Axios
import axios from 'axios';

cytoscape.use(euler);

const mapStateToProps = state => {
  return {
    investigatorProfile: state.investigatorProfile,
    tabConnectionsOpened: state.tabConnectionsOpened,
  };
};


function NodeDetail(props) {

  return (
    <div style={{ fontSize: '14px', color: "#000000" }}>
      <div style={{ fontSize: '18px', color: "#337ab7" }}>
        <a href={props.data.link} style={{color: "#337ab7"}}>{props.data.label}</a>
      </div>
      <div className="mt-2">{props.data.affiliation}</div>
      <div className="mt-2">All ({props.data.all})</div>
      <div>Trials ({props.data.clinicalTrials})</div>
      <div>Events ({props.data.events})</div>
      <div>Publications ({props.data.publications})</div>
      <div>Affiliations (past) ({props.data.institutionsPast})</div>
      <div>Affiliations (present) ({props.data.institutionsPresent})</div>
    </div>
  );
}


export const connectionStregnthOptions = [  
  { value: 'all', label: 'All'},
  { value: '2', label: '2'},
  { value: '3', label: '3'},
  { value: '4', label: '4'},
  { value: '5', label: '5'},
  { value: '6', label: '6'},
  { value: '7', label: '7'},
];


const connectionTypeOptions = [  
  { value: 'all', label: 'All'},
  { value: 'number_clinical_trials', label: 'Trials'},
  { value: 'number_events', label: 'Events'},
  { value: 'number_publications', label: 'Publications'},
  { value: 'number_institutions_past', label: 'Affiliations (past)'},
  { value: 'number_institutions_present', label: 'Affiliations (present)'},
];


const TAB = { NETWORK: 1, PROFILES: 2, }
class PanelConnectionsReloaded extends React.Component {

  constructor(props) {
    super(props)

    // generate yearRange
    const init = 1990;
    const end = (new Date()).getFullYear();
    let yearList = [...Array(end-init).keys()].map(i => i + init)
    yearList = yearList.map( x => {return {label: x, value: x}})

    
    this.state = {
      isOpened: false,
      activeTab: TAB.NETWORK,
      modalNetwork: undefined,
      users: [],
      connections: [],
      usersFiltered: [],
      connectionsFiltered: [],
      yearList: yearList,
      countryList: [],
      countrySelected: [],
      connectionTypeSelected: [connectionTypeOptions[0]],
      filters: {
        yearFrom: 1990,
        yearTo: (new Date()).getFullYear(),
        strength: 'all',
        connectionTypeList: ['all'],
        countryList: ['all']
      },
      cytoscapeInvestigator: {
        id: '', 
        label: '', 
        medical_expert_oid: '',
        affiliation: '', 
        image: '', 
        strength: '',
        common_project: '',
        all : 0, 
        clicalTrials: 0, 
        events: 0,
        publications: 0, 
        institutionsPast: 0, 
        institutionsPresent: 0
      },
    }
    this.cytoscape = undefined
    this.cytoscapeMax = undefined
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

  generateProfiles() {

    const { usersFiltered } = this.state;
    // remove first user
    const usersLocal = usersFiltered.slice(1);

    console.log("usersFiltered ", usersFiltered)

    return (
      <div className="h-100" style={{ position: 'relative'}}>
        <div className="h-100 d-flex flex-wrap" style={{ position:'absolute', overflowY: 'scroll' }}>
          {usersLocal.map((item, id) =>
            <div key={id} style={{ width: "33%", padding: '1em' }}>
              {item.common_project?
                <a href={item.link} target="_blank" style={{ fontSize: '18px', color: "#337ab7" }} >
                  <b>{item.label}</b>
                </a>                
                :
                <p style={{ fontSize: '18px', color: "#337ab7" }}>{item.label}</p>
              }
              <p style={{ fontSize: '14px' }}>{item.affiliation}</p>

            </div>
          )}
        </div>
      </div>);
 
  }

  renderedMaximised(cy){
    this.cy = cy
    const that = this;
    this.cy.removeAllListeners()
    this.cy.on('select', 'node', function (evt) {
      evt.preventDefault()
      var data = evt.target[0].data();
      that.setState({cytoscapeInvestigator:data})
    });
    this.cy.layout(this.cytoscapeLayout).run() 
  }

  getIntersection(a, b){
    return new Set([...a].filter(x => b.has(x)));
  }

  getFiltering(users, connections){

    const { filters } = this.state;

    // Initialise filtered connections/users
    let filteredUsers = users.map(x => Object.assign({}, x))
    let connectionsIdList = connections.map(x => x.id)    
    
    let filteredStrengthConnectionSet = new Set(connectionsIdList)
    // Filtering Strength
    if( filters.strength !== 'all' ){
      filteredStrengthConnectionSet = new Set()
      for(const connection of connections){

        // Equal number_objects
        if ( parseInt( filters.strength) <= connection.number_objects ) {
          filteredStrengthConnectionSet.add(connection.id);
        }
      }
    }

    
    // Country    
    let filteredCountryConnectionSet = new Set(connectionsIdList)
    if ( filters.countryList.includes('all') === false ) {
      filteredCountryConnectionSet = new Set()   
      // Iterate on connections
      for(const connection of connections){
          if(filters.countryList.includes( connection.country_name) )
            filteredCountryConnectionSet.add(connection.id);            
      }
    }

    // ConnectionType
    let filteredConnectionTypeConnectionSet = new Set(connectionsIdList)
    if ( filters.connectionTypeList.includes('all') === false ) {
      filteredConnectionTypeConnectionSet = new Set()
      // Iterate on connections
      for(const connection of connections){
        // Iterate on connectionType
        for( const connectionType of filters.connectionTypeList ) {
          if( connection[connectionType] > 0 ){
            console.log("connection ", connection)
            filteredConnectionTypeConnectionSet.add(connection.id);          
          }          
            
        } // End for connection Type

      } // End For connections
    }


    // Years
    const yearFrom = filters.yearFrom;
    const yearTo = filters.yearTo;

    const checkEventsDate = filters.connectionTypeList.includes('number_events')
    const checkTrialsDate = filters.connectionTypeList.includes('number_clinical_trials')
    const checkPublicationDate = filters.connectionTypeList.includes('number_publications')
    let filteredYearsSet = new Set(connectionsIdList)
    if(checkEventsDate || checkTrialsDate || checkPublicationDate){
      filteredYearsSet = new Set()
      for(const connection of connections){
        if(checkEventsDate){
          const { first_year_common_events, last_year_common_events } = connection;
          if( first_year_common_events < yearFrom || yearTo < last_year_common_events ){
            // Do nothing
          }else{
            filteredYearsSet.add(connection.id);
          }
        }
        if(checkTrialsDate){
          const { first_year_common_clinical_trials, last_year_common_clinical_trials } = connection;         
          if( first_year_common_clinical_trials < yearFrom || yearTo < last_year_common_clinical_trials ){
            // Do nothing
          }else{
            filteredYearsSet.add(connection.id);
          }
        }
        if(checkPublicationDate){
          const { first_year_common_publications, last_year_common_publications } = connection;
          if( first_year_common_publications < yearFrom || yearTo < last_year_common_publications  ){
            // Do nothing
          }else{
            filteredYearsSet.add(connection.id);
          }
        }
      }
    }

    // Get Ids intersection
    let intersection = this.getIntersection(filteredStrengthConnectionSet, filteredCountryConnectionSet)
    intersection = this.getIntersection(intersection, filteredConnectionTypeConnectionSet)
    intersection = this.getIntersection(intersection, filteredYearsSet)

    const filteredConnections = connections.filter( x => intersection.has(x.id) )

    // Fitering user using connections
    filteredUsers = []
    for(const user of users){
      if( filteredConnections.filter( x => x.source == user.id || x.target == user.id).length > 0 ){
        filteredUsers.push(user)
      }
    }

    return {
      users: filteredUsers,
      connections: filteredConnections,
    }
  }


  updateCytoscape(){
    const { users, connections } = this.state;
    const filtering = this.getFiltering(users, connections)


    // Force cytoscapeMax to reload
    this.cytoscapeMax = undefined;
    this.setState({ usersFiltered: filtering.users, connectionsFiltered: filtering.connections})
  }

  onFilterConnectionStrength(e){
    
    this.state.filters.strength = e.value
    this.updateCytoscape()
  }

  onFilterCountry(e){
    // If all and some other remove all
    if( e.filter( x => x.value == 'all').length > 0 && e.length > 1){
      e = e.filter( x =>  x.value !== 'all')
    }
    // If none set all
    if( e.length == 0 ){
      e = [this.state.countryList[0]]
    }
    this.state.countrySelected = e
    this.state.filters.countryList = e.map( x => x.value )

    this.updateCytoscape()
  }

  onFilterConnectionType(e){
    // If all and some other remove all
    if( e.filter( x => x.value == 'all').length > 0 && e.length > 1){
      e = e.filter( x =>  x.value !== 'all')
    }
    // If none set all
    if( e.length == 0 ){
      e = [this.state.countryList[0]]
    }
    this.state.connectionTypeSelected = e
    this.state.filters.connectionTypeList = e.map( x => x.value )

    this.updateCytoscape()
  }

  onYearFrom(e){
    this.state.filters.yearFrom = e.value
    this.updateCytoscape()
  }

  onYearTo(e){
    this.state.filters.yearTo = e.value
    this.updateCytoscape()
  }

  isValid(value) {
    return (value != null && value.trim().length > 0);
  }

  get_affiliation(item) {
    let affiliation = '';
    if (this.isValid(item.parent_name)) {
        affiliation += item.parent_name;
    }

    if (this.isValid(item.department) || this.isValid(item.division)) {
        affiliation += ', '
        if (this.isValid(item.department) && this.isValid(item.division)) {
            affiliation += item.department + ' - ' + item.division;
        } else if (this.isValid(item.department)) {
            affiliation += item.department;
        } else {
            affiliation += item.division
        }
    }
    return affiliation;
  }

  async retrieveConnections(){
    try{

      const token = localStorage.getItem('token')
  
      const { match: { params } } = this.props;
      let investigatorId = params.subid;
      investigatorId = investigatorId.split('-')[investigatorId.split('-').length -1 ]
      investigatorId = parseInt( investigatorId )
      let projectOid = params.id;

      // Perform request
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/investigator/${investigatorId}/connections/?affiliations=true`,
        { headers: { "Authorization": "jwt " + token }
      })

      const countrySet = new Set()

      // collection of nodes
      const investigator_img = {userGray};
      const users = [
        { 
          id: "1", 
          label: this.props.investigatorProfile.name, 
          affiliation: this.props.investigatorProfile.affiliationInstitution,
          image: this.props.picture || investigator_img, 
          strength: '',
          link: `/dashboard/project/${params.id}/investigator/${params.subid}`
        }
      ];      


      let connections = [];
      for(const [idx, item] of Object.entries(response.data.results) ){
                
        // Get data
        const middle_name = (this.isValid(item.middle_name))?item.middle_name:'';
        const combined_name = `${item.first_name} ${middle_name} ${item.last_name}`
        const affiliation = this.get_affiliation(item)

        //console.log("item ", item)
        if(item.common_project === true){
          console.log("Common Project !!!!")
        }

        // prevent adding the node if for some reason, a medical expert is connected more than once
        const user = {
            id: (idx+2), 
            label: combined_name, 
            affiliation: affiliation, 
            image: investigator_img, 
            strength: item.number_common_objects,
            common_project: item.common_project,
            link: `/dashboard/project/${projectOid}/investigator/${item.medical_expert_oid}`
        }
        users.push(user);
        connections.push({           
          id: 1 + '_' + user.id,
          source: 1, 

          target: user.id, 
          strength: item.number_common_objects,
          number_events: item.number_common_events,
          first_year_common_events: item.first_year_common_events,
          last_year_common_events: item.last_year_common_events,
          number_clinical_trials: item.number_common_clinical_trials,
          first_year_common_clinical_trials: item.first_year_common_clinical_trials,
          last_year_common_clinical_trials: item.last_year_common_clinical_trials,
          number_publications: item.number_common_publications,
          first_year_common_publications: item.first_year_common_publications,
          last_year_common_publications: item.last_year_common_publications,
          number_institutions_past: item.numaber_common_institutions_past,
          number_institutions_present: item.number_common_institutions_present,
          number_objects: item.number_common_objects, 
          country_name: item.country_name,
          color: (item.number_objects < 7)?'lightgray':'#4283f1'
        }); 

        if(item.country_name)
          countrySet.add(item.country_name)
      }


      // For panel cytoscape
      this.state.users = users
      this.state.connections = connections
      // For maximised cytoscape
      this.state.usersFiltered = users
      this.state.connectionsFiltered = connections

      this.state.cytoscapeInvestigator = users[0]

      // Append countries
      const countryList = [{value:'all', label: 'All'}]
      for( const country of countrySet )
        countryList.push({label: country, value: country})
      const countrySelected = [ countryList[0] ]

      // Initialise countries
      this.setState({ countryList: countryList, countrySelected:countrySelected} )

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
  
  randomLocation(){
    Math.random()

    const latitudeMax = 56.70411613681161;
    const longitudeMax = 27.244571091301232;

    const latitudeMin = 37.98896845287744;
    const longitudeMin = -8.106830464026174;

    const diffLatitude = latitudeMax - latitudeMin;
    const diffLongitude = longitudeMax - longitudeMin;

    const randomLatitude = diffLatitude * Math.random() + latitudeMin;
    const randomLongitude = diffLongitude * Math.random() + longitudeMin;


    return [randomLatitude, randomLongitude]
  }

  async generateMap2(){

    // let [latitude1, longitude1] = this.randomLocation()
    // console.log("random location ", latitude1, longitude1)
    // let [latitude2, longitude2] = this.randomLocation()
    // console.log("random location ", latitude2, longitude2)
    // let [latitude3, longitude3] = this.randomLocation()
    // console.log("random location ", latitude3, longitude3)

    console.log("GenerateMap2", this.state.usersFiltered)
    const { usersFiltered } = this.state;

    // Define marker path
let targetSVG = "M9,0C4.029,0,0,4.029,0,9s4.029,9,9,9s9-4.029,9-9S13.971,0,9,0z M9,15.93 c-3.83,0-6.93-3.1-6.93-6.93S5.17,2.07,9,2.07s6.93,3.1,6.93,6.93S12.83,15.93,9,15.93 M12.5,9c0,1.933-1.567,3.5-3.5,3.5S5.5,10.933,5.5,9S7.067,5.5,9,5.5 S12.5,7.067,12.5,9z";

// Create map instance
let chart = am4core.create("mapdiv", am4maps.MapChart);
let interfaceColors = new am4core.InterfaceColorSet();

// Set map definition
chart.geodata = am4geodata_worldLow;

// Set projection
chart.projection = new am4maps.projections.Mercator();

// Add zoom control
chart.zoomControl = new am4maps.ZoomControl();

// Set initial zoom
chart.homeZoomLevel = 1.5;
chart.homeGeoPoint = {
  latitude: 46.9480,
  longitude: 7.4474
};

// Create map polygon series
let polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
polygonSeries.include = [ "AL", "AD", "AM", "AT", "BY", "BE", "BG", 
"CH", "CY", "CZ", "DE", "DK","AT", "DK",
"EE", "ES", "FO", "FI", "FR", "GB", "GE", "GI", "GR", "HU", "HR",
"IE", "IS", "IT", "LT", "LU", "LV", 
"MC", "MK", "MT", "NO", "NL", "PL", "PT",
"RO", "SE", "SI", "SK", "SM", "TR", "UA", "VA",
//"RU", 
]
polygonSeries.useGeodata = true;
polygonSeries.mapPolygons.template.nonScalingStroke = true;

// Add images
let imageSeries = chart.series.push(new am4maps.MapImageSeries());
let imageTemplate = imageSeries.mapImages.template;
imageTemplate.tooltipHTML  = `<div><b>{name}</b></div>
<div style="margin-top: 0.5em; text-align: justify; text-justify: inter-word"><i>{institution}</i></div>
<div style="margin-top: 0.5em;"><b>All:</b> {all}</div>
<div><b>Trials:</b> {clinicalTrials}</div>
<div><b>Events:</b> {eventsNumber}</div>
<div><b>Publications:</b> {publications}</div>
<div><b>Affiliations (past):</b> {institutionsPast}</div>
<div><b>Affiliations (present):</b> {institutionsPresent}</div>`;
imageSeries.tooltip.label.wrap = true;
imageSeries.tooltip.label.width = 250;

imageTemplate.nonScaling = true;

let marker = imageTemplate.createChild(am4core.Sprite);
marker.path = targetSVG;
marker.horizontalCenter = "middle";
marker.verticalCenter = "middle";
marker.scale = 0.7;
marker.fill = interfaceColors.getFor("alternativeBackground");
imageTemplate.propertyFields.latitude = "latitude";
imageTemplate.propertyFields.longitude = "longitude";
const data = []
let counter = 0;
for(const item of usersFiltered){
  const nodeDesc = this.getNodeDesc(item.id)
  data.push({
    "id": item.id,
    "svgPath": targetSVG,
    "name": item.label,
    "institution": item.affiliation,
    "all": nodeDesc.all,
    "clinicalTrials": nodeDesc.clinicalTrials,
    "eventsNumber": nodeDesc.events,
    "publications": nodeDesc.publications,
    "institutionsPast": nodeDesc.institutionsPast,
    "institutionsPresent": nodeDesc.institutionsPresent,
    "latitude": this.randomLocation()[0],
    "longitude": this.randomLocation()[1],
    "scale": 1    
  })
  if( counter > 10 ){
    break;
  }
}
imageSeries.data = data



// Add lines
let lineSeries = chart.series.push(new am4maps.MapLineSeries());
lineSeries.dataFields.multiGeoLine = "multiGeoLine";

let lineTemplate = lineSeries.mapLines.template;
lineTemplate.nonScalingStroke = true;
lineTemplate.arrow.nonScaling = true;
lineTemplate.arrow.width = 4;
lineTemplate.arrow.height = 6;
lineTemplate.stroke = interfaceColors.getFor("alternativeBackground");
lineTemplate.fill = interfaceColors.getFor("alternativeBackground");
lineTemplate.line.strokeOpacity = 0.4;
const lineData = []
/*
for( const item of data ){
  if(item == data[0]) continue
  lineData.push(
    {
      "multiGeoLine": [
        [
          { "latitude": data[0].latitude, "longitude": data[0].longitude },
          { "latitude": item.latitude, "longitude": item.longitude }
        ]
      ]
    }
  )
}
/**/
lineSeries.data = lineData
/*
lineSeries.data = [{
  "multiGeoLine": [
    [
      { "latitude": 51.5002, "longitude": -0.1262 },
      { "latitude": 50.4422, "longitude": 30.5367 }
    ]
  ]
}, 
{
  "multiGeoLine": [
    [
      { "latitude": 51.5002, "longitude": -0.1262 },
      { "latitude": 37.9792, "longitude": 23.7166 }
    ]
  ]
}, {
  "multiGeoLine": [
    [
      { "latitude": 51.5002, "longitude": -0.1262 },
      { "latitude": 38.7072, "longitude": -9.1355 }
    ]
  ]
}, {
  "multiGeoLine": [
    [
      { "latitude": 51.5002, "longitude": -0.1262 },
      { "latitude": 55.7558, "longitude": 37.6176 }
    ]
  ]
}, {
  "multiGeoLine": [
    [
      { "latitude": 51.5002, "longitude": -0.1262 },
      { "latitude": 44.8048, "longitude": 20.4781 }
    ]
  ]
}, {
  "multiGeoLine": [
    [
      { "latitude": 51.5002, "longitude": -0.1262 },
      { "latitude": 48.2116, "longitude": 17.1547 }
    ]
  ]
}, {
  "multiGeoLine": [
    [
      { "latitude": 51.5002, "longitude": -0.1262 },
      { "latitude": 46.0514, "longitude": 14.5060 }
    ]
  ]
}, {
  "multiGeoLine": [
    [
      { "latitude": 51.5002, "longitude": -0.1262 },
      { "latitude": 40.4167, "longitude": -3.7033 }
    ]
  ]
}, {
  "multiGeoLine": [
    [
      { "latitude": 51.5002, "longitude": -0.1262 },
      { "latitude": 59.3328, "longitude": 18.0645 }
    ]
  ]
}, {
  "multiGeoLine": [
    [
      { "latitude": 51.5002, "longitude": -0.1262 },
      { "latitude": 46.9480, "longitude": 7.4481 }
    ]
  ]
}];
/**/
  }

  componentDidMount(){
    if( this.state.users.length == 0 && this.props.investigatorProfile){
      this.retrieveConnections()
    }

  }

  componentDidUpdate(){
    if( this.state.users.length == 0 && this.props.investigatorProfile){
      this.retrieveConnections()
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


  getNodeDesc(id) {

    const { connectionsFiltered } = this.state;

    // Calculate figures
    let clinicalTrials = 0;
    let events = 0;
    let publications = 0;
    let institutionsPast = 0;
    let institutionsPresent = 0;
    let connectionList = connectionsFiltered;

    if (id !== "1" )            
      connectionList = [connectionsFiltered.find(p => ((p.source == "1") && (p.target == id)))];
    for(const connection of connectionList){
      clinicalTrials += connection.number_clinical_trials || 0;
      events += connection.number_events || 0;
      publications += connection.number_publications || 0;
      institutionsPast += connection.number_institutions_past || 0;
      institutionsPresent += connection.number_institutions_present || 0;
    }
    let all = clinicalTrials + events + publications + 
                institutionsPast + institutionsPresent;
    return{
      all, clinicalTrials, events,
      publications, institutionsPast, institutionsPresent
    };
  }


  render() {

    const { usersFiltered, connectionsFiltered } = this.state;
    const source = this.generateSource(usersFiltered, connectionsFiltered)        
    if ( this.cytoscapeMax === undefined && source.length > 0) {

        this.generateMap2()

        this.cytoscapeMax = <CytoscapeComponent key={this.childKey}
                            elements={source}
                            cy={(cy) => this.renderedMaximised(cy) }
                            style={{ width: '100%', height: '100%' }}
                            stylesheet={this.cytoscapeStylesheet}
                            layout={this.cytoscapeLayout} />;        
    }

    const { activeTab, countryList, yearList } = this.state;
    const { countrySelected, connectionTypeSelected } = this.state;
    const { cytoscapeInvestigator } = this.state;
    const content = (activeTab == TAB.NETWORK) ? this.cytoscapeMax : this.generateProfiles()

    // Calculate nodeData
    let nodeDesc = {}
    if( cytoscapeInvestigator.id !== '' )
      nodeDesc = this.getNodeDesc(cytoscapeInvestigator.id)
    const nodeData = { ...cytoscapeInvestigator, ...nodeDesc}


    return (
      <>
      <div className="d-flex" style={{ height: '100%', alignItems: 'stretch' }}>

            
        <div style={{ width: '30%' }}>
          <div>
            <div className="font-weight-bold p-2 " style={{ fontSize: '16px' }}>FILTERS</div>
            <div className="p-2" style={{ color: '#555' }}>
              <div className="font-weight-bold">Connection Strength</div>
              <Select
                options={connectionStregnthOptions}
                defaultValue={connectionStregnthOptions[0]}
                onChange={ (e) => this.onFilterConnectionStrength(e)}
              />
              <div className="font-weight-bold">Country</div>
              <Select
                isMulti
                options={countryList}
                value={countrySelected}
                onChange={ (e) => this.onFilterCountry(e)}
              />

              <div className="font-weight-bold">Connection Type</div>
              <Select
                isMulti
                options={connectionTypeOptions}
                value={connectionTypeSelected}
                onChange={ (e) => this.onFilterConnectionType(e)}
              />
              <div className="d-flex">
                <div className="w-50 mr-1">
                  <div className="font-weight-bold">From</div>
                  <Select options={yearList} 
                    onChange={ (e) => this.onYearFrom(e)}
                    defaultValue={yearList[0]}/>
                </div>
                <div className="w-50 ml-1">
                  <div className="font-weight-bold">To</div>
                  <Select options={yearList} 
                    onChange={ (e) => this.onYearTo(e)}
                    defaultValue={yearList[yearList.length-1]}/>
                </div>

              </div>
              
            </div>
          </div>
          <div className="mt-3">
          <div className="font-weight-bold pl-2 " style={{ fontSize: '16px' }}>FILTERS</div>
            <div className="pt-2 pl-2" style={{ color: '#555' }}>
              <NodeDetail data={nodeData} />
            </div>
          </div>
        </div>

        <div className="ml-3 d-flex w-100" 
          style={{ flexDirection: 'column', overflow: 'hidden' }}>
          <Nav variant="tabs" style={{ width: '100%' }}>
            <Nav.Item>
              <Nav.Link href="#" active={activeTab == TAB.NETWORK}
                onClick={(e) => this.setState({ activeTab: TAB.NETWORK })}><b>Network</b></Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="#" active={activeTab == TAB.PROFILES}
                onClick={(e) => this.setState({ activeTab: TAB.PROFILES })}><b>Profiles</b></Nav.Link>
            </Nav.Item>
          </Nav>

          {content}
        </div>




      </div>
      
      <div id="mapdiv"  className="w-100" style={{height:'600px', marginTop:'20px'}}></div>

      </>);
  }
}


export default connect(mapStateToProps, undefined)(withRouter(PanelConnectionsReloaded))
