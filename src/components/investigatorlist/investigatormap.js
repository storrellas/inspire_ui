import React from 'react';

// React Router
import { withRouter } from 'react-router-dom'

// am4charts
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
import am4geodata_data_countries2 from "@amcharts/amcharts4-geodata/data/countries2";

// Axios
import axios from 'axios';

// Loading overlay
import LoadingOverlay from 'react-loading-overlay';

am4core.useTheme(am4themes_animated);

class InvestigatorMap extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      isOpened: false
    }
    // Themes end
    this.continents = {
      "AF": 0, "AN": 1, "AS": 2, "EU": 3, 
      "NA": 4,"OC": 5, "SA": 6
    }
  }

  async loadData(){
    let country_list_am4 = {}
    
    const { match: { params } } = this.props;
    const projectOid = params.id;

    try{

        // Get investigators per country
        const token = localStorage.getItem('token')
        let investigator_per_country_url = 
          `${process.env.REACT_APP_BASE_URL}/api/investigators-per-country/?project=${projectOid}`;
        let response = await axios.get(investigator_per_country_url, {
            headers: {"Authorization": `jwt ${token}`} })
        for (const country of response.data.results){
            country_list_am4[country.country__name] = {total: country.total, oid: ''}
        }


        // Get countries
        response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/countries/`, {
            headers: {"Authorization": `jwt ${token}`} 
          })
        for (const country of response.data.results){
            if( country.name in country_list_am4 ){
                country_list_am4[country.name].oid = country.oid
            }                
        }

        return country_list_am4
    }catch(error){
      console.log("Error", error)
    }
  }

  zoomConfiguration(){
    this.chart.zoomControl = new am4maps.ZoomControl();

    var homeButton = new am4core.Button();
    const that = this;
    homeButton.events.on("hit", function() {
        that.worldSeries.show();
        that.countrySeries.hide();
        that.chart.goHome();
    });

    homeButton.icon = new am4core.Sprite();
    homeButton.padding(7, 5, 7, 5);
    homeButton.width = 30;
    homeButton.icon.path = "M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8";
    homeButton.marginBottom = 10;
    homeButton.parent = this.chart.zoomControl;
    homeButton.insertBefore(this.chart.zoomControl.plusButton);
  }

  countriesMap(country_list_am4){
    this.worldSeries = this.chart.series.push(new am4maps.MapPolygonSeries());
    this.worldSeries.useGeodata = true;
    
    // Set investigators
    for (let feature of am4geodata_worldLow.features){
      feature.properties.investigators = "0 Medical Experts"
      if(feature.properties.name in country_list_am4){
          feature.properties.investigators = country_list_am4[feature.properties.name].total + " Medical Experts"
      }
    }

    this.worldSeries.geodata = am4geodata_worldLow;
    this.worldSeries.include = [ "AL", "AD", "AM", "AT", "BY", "BE", "BG", 
                                    "CH", "CY", "CZ", "DE", "DK","AT", "DK",
                                    "EE", "ES", "FO", "FI", "FR", "GB", "GE", "GI", "GR", "HU", "HR",
                                    "IE", "IS", "IT", "LT", "LU", "LV", 
                                    "MC", "MK", "MT", "NO", "NL", "PL", "PT",
                                    "RO", "SE", "SI", "SK", "SM", "TR", "UA", "VA",
                                    //"RU", 
                                    ];

    // Configure polygons
    this.worldPolygon = this.worldSeries.mapPolygons.template;
    this.worldPolygon.tooltipText = "{investigators}";
    this.worldPolygon.nonScalingStroke = true;
    this.worldPolygon.strokeOpacity = 0.5;
    this.worldPolygon.fill = am4core.color("#eee");
    this.worldPolygon.propertyFields.fill = "color";

    var hs = this.worldPolygon.states.create("hover");
    hs.properties.fill = this.chart.colors.getIndex(1);


    // Set up data for world countries
    var world_data = [];
    for(var id in am4geodata_data_countries2) {
        if (am4geodata_data_countries2.hasOwnProperty(id)) {
            var country = am4geodata_data_countries2[id];

            //
            //let color = 
            //  country.country in country_list_am4?continents["EU"]:continents["OC"];						
            //

            let color_chart = "#D3D3D3"
            // Grade colors
            const country_color_set = ["#A492E6","#927CE1","#8067DC","#6D58BC","#5B499D"]
            if( country.country in country_list_am4 ){
                const n_me = country_list_am4[country.country].total
                if(n_me < 200 ) color_chart = country_color_set[0]
                if(n_me >= 200 && n_me < 400 ) color_chart = country_color_set[1]
                if(n_me >= 400 && n_me < 600 ) color_chart = country_color_set[2]
                if(n_me >= 600 && n_me < 800 ) color_chart = country_color_set[3]
                if( n_me >= 800  ) color_chart = country_color_set[4]
            }

            if (country.maps.length) {
                world_data.push({
                    id: id,
                    color: color_chart,
                    map: country.maps[0]
                });
            }
        }
    }
    this.worldSeries.data = world_data;
  }

  regionMap(country_list_am4){
    this.countrySeries = this.chart.series.push(new am4maps.MapPolygonSeries());
    this.countrySeries.useGeodata = true;
    this.countrySeries.hide();
    this.countrySeries.geodataSource.events.on("done", async (ev) => {

        var country_data = [];   
        for (let feature of this.countrySeries.geodata.features){

            country_data.push({
                id: feature.id,
                color: "#D3D3D3",
            });
        }
        this.countrySeries.data = country_data;

        // Update labels in tooltips                
        try{

            // Get MEs per region
            const { match: { params } } = this.props;
            const projectOid = params.id;         
            const token = localStorage.getItem('token') 
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/investigators-per-region/?country=${country_id_selected}&project=${projectOid}`, {
                headers: {"Authorization": `jwt ${token}`} })
            const region_obj = {}
            for(let region of response.data.results){
                const region_name = region.region__name.split('(')[0].trim()
                region_obj[region_name] = region.total;
            }

            // Set per-region data
            var country_data = [];    
            for (let feature of this.countrySeries.geodata.features){
                feature.properties.investigators = 0 + " Medical Experts"
                feature.properties.count = 0

                // Set number of investigators
                if( feature.properties.name in region_obj ){
                    feature.properties.investigators = region_obj[feature.properties.name] + " Medical Experts"
                    feature.properties.count = region_obj[feature.properties.name]
                }

                // Decide color
                let color_chart = "#D3D3D3"
                // Grade colors
                const country_color_set = ["#A492E6","#927CE1","#8067DC","#6D58BC","#5B499D"]
                const n_me = feature.properties.count
                if(n_me > 0 && n_me < 5 ) color_chart = country_color_set[0]
                if(n_me >= 5 && n_me < 10 ) color_chart = country_color_set[1]
                if(n_me >= 10 && n_me < 20 ) color_chart = country_color_set[2]
                if(n_me >= 20 && n_me < 30 ) color_chart = country_color_set[3]
                if( n_me >= 30  ) color_chart = country_color_set[4]

                country_data.push({
                    id: feature.id,
                    color: color_chart,
                });
            }
            this.countrySeries.data = country_data;

        }catch(error){
            console.log("error", error)
        }

        // Hide world and show countries
        this.worldSeries.hide();
        this.countrySeries.show();
    });

    var countryPolygon = this.countrySeries.mapPolygons.template;
    countryPolygon.tooltipText = "{investigators}";
    countryPolygon.nonScalingStroke = true;
    countryPolygon.strokeOpacity = 0.5;
    let color = this.chart.colors.getIndex(this.continents["EU"])
    countryPolygon.fill = am4core.color( "#FF00FF" );
    countryPolygon.propertyFields.fill = "color";


    var hs = countryPolygon.states.create("hover");
    hs.properties.fill = this.chart.colors.getIndex(1);
    let country_id_selected = ''

    // Set up click events
    const that = this;
    this.worldPolygon.events.on("hit", function(ev) {
        
        // Allow click only on those countries with ME > 0
        if( ev.target.dataItem.dataContext.name in country_list_am4 == false){
            return
        }
        
        // Load regions map
        ev.target.series.chart.zoomToMapObject(ev.target);
        var map = ev.target.dataItem.dataContext.map;
        var country_selected = ev.target.dataItem.dataContext.name;
        country_id_selected = country_list_am4[country_selected].oid
        if (map) {
            ev.target.isHover = false;
            that.countrySeries.geodataSource.url = "https://www.amcharts.com/lib/4/geodata/json/" + map + ".json";
            that.countrySeries.geodataSource.load()
        }

        // Delete capitals
        //imageSeries.data = []
    });
  }

  async generateMap(){
    try{
      const country_list_am4 = await this.loadData();

      // Create map instance
      this.chart = am4core.create("mapdiv", am4maps.MapChart);
      this.chart.projection = new am4maps.projections.Miller();

      // Create COUNTRIES MAP
      // ---------------------------------------
      this.countriesMap(country_list_am4)
    
      // Region series
      // -----------------------------
      this.countrySeries = this.chart.series.push(new am4maps.MapPolygonSeries());
      this.countrySeries.useGeodata = true;
      this.countrySeries.hide();
      this.countrySeries.geodataSource.events.on("done", async (ev) => {

          var country_data = [];   
          for (let feature of this.countrySeries.geodata.features){

              country_data.push({
                  id: feature.id,
                  color: "#D3D3D3",
              });
          }
          this.countrySeries.data = country_data;

          // Update labels in tooltips                
          try{

              // Get MEs per region
              const { match: { params } } = this.props;
              const projectOid = params.id;         
              const token = localStorage.getItem('token') 
              const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/investigators-per-region/?country=${country_id_selected}&project=${projectOid}`, {
                  headers: {"Authorization": `jwt ${token}`} })
              const region_obj = {}
              for(let region of response.data.results){
                  const region_name = region.region__name.split('(')[0].trim()
                  region_obj[region_name] = region.total;
              }

              // Set per-region data
              var country_data = [];    
              for (let feature of this.countrySeries.geodata.features){
                  feature.properties.investigators = 0 + " Medical Experts"
                  feature.properties.count = 0

                  // Set number of investigators
                  if( feature.properties.name in region_obj ){
                      feature.properties.investigators = region_obj[feature.properties.name] + " Medical Experts"
                      feature.properties.count = region_obj[feature.properties.name]
                  }

                  // Decide color
                  let color_chart = "#D3D3D3"
                  // Grade colors
                  const country_color_set = ["#A492E6","#927CE1","#8067DC","#6D58BC","#5B499D"]
                  const n_me = feature.properties.count
                  if(n_me > 0 && n_me < 5 ) color_chart = country_color_set[0]
                  if(n_me >= 5 && n_me < 10 ) color_chart = country_color_set[1]
                  if(n_me >= 10 && n_me < 20 ) color_chart = country_color_set[2]
                  if(n_me >= 20 && n_me < 30 ) color_chart = country_color_set[3]
                  if( n_me >= 30  ) color_chart = country_color_set[4]

                  country_data.push({
                      id: feature.id,
                      color: color_chart,
                  });
              }
              this.countrySeries.data = country_data;

          }catch(error){
              console.log("error", error)
          }

          // Hide world and show countries
          this.worldSeries.hide();
          this.countrySeries.show();
      });

      var countryPolygon = this.countrySeries.mapPolygons.template;
      countryPolygon.tooltipText = "{investigators}";
      countryPolygon.nonScalingStroke = true;
      countryPolygon.strokeOpacity = 0.5;
      let color = this.chart.colors.getIndex(this.continents["EU"])
      countryPolygon.fill = am4core.color( "#FF00FF" );
      countryPolygon.propertyFields.fill = "color";


      var hs = countryPolygon.states.create("hover");
      hs.properties.fill = this.chart.colors.getIndex(1);
      let country_id_selected = ''

      // Set up click events
      const that = this;
      this.worldPolygon.events.on("hit", function(ev) {
          
          // Allow click only on those countries with ME > 0
          if( ev.target.dataItem.dataContext.name in country_list_am4 == false){
              return
          }
          
          // Load regions map
          ev.target.series.chart.zoomToMapObject(ev.target);
          var map = ev.target.dataItem.dataContext.map;
          var country_selected = ev.target.dataItem.dataContext.name;
          country_id_selected = country_list_am4[country_selected].oid
          if (map) {
              ev.target.isHover = false;
              that.countrySeries.geodataSource.url = "https://www.amcharts.com/lib/4/geodata/json/" + map + ".json";
              that.countrySeries.geodataSource.load()
          }

          // Delete capitals
          //imageSeries.data = []
      });


      // Zoom control
      // -----------------------------
      this.zoomConfiguration();

    }catch(e){
      console.log("Error", e)
    }

    this.setState({ isOpened: true})
  }

  async generateMap2(){
    // Define marker path
let targetSVG = "M9,0C4.029,0,0,4.029,0,9s4.029,9,9,9s9-4.029,9-9S13.971,0,9,0z M9,15.93 c-3.83,0-6.93-3.1-6.93-6.93S5.17,2.07,9,2.07s6.93,3.1,6.93,6.93S12.83,15.93,9,15.93 M12.5,9c0,1.933-1.567,3.5-3.5,3.5S5.5,10.933,5.5,9S7.067,5.5,9,5.5 S12.5,7.067,12.5,9z";

// Create map instance
let chart = am4core.create("mapdiv2", am4maps.MapChart);
let interfaceColors = new am4core.InterfaceColorSet();

// Set map definition
chart.geodata = am4geodata_worldLow;

// Set projection
chart.projection = new am4maps.projections.Mercator();

// Add zoom control
chart.zoomControl = new am4maps.ZoomControl();

// Set initial zoom
chart.homeZoomLevel = 4;
chart.homeGeoPoint = {
  latitude: 46.9480,
  longitude: 7.4474
};
// this.worldSeries.geodata = am4geodata_worldLow;
// this.worldSeries.include = [ "AL", "AD", "AM", "AT", "BY", "BE", "BG", 
//                                 "CH", "CY", "CZ", "DE", "DK","AT", "DK",
//                                 "EE", "ES", "FO", "FI", "FR", "GB", "GE", "GI", "GR", "HU", "HR",
//                                 "IE", "IS", "IT", "LT", "LU", "LV", 
//                                 "MC", "MK", "MT", "NO", "NL", "PL", "PT",
//                                 "RO", "SE", "SI", "SK", "SM", "TR", "UA", "VA",
//                                 //"RU", 
//                                 ];

// // Configure polygons
// this.worldPolygon = this.worldSeries.mapPolygons.template;
// this.worldPolygon.tooltipText = "{investigators}";
// this.worldPolygon.nonScalingStroke = true;
// this.worldPolygon.strokeOpacity = 0.5;
// this.worldPolygon.fill = am4core.color("#eee");
// this.worldPolygon.propertyFields.fill = "color";
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
imageTemplate.tooltipText = "{title}";
imageTemplate.nonScaling = true;

let marker = imageTemplate.createChild(am4core.Sprite);
marker.path = targetSVG;
marker.horizontalCenter = "middle";
marker.verticalCenter = "middle";
marker.scale = 0.7;
marker.fill = interfaceColors.getFor("alternativeBackground");

imageTemplate.propertyFields.latitude = "latitude";
imageTemplate.propertyFields.longitude = "longitude";
imageSeries.data = [ {
  "id": "london",
  "svgPath": targetSVG,
  "title": "London",
  "latitude": 51.5002,
  "longitude": -0.1262,
  "scale": 1
}, {
  "svgPath": targetSVG,
  "title": "Brussels",
  "latitude": 50.8371,
  "longitude": 4.3676,
  "scale": 0.5
}, {
  "svgPath": targetSVG,
  "title": "Prague",
  "latitude": 50.0878,
  "longitude": 14.4205,
  "scale": 0.5
}, {
  "svgPath": targetSVG,
  "title": "Athens",
  "latitude": 37.9792,
  "longitude": 23.7166,
  "scale": 0.5
}, {
  "svgPath": targetSVG,
  "title": "Reykjavik",
  "latitude": 64.1353,
  "longitude": -21.8952,
  "scale": 0.5
}, {
  "svgPath": targetSVG,
  "title": "Dublin",
  "latitude": 53.3441,
  "longitude": -6.2675,
  "scale": 0.5
}, {
  "svgPath": targetSVG,
  "title": "Oslo",
  "latitude": 59.9138,
  "longitude": 10.7387,
  "scale": 0.5
}, {
  "svgPath": targetSVG,
  "title": "Lisbon",
  "latitude": 38.7072,
  "longitude": -9.1355,
  "scale": 0.5
}, {
  "svgPath": targetSVG,
  "title": "Moscow",
  "latitude": 55.7558,
  "longitude": 37.6176,
  "scale": 0.5
}, {
  "svgPath": targetSVG,
  "title": "Belgrade",
  "latitude": 44.8048,
  "longitude": 20.4781,
  "scale": 0.5
}, {
  "svgPath": targetSVG,
  "title": "Bratislava",
  "latitude": 48.2116,
  "longitude": 17.1547,
  "scale": 0.5
}, {
  "svgPath": targetSVG,
  "title": "Ljubljana",
  "latitude": 46.0514,
  "longitude": 14.5060,
  "scale": 0.5
}, {
  "svgPath": targetSVG,
  "title": "Madrid",
  "latitude": 40.4167,
  "longitude": -3.7033,
  "scale": 0.5
}, {
  "svgPath": targetSVG,
  "title": "Stockholm",
  "latitude": 59.3328,
  "longitude": 18.0645,
  "scale": 0.5
}, {
  "svgPath": targetSVG,
  "title": "Bern",
  "latitude": 46.9480,
  "longitude": 7.4481,
  "scale": 0.5
}, {
  "svgPath": targetSVG,
  "title": "Kiev",
  "latitude": 50.4422,
  "longitude": 30.5367,
  "scale": 0.5
}, {
  "svgPath": targetSVG,
  "title": "Paris",
  "latitude": 48.8567,
  "longitude": 2.3510,
  "scale": 0.5
}, {
  "svgPath": targetSVG,
  "title": "New York",
  "latitude": 40.43,
  "longitude": -74,
  "scale": 0.5
} ];

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

lineSeries.data = [{
  "multiGeoLine": [
    [
      { "latitude": 51.5002, "longitude": -0.1262 },
      { "latitude": 50.4422, "longitude": 30.5367 }
    ]
  ]
}, {
  "multiGeoLine": [
    [
      { "latitude": 51.5002, "longitude": -0.1262 },
      { "latitude": 40.4300, "longitude": -74.0000 }
    ]
  ]
}, {
  "multiGeoLine": [
    [
      { "latitude": 51.5002, "longitude": -0.1262 },
      { "latitude": 64.1353, "longitude": -21.8952 }
    ]
  ]
}, {
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
  }

  componentDidMount(){

  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.dispose();
    }
  }

  render(){
    if ( this.state.isOpened == false) {
      const that = this;
      setTimeout(function () { that.generateMap(); that.generateMap2() }, 200);
    }

    return (
      <>        
          <LoadingOverlay
            active={this.state.isOpened == false}
            spinner>              
            <div id="mapdiv"  className="w-100" style={{height:'400px', marginTop:'20px'}}></div>

            <div id="mapdiv2"  className="w-100" style={{height:'400px', marginTop:'20px'}}></div>


          </LoadingOverlay>        
          
      </>
    );
  }
}



export default withRouter(InvestigatorMap);
