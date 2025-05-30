import React, { useState } from 'react';

const Profile = () => {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('Profile Name');
  const [address, setAddress] = useState('Address');

  return (
    <section id="profile">
      <div className="profile-image"></div>
      <div className="profile-info">
        {editing ? (
          <>
            <input value={name} onChange={(e) => setName(e.target.value)} />
            <input value={address} onChange={(e) => setAddress(e.target.value)} />
            <button onClick={() => setEditing(false)}>Save</button>
          </>
        ) : (
          <>
            <h2>{name}</h2>
            <p>{address}</p>
            <button onClick={() => setEditing(true)}>Edit</button>
          </>
        )}
      </div>
    </section>
  );
};

export default Profile;

// This is the Profile component for the Recyco application.
// It displays the user's profile information based on their role (Waste Generator, Waste Collector, Waste Recycler).