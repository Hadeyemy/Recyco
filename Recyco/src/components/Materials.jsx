import React, { useState } from 'react';

function Materials() {
  const [materials, setMaterials] = useState(['Bottle', 'Glass', 'Plastic']);

  return (
    <section id="materials-section">
      <div className="material-1">
        <h3>Materials</h3>
        <a href="#">View all</a>
      </div>
      <div className="materials">
        {materials.map((material, index) => (
          <div key={index} className="material">{material}</div>
        ))}
      </div>
    </section>
  );
}

export default Materials;

// This is the Materials component for the Recyco application.
// It displays a list of materials based on the user's role (Waste Generator, Waste Collector, Waste Recycler).