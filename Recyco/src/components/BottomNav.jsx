import React from 'react';

const BottomNav = () => (
  <footer id="bottom-nav">
    {['Home', 'Pay', 'Dashboard', 'Scheduler', 'Portal', 'Review', 'Help'].map((item) => (
      <a href="#" key={item}><div><p>{item}</p></div></a>
    ))}
  </footer>
);

export default BottomNav;

// This is the BottomNav component for the Recyco application.
// It renders a footer with navigation links for various sections of the app.