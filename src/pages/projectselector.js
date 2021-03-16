import React, { useState } from 'react';
// Bootstrap
import { Col, Row } from 'react-bootstrap';

// React Router
import { withRouter } from 'react-router-dom'

// Styles
import "./projectselector.scss"

// Axios
import axios from 'axios';
import environment from '../environment.json';

class ProjectSelector extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      projectList: []
    }
  }

  async get_project_list(){
    try{

      // Get List of projects
      const token = localStorage.getItem('token')
      const response = await axios.get( `${environment.base_url}/api/projects/?limit=100`,
          { headers: { "Authorization": "jwt " + token }
        })
      const projectList = response.data.results;

      const projectAllowedList = JSON.parse( localStorage.getItem('project_permissions') )
      for(const project of projectList){
        if( projectAllowedList.some(project_allowed => ( project_allowed.oid == project.oid) )  ){
          project.allowed = true
        }else{
          project.allowed = false
        }
      }

      this.setState({projectList: projectList})
    }catch(e){
      //this.props.history.push('/')
      console.log("FAILED")
    }


  }

  componentDidMount(){
    this.get_project_list()
  }

  render() {
    const { projectList } = this.state;
    const { reloaded } = this.props;
    return (
      <Row>
        <Col sm={12} className='page-container'>
          <div className="page-title">SELECT YOUR PLAN</div>
          <div className="d-flex flex-wrap" style={{ padding: '2em' }}>
            {projectList.map((item, id) =>
              <div key={id} style={{ padding: '1em 1em 0 1em', width: '33%', minWidth: '300px'  }} 
                onClick={ (e) => this.props.history.push(`${reloaded?'/reloaded':''}/project/${item.oid}`)}>
                <div className="landBtn project project-container btnActive"
                  style={{ height: '10em' }}>
                  <div className="top-triangle project"></div>
                  <div className="bottom-triangle project"></div>
                  <div className="content">
                    <div className="title project" style={{ wordBreak: 'break-all'}}>{item.name}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

        </Col>
      </Row>);
  }
}


export default withRouter(ProjectSelector);
