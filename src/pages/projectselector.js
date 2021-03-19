import React, { useState } from 'react';
// Bootstrap
import { Col, Row } from 'react-bootstrap';

// React Router
import { withRouter } from 'react-router-dom'

// Styles
//import "./projectselector.scss"

// Axios
import axios from 'axios';

class ProjectSelector extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      projectList: [],
      projectAllowedList: []
    }
  }

  async get_project_list(){
    try{

      // Get List of projects
      const token = localStorage.getItem('token')
      const response = await axios.get( `${process.env.REACT_APP_BASE_URL}/api/projects/?limit=100`,
          { headers: { "Authorization": "jwt " + token }
        })
      const projectList = response.data.results;

      const projectAllowedList = JSON.parse( localStorage.getItem('project_permissions') )
      // for(const project of projectList){
      //   if( projectAllowedList.some(project_allowed => ( project_allowed.oid == project.oid) )  ){
      //     project.allowed = true
      //   }else{
      //     project.allowed = false
      //   }
      // }

      for(const project of projectAllowedList){
        const nameList = project.name.split('_');
        project.allowed = true;
        if(nameList.length >= 3 ){
          project.type = nameList[0]        
          project.country = nameList[ nameList.length -1 ]
          project.shortName = project.name.replace(`${project.type}_`,'').replace(`_${project.country}`,'')
        }else{
          project.type = undefined
          project.country = undefined
          project.shortName = undefined
        }
        
      }

      
      this.setState({projectList: projectList, projectAllowedList: projectAllowedList})
    }catch(e){
      //this.props.history.push('/')
      console.log("FAILED")
    }


  }

  componentDidMount(){
    this.get_project_list()
  }

  redirectProject(item){
    if( item.allowed )
      this.props.history.push(`/dashboard/project/${item.oid}`)
  }

  render() {
    const { projectList, projectAllowedList } = this.state;
    const { reloaded } = this.props;

    // NOTE: Project with allowed item
    // const projectListRenderAllowed = projectAllowedList.map((item, id) =>
    //                             <div key={id} style={{ padding: '1em 0 0 0', width: '300px', minWidth: '300px'  }} 
    //                               onClick={ (e) => this.redirectProject(item)}>
    //                               <div className="landBtn project project-container btnActive"
    //                                 style={{ height: '10em' }}>
    //                                 <div className="top-triangle project"></div>
    //                                 <div className="bottom-triangle project"></div>
    //                                 <div className="content">
    //                                   <div className="title project" style={{ wordBreak: 'break-all'}}>{item.name}</div>
    //                                 </div>
    //                               </div>
    //                             </div>
    //                           )

    const projectListRenderAllowed = projectAllowedList.map((item, id) =>
                              <div key={id} style={{ padding: '1em 0 0 0', width: '300px', minWidth: '300px', cursor: 'pointer'  }} 
                                onClick={ (e) => this.redirectProject(item)}>
                                <div className="d-flex flex-column" style={{ height: '8em', border: '1px solid #399C49', borderRadius: '5px' }}>
                                  <div className="text-center p-2 font-weight-bold" 
                                      style={{ backgroundColor: 'rgba(57, 156, 73, 0.2)', color: 'rgb(57, 156, 73)'}}>
                                      Project
                                  </div>
                                  <div className="h-100 text-center d-flex justify-content-center flex-column" 
                                    style={{ wordBreak: 'break-all', flexGrow: 1}}>

                                      <div className="d-flex justify-content-between" style={{ padding: '0 10% 0 10%'}}>
                                      {item.type === undefined?
                                      <>
                                        <div className="w-100 font-weight-bold">{item.name}</div>
                                      </>
                                      :
                                      <>
                                        <div className="font-weight-bold">{item.type}</div>
                                        <div className="inspire-text-secondary">|</div>
                                        <div className="inspire-text-secondary font-weight-bold">{item.shortName}</div>
                                        <div className="inspire-text-secondary">|</div>
                                        <div className="inspire-text-secondary font-weight-bold">{item.country}</div>
                                        
                                      </>}
                                      </div>                                                                            
                                  </div>
                                </div>
                              </div>
                            )

    return (
      <Row>
        <Col sm={12} className='page-container'>
          <div><b>SELECT YOUR PLAN</b></div>
          <div className="d-flex flex-wrap" style={{ paddingTop: '2em', justifyContent: 'space-evenly' }}>
            {projectListRenderAllowed}
          </div>
        </Col>
      </Row>);
  }
}


export default withRouter(ProjectSelector);
