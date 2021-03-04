import React from 'react';

// React Router
import { withRouter } from 'react-router-dom'

class InvestigatorSnaphot extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
    }
  }


  render() {
    return (
      <div style={{ border: '1px solid #ccc', padding: '1em 0 1em 0' }}>
      <div className="text-right" style={{ padding: '0 0 1em 0' }}>Last Updated: 25/02/2020</div>

      <div className="d-flex justify-content-between"
        style={{ borderBottom: '1px solid #ccc', padding: '0.5em 1em 0.5em 1em' }}>
        <div className="font-weight-bold">Profile Snapshot</div>
        <div><a href='#'>Go To CV</a></div>
      </div>


      <div className="d-flex justify-content-between"
        style={{ borderBottom: '1px solid #ccc', padding: '0.5em 1em 0.5em 1em' }}>
        <div className="font-weight-bold">Specialties</div>
        <div>Neurology</div>
      </div>

      <div className="d-flex justify-content-between"
        style={{ borderBottom: '1px solid #ccc', padding: '0.5em 1em 0.5em 1em' }}>
        <div className="font-weight-bold">Focus Area</div>
        <div>-</div>
        <div>-</div>
      </div>

      <div className="w-100 d-flex justify-content-between"
        style={{ borderBottom: '1px solid #ccc', padding: '0.5em 1em 0.5em 1em' }}>
        <div className="font-weight-bold" style={{ width: '33%' }}>Publications</div>
        <div className='text-center' style={{ width: '33%' }}>
          <div>First Author</div>
          <div>0</div>
        </div>
        <div className='text-right' style={{ width: '33%' }}>
          <div>Total</div>
          <div>0</div>
        </div>
      </div>

      <div className="d-flex justify-content-between"
        style={{ borderBottom: '1px solid #ccc', padding: '0.5em 1em 0.5em 1em' }}>
        <div className="font-weight-bold" style={{ width: '33%' }}>Coauthors</div>
        <div className='text-center' style={{ width: '33%' }}>
          <div>Same PA</div>
          <div>0</div>
        </div>
        <div className='text-right' style={{ width: '33%' }}>
          <div>Total</div>
          <div>0</div>
        </div>
      </div>

      <div className="d-flex justify-content-between"
        style={{ borderBottom: '1px solid #ccc', padding: '0.5em 1em 0.5em 1em' }}>
        <div className="font-weight-bold" style={{ width: '33%' }}>Events</div>
        <div className='text-center' style={{ width: '33%' }}>
          <div>Chair Person</div>
          <div>0</div>
        </div>
        <div className='text-right' style={{ width: '33%' }}>
          <div>Total</div>
          <div>0</div>
        </div>
      </div>

      <div className="d-flex justify-content-between"
        style={{ borderBottom: '1px solid #ccc', padding: '0.5em 1em 0.5em 1em' }}>
        <div className="font-weight-bold" style={{ width: '33%' }}>Clinical Trials</div>
        <div className='text-center' style={{ width: '33%' }}>
          <div>Recruiting</div>
          <div>0</div>
        </div>
        <div className='text-right' style={{ width: '33%' }}>
          <div>Total</div>
          <div>0</div>
        </div>
      </div>
    </div>);
  }
}


export default withRouter(InvestigatorSnaphot);
