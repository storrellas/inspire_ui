import React, { useState } from 'react';
// Bootstrap
import { Col, Row } from 'react-bootstrap';

// React Router
import { withRouter } from 'react-router-dom'

// Styles
import "./projectselectorlegacy.scss"

// Axios
import axios from 'axios';

class ProjectSelectorLegacy extends React.Component {

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
      const response = await axios.get( `${process.env.REACT_APP_BASE_URL}/api/projects/?limit=100`,
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

  redirectProject(item){
    const { reloaded } = this.props;
    if( item.allowed )
      this.props.history.push(`${reloaded?'/reloaded/dashboard':''}/project/${item.oid}`)
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
                onClick={ (e) => this.redirectProject(item)}>
                <div className={item.allowed?"landBtn project project-container btnActive":"landBtn project project-container btnOpacity"}
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


export default withRouter(ProjectSelectorLegacy);
