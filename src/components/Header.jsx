import React from 'react';

function Header({ onBack }) {
  return (
    <header className="header">
      <div className="header-content">
        {onBack && (
          <button onClick={onBack} className="back-button">
            ← वापस जाएं | Back
          </button>
        )}
        <div className="header-logo">
          <span className="logo-icon">🏛️</span>
          <div>
            <h2>मनरेगा ट्रैकर</h2>
            <p>MGNREGA Tracker</p>
          </div>
        </div>
        <div className="header-state">
          <span className="state-badge">उत्तर प्रदेश | UP</span>
        </div>
      </div>
    </header>
  );
}

export default Header;