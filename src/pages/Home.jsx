import React, { useEffect, useState } from 'react';
import Standings from './Standings.jsx'
import './Home.css';

const Home = () => {

  return (
    <div className="home-container">
      <div className="section1">
        <div>
        <Standings/>
      </div>
      </div>
      <div className='section2'>
        <h1>Sponsors</h1>
        <p></p>
      </div>
    </div>
  );
};

export default Home;
