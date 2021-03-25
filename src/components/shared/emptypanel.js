import React from 'react';
// Bootstrap

// React Router
import { withRouter } from 'react-router-dom'

// Assets
import emptyPanel from '../../assets/emptypanel.svg';

const EmptyPanel = (props) => {

  return (
    <div className={props.show?"w-100 text-center":"d-none"}>
      <img className="w-25" src={emptyPanel} alt="logo"></img>
      <div className="mt-3">
        <b className="mt-3">Nothing in here!</b>
        <div className="mt-3">There is no data available in this section</div>
      </div>
    </div>
  )
}


export default withRouter(EmptyPanel);
