import React, { useState } from 'react';
// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

import { withRouter } from 'react-router-dom'

import { Modal, Button } from 'react-bootstrap';

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExpandArrowsAlt, faSearch } from '@fortawesome/free-solid-svg-icons'

// Styles

// Assets

// Project imports


class PanelAffiliations extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      showModalUniversities: false,
      showModalHospitals: false,
      showModalAssociations: false,
    }
  }

  closeModal(){
    this.setState({
      showModalUniversities: false,
      showModalHospitals: false,
      showModalAssociations: false
    })
  }

  render() {

    const item = {
      position: 'Head of',
      name: 'Klinikum Minden	',
      department: 'Klinik für Neurologie',
      subtype: 'Hospital Department',
      pastPosition: 'Yes',
      year: '1999 - 2005',
      city: 'Hamburg',
      country: 'Germany',
    }
    const data = Array(10).fill(item);

    return (
      <div>
        <div className="d-flex" style={{ margin: '0 0.2em 0 0.2em'}}>
          <div className="text-center" style={{ width: '33%', margin: '1em 0.2em 1em 0.2em', border: '1px solid #4780c4' }}>
            <img className="w-100" src="https://demo.explicatos.com/img/icons_37_37_px-13.png" alt=" "></img>
            <div>7</div>
            <div style={{ padding: '0.4em'}}>
              <button className="btn btn-primary" style={{ backgroundColor: '#4780c4', fontSize: '14px'  }}
                onClick={ (e) => this.setState({showModalUniversities: true})}>
                Universities
              </button>
            </div>
          </div>
          <div className="text-center" style={{ width: '33%', margin: '1em 0.2em 1em 0.2em', border: '1px solid #4780c4'  }}>
            <img className="w-100" src="https://demo.explicatos.com/img/icons_37_37_px-14.png" alt=" "></img>
            <div>15</div>
            <div style={{ padding: '0.4em'}}>
              <button className="w-100 btn btn-primary" style={{ backgroundColor: '#4780c4', fontSize: '14px' }}
                onClick={ (e) => this.setState({showModalHospitals: true})}>
                Hospitals
              </button>
            </div>
          </div>
          <div className="text-center" style={{ width: '33%', margin: '1em 0.2em 1em 0.2em', border: '1px solid #4780c4'  }}>
            <img className="w-100" src="https://demo.explicatos.com/img/icons_37_37_px-12.png" alt=" "></img>
            <div>4</div>
            <div style={{ padding: '0.2em'}}>
              <button className="btn btn-primary" style={{ backgroundColor: '#4780c4', fontSize: '14px'  }}
                onClick={ (e) => this.setState({showModalAssociations: true})}>
                  Associations
              </button>
            </div>
          </div>
        </div>

        <Modal animation centered
          show={this.state.showModalAssociations || this.state.showModalHospitals || this.state.showModalUniversities}
          onHide={(e) => this.closeModal(e)}
          dialogClassName="affiliations-modal">
          <Modal.Header closeButton>
            <Modal.Title>Affiliations</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="p-3">
                <table className="w-100">
                  <thead>
                    <tr>
                      <td className="text-center">Position</td>
                      <td className="text-center">Name</td>
                      <td className="text-center">Department</td>
                      <td className="text-center">Subtype</td>
                      <td className="text-center">Past Position</td>
                      <td className="text-center">Year</td>
                      <td className="text-center">City</td>
                      <td className="text-center">Country</td>
                    </tr>
                    <tr style={{ border: '1px solid grey', borderWidth: '1px 0px 2px 0px' }}>
                      <td><FontAwesomeIcon icon={faSearch} style={{ fontSize: '1em', color: 'grey' }} /></td>
                      <td><FontAwesomeIcon icon={faSearch} style={{ fontSize: '1em', color: 'grey' }} /></td>
                      <td><FontAwesomeIcon icon={faSearch} style={{ fontSize: '1em', color: 'grey' }} /></td>
                      <td><FontAwesomeIcon icon={faSearch} style={{ fontSize: '1em', color: 'grey' }} /></td>
                      <td><FontAwesomeIcon icon={faSearch} style={{ fontSize: '1em', color: 'grey' }} /></td>
                      <td><FontAwesomeIcon icon={faSearch} style={{ fontSize: '1em', color: 'grey' }} /></td>
                      <td><FontAwesomeIcon icon={faSearch} style={{ fontSize: '1em', color: 'grey' }} /></td>
                      <td><FontAwesomeIcon icon={faSearch} style={{ fontSize: '1em', color: 'grey' }} /></td>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, id) =>
                      <tr key={id}>
                        <td>{item.position}</td>
                        <td>{item.name}</td>
                        <td>{item.department}</td>
                        <td>{item.subtype}</td>
                        <td>{item.pastPosition}</td>
                        <td>{item.year}</td>
                        <td>{item.city}</td>
                        <td>{item.country}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={(e) => this.closeModal(e)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>);
  }
}

export default withRouter(PanelAffiliations);
