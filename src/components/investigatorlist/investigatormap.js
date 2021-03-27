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
      setTimeout(function () { that.generateMap(); }, 200);
    }

    return (
      <>        
          <LoadingOverlay
            active={this.state.isOpened == false}
            spinner>              
            <div id="mapdiv"  className="w-100" style={{height:'400px', marginTop:'20px'}}></div>

          </LoadingOverlay>        
          
      </>
    );
  }
}



export default withRouter(InvestigatorMap);
