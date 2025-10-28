import React from 'react';

function DistrictCard({ district, onClick }) {
  const formatNumber = (num) => {
    if (num >= 10000000) return `${(num / 10000000).toFixed(1)} Cr`;
    if (num >= 100000) return `${(num / 100000).toFixed(1)} L`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)} K`;
    return num.toString();
  };

  const getPerformanceColor = (days) => {
    if (days >= 60) return '#4CAF50';
    if (days >= 40) return '#FF9800';
    return '#F44336';
  };

  return (
    <div className="district-card" onClick={onClick}>
      <div className="district-header">
        <h3>{district.districtName}</h3>
        <p className="district-hindi">{district.districtNameHindi}</p>
      </div>
      
      <div className="district-stats">
        <div className="stat-item">
          <span className="stat-icon">👷</span>
          <div>
            <p className="stat-value">{formatNumber(district.personDaysGenerated)}</p>
            <p className="stat-label">कार्य दिवस | Work Days</p>
          </div>
        </div>
        
        <div className="stat-item">
          <span className="stat-icon">💰</span>
          <div>
            <p className="stat-value">₹{formatNumber(district.totalExpenditure)}</p>
            <p className="stat-label">खर्च | Expenditure</p>
          </div>
        </div>
        
        <div className="stat-item">
          <span className="stat-icon">📊</span>
          <div>
            <p 
              className="stat-value" 
              style={{ color: getPerformanceColor(district.averageDaysPerHousehold) }}
            >
              {district.averageDaysPerHousehold} दिन
            </p>
            <p className="stat-label">औसत दिन | Avg Days</p>
          </div>
        </div>
      </div>
      
      <div className="card-footer">
        <span className="view-details">विवरण देखें | View Details →</span>
      </div>
    </div>
  );
}

export default DistrictCard;