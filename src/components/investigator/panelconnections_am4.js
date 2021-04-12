import React, { useState } from 'react';
import { withRouter } from 'react-router-dom'

// Styles

// Assets

// Project imports

import cytoscape from 'cytoscape';
import euler from 'cytoscape-euler';

/* Imports */
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import * as am4plugins_forceDirected from "@amcharts/amcharts4/plugins/forceDirected"; 

import am4themes_animated from "@amcharts/amcharts4/themes/animated";

cytoscape.use( euler );

class PanelConnections extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentDidMount(){
    let chart = am4core.create("connectionschart", am4plugins_forceDirected.ForceDirectedTree);

    let networkSeries = chart.series.push(new am4plugins_forceDirected.ForceDirectedSeries())
    networkSeries.dataFields.linkWith = "linkWith";
    networkSeries.dataFields.name = "name";
    networkSeries.dataFields.id = "name";
    networkSeries.dataFields.value = "value";
    networkSeries.dataFields.children = "children";
    networkSeries.dataFields.fixed = "fixed";  
    
    networkSeries.nodes.template.label.text = "{name}"
    networkSeries.links.template.distance = "{distance}";

    networkSeries.fontSize = 8;
    networkSeries.linkWithStrength = 0;
    
    let nodeTemplate = networkSeries.nodes.template;
    nodeTemplate.tooltipText = "{name}";
    nodeTemplate.fillOpacity = 1;
    nodeTemplate.label.hideOversized = true;
    nodeTemplate.label.truncate = true;
    /*
    let linkTemplate = networkSeries.links.template;
    linkTemplate.strokeWidth = 1;
    let linkHoverState = linkTemplate.states.create("hover");
    linkHoverState.properties.strokeOpacity = 1;
    linkHoverState.properties.strokeWidth = 2;
    
    nodeTemplate.events.on("over", function (event) {
        let dataItem = event.target.dataItem;
        dataItem.childLinks.each(function (link) {
            link.isHover = true;
        })
    })
    
    nodeTemplate.events.on("out", function (event) {
        let dataItem = event.target.dataItem;
        dataItem.childLinks.each(function (link) {
            link.isHover = false;
        })
    })
    /**/
    networkSeries.data = [  
       {  
          "name":"Phoebe",
          "value":1,
          "fixed": true,
          "children":[  
             {  
                "name":"David",
                "value":1,
                "distance": 100
             },
             {  
                "name":"Roger",
                "value":1,
                "distance": 1
             },
             {  
                "name":"Duncan",
                "value":1,
                "distance": 1
             },
             {  
                "name":"Rob Dohnen",
                "value":1,
                "distance": 1
             }
          ]
       },

       
    ];
  }

  render() {
    return (
      <div>
        <div id="connectionschart" style={{ width:'100%', height: '400px', paddingBottom: '0.5em'}}></div>
      </div>);
  }
}


export default withRouter(PanelConnections);
