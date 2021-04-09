import React from 'react';

// Bootstrap
import { Nav, Col, Row, Form } from 'react-bootstrap';

// React Router
import { withRouter } from 'react-router-dom'

// Styles

// Axios
import axios from 'axios';




class Profile extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      email : '',
      firstName: '',
      lastName: '',
      projectAllowedList: [],
      projectList: [],
    }
  }

  async getProfile(){
    try{

      // Get List of projects
      const token = localStorage.getItem('token')
      const response = await axios.get( `${process.env.REACT_APP_BASE_URL}/api/me/`,
          { headers: { "Authorization": "jwt " + token }
        })


      this.setState({
        email: response.data.email,
        firstName: response.data.first_name,
        lastName: response.data.last_name,
        projectAllowedList: response.data.project_permissions,
      })
      return response.data.project_permissions
    }catch(e){
      //this.props.history.push('/')
      console.log("FAILED")
    }

  }

  async getProjectList(projectAllowedList){
    try{

      // Get List of projects
      const token = localStorage.getItem('token')
      const response = await axios.get( `${process.env.REACT_APP_BASE_URL}/api/projects/?limit=100&offset=0`,
          { headers: { "Authorization": "jwt " + token }
        })

      const projectList = response.data.results;
      for(let project of projectList){
        if( projectAllowedList.some(item => ( item.oid == project.oid) )  ){
          project.allowed = true
        }else{
          project.allowed = false
        }
      }


      this.setState({
        projectList: projectAllowedList,
      })
    }catch(e){
      //this.props.history.push('/')
      console.log("FAILED", e)
    }
  }

  async componentDidMount(){
    const projectAllowedList = await this.getProfile()
    await this.getProjectList(projectAllowedList)
  }

  render() {
    
    const { email, firstName, lastName, projectList } = this.state;

    return (
      <Row className='mt-3 mb-3'>
        <Col sm={12} className='page-container'>
          <div><b>PROFILE</b></div>
          <Row>
            <Col className="pt-3" sm={{ span: 4, offset: 4 }}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control disabled type="email" defaultValue={email}/>
              </Form.Group>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>First Name</Form.Label>
                <Form.Control disabled type="text" defaultValue={firstName}  />
              </Form.Group>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Last Name</Form.Label>
                <Form.Control disabled type="text" defaultValue={lastName}  />
              </Form.Group>
              <Form.Group controlId="exampleForm.ControlSelect2">
                <Form.Label>Project Permissions</Form.Label>
                <Form.Control disabled as="select" multiple style={{ height: '400px'}}>
                  {projectList.map( (item, id ) =>
                    <option selected={item.allowed} key={id}>{item.name}</option>
                  )}
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>

        </Col>
      </Row>);
  }
}


export default withRouter(Profile);
