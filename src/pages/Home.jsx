import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <h1>HULK</h1>
      <div className="video-container">
        <iframe
          className="responsive-iframe"
          src="https://www.youtube.com/embed/aldb68CXsAM"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Player of the Week Video"
        ></iframe>
      </div>
    </div>
  );
};

export default Home;
