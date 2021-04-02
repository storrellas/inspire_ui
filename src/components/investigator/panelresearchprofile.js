import React from 'react';
// Bootstrap
import { Modal, Button } from 'react-bootstrap';

// React Router
import { withRouter } from 'react-router-dom'

// am4charts
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";

// Redux
import { connect } from "react-redux";

// Loading Overlay
import LoadingOverlay from 'react-loading-overlay';

// Styles
import './panelresearchprofile.scss';

// Axios
import axios from 'axios';

// Project imports
import EmptyPanel from '../shared/emptypanel';


const mapStateToProps = state => {
  return { 
    tabResearchProfileOpened: state.tabResearchProfileOpened,
    };
};


class PanelResearchProfile extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      isOpened: false,  
      researchProfileData: [],
      data: []  
    }    
  }


  async retrieveMesh(){
    try{

      const token = localStorage.getItem('token')
  
      const { match: { params } } = this.props;
      let investigatorId = params.subid;
      investigatorId = investigatorId.split('-')[investigatorId.split('-').length -1 ]
      investigatorId = parseInt( investigatorId )

      // Perform request
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/investigator/${investigatorId}/meshs/`,
        { headers: { "Authorization": "jwt " + token }
      })

      // Research Profile Data
      let research_profile_data = response.data.results
      this.setState({data: research_profile_data})

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

  async componentDidMount(){
    try{
      await this.retrieveMesh()
    }catch(error){
      console.log(error.request);
    }
  
  }

  generateChart(){
    // No data
    if( this.state.researchProfileData.length == 0){
      this.setState({isOpened: true})
      return
    }

    let chart = am4core.create("researchprofilechart", am4charts.PieChart);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
  
    chart.data = this.state.data.slice(0,7);

    var series = chart.series.push(new am4charts.PieSeries());
    series.radius = "100%"
    series.dataFields.value = "counter";
    series.dataFields.radiusValue = "counter";
    series.dataFields.category = "name";
    series.slices.template.cornerRadius = 6;
    series.colors.step = 3;
    // See: https://www.amcharts.com/docs/v4/tutorials/dealing-with-piechart-labels-that-dont-fit/
    series.labels.template.maxWidth = 150;
    series.labels.template.wrap = true;
    series.labels.template.fontSize = 14;

  
    series.hiddenState.properties.endAngle = -90;
  
    //chart.legend = new am4charts.Legend();
    this.chart = chart
    this.chart.legend = new am4charts.Legend();
    this.chart.legend.fontSize = 12;
    this.chart.legend.position = "right"

    // Set state after timeout
    this.setState({isOpened: true})
  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.dispose();
    }
  }

  generateModalData(){
    const { data } = this.state;


    // Get List of categories
    const category_set = new Set()
    for(let item of data)
      category_set.add(item.category_name)
    const category_list = Array.from(category_set)

    // Iterate on category list
    let research_profile_data = []
    for(let category of category_list){


      // Generate ChildrenList and compute relatives
      const childrenList = data.filter( x => x.category_name == category)
      const maxValue = 
        Math.max.apply(Math, childrenList.map((o) => o.counter ) )
      for(const item of childrenList){
        item['relative'] = (item.counter*100 / maxValue);
      }     
      research_profile_data.push({'name': category, 'childrenList': childrenList})
    }
    this.state.researchProfileData = research_profile_data;
    return research_profile_data
  }



  render() {
    if( this.props.tabResearchProfileOpened == true && 
        this.state.isOpened == false &&
        this.state.data !== undefined){
      const that = this;
      setTimeout(function(){ that.generateChart() }, 500);
    }


    const researchProfileData = this.generateModalData()
    const emptyPanelShow = researchProfileData.length == 0 
                            && this.props.tabResearchProfileOpened;
    return (
      <div>    
        <LoadingOverlay
          active={this.state.isOpened == false}
          spinner>

          <EmptyPanel show={emptyPanelShow} />
          {!emptyPanelShow?
          <>
            <div id="researchprofilechart" style={{ height:'100%', height: '500px' }}></div>

            <div className="mt-3" style={{ height: '400px'}}>
              <div className="h-100" style={{ overflowY:'scroll', overflowX: 'none'}}>
                <div style={{ position:'relative'}}>
                {researchProfileData.map( (item, key) => 
                <div key={key} id="category-page-3" className="category" style={{ marginTop: '1em', width: '100%'}}>
                  <h4><b>{item.name}</b></h4>
                  <div className="d-flex flex-wrap w-100 h-100">
                    {item.childrenList.map( (item, key) => 
                        <div key={key} className="w-50 p-2">
                          {item.label}
                          <div className={this.state.isOpened ? "bar ready" : "bar"} style={{ position: 'relative'}}>
                            <div className="pl-3" style={{ lineHeight: '30px', position:'absolute'}}>
                              <b>{item.counter} - {item.name}</b>
                            </div>
                            <div className="rowshadow text-rigth pl-3" style={{ width: item.relative + "%" }}>&nbsp;</div>
                          </div>
                        </div>
                      )}
                    </div>
                </div>
                )}
                </div>
                </div>
              </div>
            </>
            :''}
        </LoadingOverlay> 


      </div>);
  }
}

export default connect(mapStateToProps, undefined)(withRouter(PanelResearchProfile))