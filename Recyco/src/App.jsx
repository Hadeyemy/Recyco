import React from 'react';
import Header from './components/Header.jsx';
import Profile from './components/Profile.jsx';
import Metrics from './components/Metrics.jsx';
import BinStation from './components/BinStation.jsx';
import Materials from './components/Materials.jsx';
import BottomNav from './components/BottomNav.jsx';
import './App.css';

function App() {
  return (
    <>
      <Header />
      <Profile />
      <Metrics />
      <BinStation />
      <Materials />
      <BottomNav />
    </>
  );
}

export default App;
// This is the main App component for the Recyco application.
// It includes the header, profile, metrics, bin station, materials, and bottom navigation components.