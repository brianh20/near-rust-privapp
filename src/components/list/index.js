
import './style.css';
import React from 'react';
import Row from '../row';

const SecretList = ({ data, view, buy }) => {
  return (
    <div id="list">
      {data && data.map && data.map((secret, dix) => {
        return (<Row item={secret} key={`secret-${dix}`} dix={dix} view={view} buy={buy} />)
      })}
    </div >
  );
}

export default SecretList;