import React from 'react';

const BinStation = () => (
  <section id="bin-station">
    <div className="station">
      <h3>Nearby Bin Station</h3>
      <a href="#">View all</a>
    </div>
    <div className="map-placeholder">
      <p>Map</p>
      <span>4 km</span>
      <span>10 km</span>
    </div>
  </section>
);

export default BinStation;

// This is the BinStation component for the Recyco application.
// It displays a nearby bin station with a link to view all stations and a placeholder for the map.