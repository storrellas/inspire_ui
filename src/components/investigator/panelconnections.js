import React from 'react';
// Bootstrap
import { Modal, Button, Nav, Row, Col } from 'react-bootstrap';

// React Router
import { withRouter } from 'react-router-dom'

// Styles
import './modal.scss';

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExpandArrowsAlt } from '@fortawesome/free-solid-svg-icons'

// Cytoscape
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from 'cytoscape';
import euler from 'cytoscape-euler';

// Project imports
import source from './source'

cytoscape.use(euler);

const TAB = { NETWORK: 1, PROFILES: 2, }
class PanelConnections extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      showModal: false,
      showModalCytoscape: false,
      activeTab: TAB.NETWORK,
      modalNetwork: undefined
    }
  }

  openModal(e) {
    this.setState({ showModal: true })
  }

  closeModal(e) {
    this.cy.resize()
    this.cy.fit();
    this.setState({ showModal: false, showModalCytoscape: false })
  }

  render() {
    const cytoscape = <CytoscapeComponent
      elements={source}
      cy={(cy) => { this.cy = cy }}
      style={{ width: '100%', height: '100%' }}
      stylesheet={
        [{
          selector: 'node',
          css: {
            'height': 10,
            'width': 10,
            'background-color': '#FFFFFF',
            'border-color': '#4283f1',
            'border-width': 1,
            'border-opacity': 0.5,
            'background-image': 'data(image)',
            'background-width': '60%',
            'background-height': '60%',
            'label': 'data(label)',
            'font-size': 6,
            'color': 'gray',
          }
        },
        {
          selector: 'edge',
          css: {
            'line-color': 'data(color)',
            'width': 1,
          }
        },
        {
          selector: 'node:selected',
          css: {
            'height': 14,
            'width': 14,
            'background-color': '#FFFFFF',
            'border-color': '#4283f1',
            'border-width': 1,
            'border-opacity': 0.5,
            'background-image': 'https://demo.explicatos.com/img/user.png',
            'background-width': '60%',
            'background-height': '60%',
            'label': 'data(label)',
            'font-size': 11,
          }
        }]}
      layout={{
        name: 'euler',
        randomize: true,
        animate: false,
      }} />;
    const networkContent = this.state.showModalCytoscape ? cytoscape : '';

    const { activeTab } = this.state;
    const content = (activeTab == TAB.NETWORK)?networkContent:<div>ProfilesConetent</div>

    return (
      <div>
        <CytoscapeComponent
          elements={source}
          style={{ width: '100%', height: '300px' }}
          stylesheet={
            [{
              selector: 'node',
              css: {
                'height': 10,
                'width': 10,
                'background-color': '#FFFFFF',
                'border-color': '#4283f1',
                'border-width': 1,
                'border-opacity': 0.5,
                'background-image': 'data(image)',
                'background-width': '60%',
                'background-height': '60%',
                'label': 'data(label)',
                'font-size': 6,
                'color': 'gray',
              }
            },
            {
              selector: 'edge',
              css: {
                'line-color': 'data(color)',
                'width': 1,
              }
            },
            {
              selector: 'node:selected',
              css: {
                'height': 14,
                'width': 14,
                'background-color': '#FFFFFF',
                'border-color': '#4283f1',
                'border-width': 1,
                'border-opacity': 0.5,
                'background-image': 'https://demo.explicatos.com/img/user.png',
                'background-width': '60%',
                'background-height': '60%',
                'label': 'data(label)',
                'font-size': 11,
              }
            }]}
          layout={{
            name: 'euler',
            randomize: true,
            animate: false,
          }} />
        <div className="text-right pr-2 pb-1" style={{ cursor: 'pointer' }} onClick={(e) => this.openModal(e)}>
          <FontAwesomeIcon icon={faExpandArrowsAlt} />
        </div>

        <Modal animation centered
          show={this.state.showModal}
          onHide={(e) => this.closeModal(e)}
          onEntered={(e) => this.setState({ showModalCytoscape: true })}
          dialogClassName="connections-modal">
          <Modal.Header closeButton>
            <Modal.Title>Connections</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="d-flex" style={{ height: '100%'}}>
              <div style={{ width: '20%'}}>
                <div style={{ borderRadius: '3px', border: '1px solid #ccc', color: '#555'}}>
                  <div className="font-weight-bold" style={{ paddingLeft: '15%', fontSize: '16px', backgroundColor: '#ddd' }}>FILTERS</div>
                  <div>Here my Content</div>
                </div>
                <div className="mt-3" style={{ borderRadius: '3px', border: '1px solid #ccc', color: '#555'}}>
                  <div className="font-weight-bold" style={{ paddingLeft: '15%', fontSize: '16px', backgroundColor: '#ddd' }}>DETAILS</div>
                  <div>Here my Content</div>
                </div>
              </div>
              <div className="ml-3 d-flex h-100 w-100" style={{ flexDirection: 'column'}}>
              <div  style={{ width: '100%'}} >
                <Nav variant="tabs" style={{ width: '100%'}}>
                  <Nav.Item>
                    <Nav.Link href="#" active={activeTab == TAB.NETWORK} 
                      onClick={(e) => this.setState({ activeTab: TAB.NETWORK })}>Network</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link href="#" active={activeTab == TAB.PROFILES} 
                      onClick={(e) => this.setState({ activeTab: TAB.PROFILES })}>Profiles</Nav.Link>
                  </Nav.Item>
                </Nav>
              </div>

              <div className="h-100" style={{ borderRadius: '0 3px 3px 3px', border: '1px solid #dee2e6 ', borderTop: 0}}>
                  {content}
                </div>
              </div>
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


export default withRouter(PanelConnections);
