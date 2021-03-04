import React from 'react';

// React Router
import { withRouter } from 'react-router-dom'

// am4charts
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
import am4geodata_data_countries2 from "@amcharts/amcharts4-geodata/data/countries2";

am4core.useTheme(am4themes_animated);

class InvestigatorMap extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      isOpened: false
    }
  }

  generateMap(){
    console.log("Generating map")
    // Themes end
    var continents = {
      "AF": 0,
      "AN": 1,
      "AS": 2,
      "EU": 3,
      "NA": 4,
      "OC": 5,
      "SA": 6
    }

    // Create map instance
    let chart = am4core.create("mapdiv", am4maps.MapChart);
    chart.projection = new am4maps.projections.Miller();

    // Create COUNTRIES MAP
    // ---------------------------------------
    var worldSeries = chart.series.push(new am4maps.MapPolygonSeries());
    worldSeries.useGeodata = true;
    
    worldSeries.geodata = am4geodata_worldLow;
    worldSeries.include = [ "AL", "AD", "AM", "AT", "BY", "BE", "BG", 
                                    "CH", "CY", "CZ", "DE", "DK","AT", "DK",
                                    "EE", "ES", "FO", "FI", "FR", "GB", "GE", "GI", "GR", "HU", "HR",
                                    "IE", "IS", "IT", "LT", "LU", "LV", 
                                    "MC", "MK", "MT", "NO", "NL", "PL", "PT",
                                    "RO", "SE", "SI", "SK", "SM", "TR", "UA", "VA",
                                    //"RU", 
                                    ];

    // Configure polygons
    var worldPolygon = worldSeries.mapPolygons.template;
    worldPolygon.tooltipText = "{investigators}";
    worldPolygon.nonScalingStroke = true;
    worldPolygon.strokeOpacity = 0.5;
    worldPolygon.fill = am4core.color("#eee");
    worldPolygon.propertyFields.fill = "color";

    var hs = worldPolygon.states.create("hover");
    hs.properties.fill = chart.colors.getIndex(1);


    // Set up data for world countries
    var world_data = [];
    for(var id in am4geodata_data_countries2) {
        if (am4geodata_data_countries2.hasOwnProperty(id)) {
            var country = am4geodata_data_countries2[id];

            let color_chart = "#D3D3D3"
            if (country.maps.length) {
                world_data.push({
                    id: id,
                    color: color_chart,
                    map: country.maps[0]
                });
            }
        }
    }
    worldSeries.data = world_data;

    
    // Zoom control
    // -----------------------------
    chart.zoomControl = new am4maps.ZoomControl();

    var homeButton = new am4core.Button();
    homeButton.events.on("hit", function() {
        worldSeries.show();
        //countrySeries.hide();
        chart.goHome();

        // Set capitals
        //imageSeries.data = country_list
    });

    homeButton.icon = new am4core.Sprite();
    homeButton.padding(7, 5, 7, 5);
    homeButton.width = 30;
    homeButton.icon.path = "M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8";
    homeButton.marginBottom = 10;
    homeButton.parent = chart.zoomControl;
    homeButton.insertBefore(chart.zoomControl.plusButton);


    this.chart = chart

    this.setState({ isOpened: true})
  }

  componentDidMount(){
    //this.generateMap()
  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.dispose();
    }
  }

  render(){
    if ( this.state.isOpened == false) {
      const that = this;
      setTimeout(function () { that.generateMap() }, 200);
    }


    return (
      <div style={{
        backgroundColor: 'white', border: '1px solid',
        borderColor: 'transparent #dee2e6 #dee2e6 #dee2e6', borderRadius: '0 .25rem 0 .25rem',
        minHeight: '50vh', padding: '2em'
      }}>
        <div className="w-100">
          <div id="mapdiv" style={{height:'400px', marginTop:'20px'}}></div>
        </div>
      </div>
    );
  }
}



export default withRouter(InvestigatorMap);
