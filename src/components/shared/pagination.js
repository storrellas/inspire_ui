import React from 'react';
// Bootstrap
import {  Dropdown, Pagination } from 'react-bootstrap';

// React Router
import { withRouter } from 'react-router-dom'



const InspirePagination = (props) => {
  // Generate startPage/endPage
  let startPage = props.currentPage - 1;
  let endPage = props.currentPage + 3;
  if (props.currentPage - 1 < 1) {
    startPage = 1; endPage = 5;
  }
  if (props.currentPage + 3 > props.totalPage) {
    startPage = props.totalPage - 4; endPage = props.totalPage;
  }
  let items = []
  for (let page = startPage; page <= endPage; page++) {
    items.push(
      <Pagination.Item key={page}      
        active={page === props.currentPage}
        onClick={(e) => props.onClick(page)}>
        {page}
      </Pagination.Item>,
    );
  }

  return (
    <div className="w-100 text-right">
      <div style={{ display: 'inline-block', padding: '1em' }}>
        <Pagination bsPrefix="inspire-pagination">
          <Pagination.First disabled={props.currentPage === 1} 
                  onClick={(e) => props.onClick(props.currentPage-1)} />
          {items}
          <Pagination.Last disabled={props.currentPage === props.totalPage} 
                  onClick={(e) => props.onClick(props.currentPage+1)} />
        </Pagination>
      </div>
    </div>
  )
}


export default withRouter(InspirePagination);
