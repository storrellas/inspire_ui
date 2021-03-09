import React, { useState } from 'react';
// Bootstrap
import { Col, Row, Dropdown, Pagination } from 'react-bootstrap';

// React Router
import { withRouter } from 'react-router-dom'


// Assets

// Project imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

export const SEARCH_HEADER = {
  TEXT: 'text',
  NUMBER: 'number'
}

const SearchHeader = (props) => {

  const [active, setActive] = useState(false);
  
  return (
    <div>
      <div className="d-flex align-items-center pl-2 border-test" style={{ position: 'relative', cursor: 'pointer' }}>

        <input type={props.type} className="inspire-table-search inspire-table-search-number" 
                onChange={(e) => props.onChange(e.target.value)} 
                onMouseEnter={(e) => setActive(true)}
                onMouseLeave={(e) => setActive(false)}></input>
        <FontAwesomeIcon icon={faSearch} style={{ fontSize: '1em', color: 'grey' }} />
      </div>
      <div className={active?"inspire-table-search-border active":"inspire-table-search-border"}></div>
    </div>
  );
}


export default withRouter(SearchHeader);
