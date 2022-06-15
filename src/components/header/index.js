
import './style.css';
import React from 'react';

const Header = ({ signIn, signOut, currentUser }) => {
  return (
    <div id="user">
      {currentUser ? <div>
        <span>{currentUser}</span>
        <button onClick={signOut}>Sign out</button></div> : <button onClick={signIn}>Log in</button>}
    </div>
  );
}

export default Header;
