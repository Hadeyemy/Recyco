import React, { useState } from 'react';

const Profile = () => {
  const [editing, setEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [name, setName] = useState('Profile Name');
  const [address, setAddress] = useState('Address');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
        setProfileImage(imageUrl);
    }
  };

    return (
    <section id="profile">
      <div className="profile-image">
        <img
          src={profileImage || '/default-profile.png'}
          alt="Profile"
        />
        <label htmlFor="imageUpload">Change</label>
        <input
          type="file"
          id="imageUpload"
          style={{ display: 'none' }}
          onChange={handleImageChange}
          accept="image/*"
        />
      </div>

      <div className="profile-info">
        {editing ? (
          <>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
            <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address" />
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