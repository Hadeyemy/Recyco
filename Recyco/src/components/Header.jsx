import React, { useState } from 'react';
import logo from '../assets/Recyco_Logo.png';

const Header = () => {
  const [notifications, setNotifications] = useState(0);

  const handleNotificationClick = () => {
    setNotifications(notifications + 1);
    alert(`You have ${notifications + 1} notifications`);
  };

  return (
    <header id="header">
      <div className="header-left">
        <img src={logo} alt="Recyco Logo" className="logo" />
        <h1>Recyco</h1>
      </div>
      <div>
        <button className="notification-icon" onClick={handleNotificationClick}>
          🔔 {notifications}
        </button>
        <button className="menu-btn" onClick={() => alert('Menu clicked')}>☰</button>
      </div>
    </header>
  );
};

export default Header;

// This is the Header component for the Recyco application.
// It includes the logo, title, and buttons for notifications and menu.