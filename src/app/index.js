import './style.css';
import React, { useEffect, useState } from 'react';

import {
  signIn,
  signOut,
  getData,
  postSecret,
  getSecretContent,
  buySecretContent
} from '../chain';

import Loader from '../components/loader/loader';
import Header from '../components/header';
import NewSecret from '../components/new';
import SecretList from '../components/list';


const App = ({ nearConfig, walletConnection, currentUser }) => {
  const [showLoader, setShowLoader] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    refreshData()
  }, []);

  const refreshData = async () => {
    setShowLoader(true)
    setData(await getData(nearConfig, currentUser))
    setShowLoader(false)
  }

  const walletSignIn = () => {
    signIn(nearConfig, walletConnection);
  }

  const walletSignOut = () => {
    signOut(walletConnection);
  }

  const postNewSecret = async ({ title, content, price }) => {
    setShowLoader(true)
    try {
      await postSecret(nearConfig, walletConnection, { title, content, price });
    } catch (e) {
      alert(e);
    } finally {
      setShowLoader(false)
      refreshData();
    }
  }

  const viewSecret = async (id) => {
    const content = await getSecretContent(nearConfig, currentUser, id);
    setData([...data].map(el => el.id === id ? { ...el, content } : el));
  }

  const buySecret = async (id, price) => {
    if (currentUser) {
      setShowLoader(true)
      await buySecretContent(nearConfig, walletConnection, id, price);
      await refreshData();
      setShowLoader(false)
    } else {
      walletSignIn();
    }
  }

  if (showLoader) {
    return (<Loader />)
  }

  return (
    <div id="page">
      <Header signIn={walletSignIn} signOut={walletSignOut} currentUser={currentUser} />
      <h1>NEAR Secret Safe</h1>
      {currentUser && <NewSecret postSecret={postNewSecret} />}
      <SecretList data={data} view={viewSecret} buy={buySecret} />
    </div >
  );
}

export default App;
