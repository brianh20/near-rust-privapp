
import './style.css';
import React from 'react';

const Row = ({ item, view, buy }) => {
  return (
    <div className="itemContainer">
      <div className="item">
        <div className="id">
          {item.id}
        </div>
        <div className="title">
          <span>{item.title}</span>{item.owned && <span className="important">OWN</span>}
        </div>
        {!item.visible && <div className="price">
          <b>{item.price}</b> N
        </div>}
        <div className={`action ${item.visible ? 'view' : 'buy'}`} onClick={() => item.visible ? view(item.id) : buy(item.id, item.price)}>
          {item.visible ? "VIEW" : "BUY"}
        </div>
      </div>
      {item.content && <div className="itemContent">{item.content}</div>}
    </div >

  );
}
export default Row;