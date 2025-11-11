// import React, { useState, useEffect } from 'react';
// import { getDistrictDetails } from '../services/api';

// function DistrictDetail({ districtCode, onBack, speak }) {
//   const [district, setDistrict] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchDistrictDetails();
//   }, [districtCode]);

//   const fetchDistrictDetails = async () => {
//     try {
//       setLoading(true);
//       const response = await getDistrictDetails(districtCode);
//       setDistrict(response.data);
//       setError(null);
//     } catch (err) {
//       setError('जिला विवरण लोड नहीं हो सका | Unable to load district details');
//       console.error('Error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatNumber = (num) => {
//     return new Intl.NumberFormat('en-IN').format(num);
//   };

//   const formatCurrency = (num) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       maximumFractionDigits: 0
//     }).format(num);
//   };

//   const getPerformanceLevel = (days) => {
//     if (days >= 60) return { text: 'उत्कृष्ट | Excellent', color: '#4CAF50', emoji: '🌟' };
//     if (days >= 40) return { text: 'अच्छा | Good', color: '#FF9800', emoji: '👍' };
//     return { text: 'सुधार आवश्यक | Needs Improvement', color: '#F44336', emoji: '⚠️' };
//   };

//   const handleSpeak = () => {
//     if (district) {
//       const text = `${district.districtNameHindi} जिले में कुल ${district.personDaysGenerated} कार्य दिवस उत्पन्न किए गए हैं। औसत ${district.averageDaysPerHousehold} दिन प्रति परिवार। कुल खर्च ${district.totalExpenditure} रुपये।`;
//       speak(text);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="loading">
//         <div className="spinner"></div>
//         <p>जिला विवरण लोड हो रहा है | Loading district details...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="error-message">
//         <span className="error-icon">⚠️</span>
//         <p>{error}</p>
//         <button onClick={fetchDistrictDetails} className="retry-button">
//           फिर से कोशिश करें | Retry
//         </button>
//       </div>
//     );
//   }

//   if (!district) return null;

//   const performance = getPerformanceLevel(district.averageDaysPerHousehold);

//   return (
//     <div className="district-detail">
//       <div className="detail-header">
//         <div className="detail-title">
//           <h1>{district.districtName}</h1>
//           <h2 className="detail-hindi">{district.districtNameHindi}</h2>
//         </div>
//         <button onClick={handleSpeak} className="speak-button" title="सुनें | Listen">
//           🔊 सुनें
//         </button>
//       </div>

//       <div className="performance-badge" style={{ backgroundColor: performance.color }}>
//         <span className="performance-emoji">{performance.emoji}</span>
//         <span>{performance.text}</span>
//       </div>

//       <div className="detail-grid">
//         <div className="detail-section">
//           <h3>👷 रोजगार डेटा | Employment Data</h3>
//           <div className="detail-items">
//             <div className="detail-item">
//               <span className="detail-label">कुल जॉब कार्ड | Total Job Cards</span>
//               <span className="detail-value">{formatNumber(district.totalJobCards)}</span>
//             </div>
//             <div className="detail-item">
//               <span className="detail-label">सक्रिय जॉब कार्ड | Active Job Cards</span>
//               <span className="detail-value">{formatNumber(district.activeJobCards)}</span>
//             </div>
//             <div className="detail-item">
//               <span className="detail-label">कुल श्रमिक | Total Workers</span>
//               <span className="detail-value">{formatNumber(district.totalWorkers)}</span>
//             </div>
//             <div className="detail-item">
//               <span className="detail-label">काम मिले श्रमिक | Workers Provided Work</span>
//               <span className="detail-value highlight">{formatNumber(district.workersProvided)}</span>
//             </div>
//           </div>
//         </div>

//         <div className="detail-section">
//           <h3>📊 कार्य प्रदर्शन | Work Performance</h3>
//           <div className="detail-items">
//             <div className="detail-item">
//               <span className="detail-label">कुल कार्य दिवस | Total Person Days</span>
//               <span className="detail-value">{formatNumber(district.personDaysGenerated)}</span>
//             </div>
//             <div className="detail-item">
//               <span className="detail-label">औसत दिन/परिवार | Avg Days/Household</span>
//               <span className="detail-value highlight" style={{ color: performance.color }}>
//                 {district.averageDaysPerHousehold} दिन
//               </span>
//             </div>
//             <div className="detail-item">
//               <span className="detail-label">पूर्ण कार्य | Completed Works</span>
//               <span className="detail-value">{formatNumber(district.completedWorks)}</span>
//             </div>
//             <div className="detail-item">
//               <span className="detail-label">चालू कार्य | Ongoing Works</span>
//               <span className="detail-value">{formatNumber(district.ongoingWorks)}</span>
//             </div>
//           </div>
//         </div>

//         <div className="detail-section">
//           <h3>💰 वित्तीय डेटा | Financial Data</h3>
//           <div className="detail-items">
//             <div className="detail-item">
//               <span className="detail-label">कुल खर्च | Total Expenditure</span>
//               <span className="detail-value">{formatCurrency(district.totalExpenditure)}</span>
//             </div>
//             <div className="detail-item">
//               <span className="detail-label">मजदूरी भुगतान | Wage Payment</span>
//               <span className="detail-value">{formatCurrency(district.wagePayment)}</span>
//             </div>
//             <div className="detail-item">
//               <span className="detail-label">सामग्री भुगतान | Material Payment</span>
//               <span className="detail-value">{formatCurrency(district.materialPayment)}</span>
//             </div>
//             <div className="detail-item">
//               <span className="detail-label">वित्तीय वर्ष | Financial Year</span>
//               <span className="detail-value">{district.financialYear}</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="detail-footer">
//         <p className="last-updated">
//           अंतिम अपडेट | Last Updated: {new Date(district.lastUpdated).toLocaleString('hi-IN')}
//         </p>
//         <p className="data-source">
//           डेटा स्रोत | Data Source: {district.dataSource === 'api' ? 'Live API' : 'Cached Database'}
//         </p>
//       </div>
//     </div>
//   );
// }

// export default DistrictDetail;
import React, { useState, useEffect, useCallback } from 'react';
import { getDistrictDetails } from '../services/api';

function DistrictDetail({ districtCode, onBack, speak }) {
  const [district, setDistrict] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  const fetchDistrictDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getDistrictDetails(districtCode);
      setDistrict(response.data);
      setError(null);
    } catch (err) {
      setError('जिला विवरण लोड नहीं हो सका | Unable to load district details');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  }, [districtCode]);

  useEffect(() => {
    fetchDistrictDetails();
  }, [fetchDistrictDetails]);

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  const formatCurrency = (num) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(num);
  };

  const getPerformanceLevel = (days) => {
    if (days >= 60) return { text: 'उत्कृष्ट | Excellent', color: '#4CAF50', emoji: '🌟' };
    if (days >= 40) return { text: 'अच्छा | Good', color: '#FF9800', emoji: '👍' };
    return { text: 'सुधार आवश्यक | Needs Improvement', color: '#F44336', emoji: '⚠️' };
  };

  const handleSpeak = () => {
    if (district && isSoundEnabled) {
      const text = `${district.districtNameHindi} जिले में कुल ${district.personDaysGenerated} कार्य दिवस उत्पन्न किए गए हैं। औसत ${district.averageDaysPerHousehold} दिन प्रति परिवार। कुल खर्च ${district.totalExpenditure} रुपये।`;
      speak(text);
    }
  };

  const toggleSound = () => {
    setIsSoundEnabled(!isSoundEnabled);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>जिला विवरण लोड हो रहा है | Loading district details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <span className="error-icon">⚠️</span>
        <p>{error}</p>
        <button onClick={fetchDistrictDetails} className="retry-button">
          फिर से कोशिश करें | Retry
        </button>
      </div>
    );
  }

  if (!district) return null;

  const performance = getPerformanceLevel(district.averageDaysPerHousehold);

  return (
    <div className="district-detail">
      <div className="detail-header">
        <div className="detail-title">
          <h1>{district.districtName}</h1>
          <h2 className="detail-hindi">{district.districtNameHindi}</h2>
        </div>
        <div className="header-buttons">
          <button 
            onClick={toggleSound} 
            className={`sound-toggle-button ${!isSoundEnabled ? 'muted' : ''}`}
            title={isSoundEnabled ? 'आवाज़ बंद करें | Mute' : 'आवाज़ चालू करें | Unmute'}
          >
            {isSoundEnabled ? '🔊' : '🔇'}
          </button>
          <button 
            onClick={handleSpeak} 
            className="speak-button" 
            title="सुनें | Listen"
            disabled={!isSoundEnabled}
          >
            🔊 सुनें
          </button>
        </div>
      </div>

      <div className="performance-badge" style={{ backgroundColor: performance.color }}>
        <span className="performance-emoji">{performance.emoji}</span>
        <span>{performance.text}</span>
      </div>

      <div className="detail-grid">
        <div className="detail-section">
          <h3>👷 रोजगार डेटा | Employment Data</h3>
          <div className="detail-items">
            <div className="detail-item">
              <span className="detail-label">कुल जॉब कार्ड | Total Job Cards</span>
              <span className="detail-value">{formatNumber(district.totalJobCards)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">सक्रिय जॉब कार्ड | Active Job Cards</span>
              <span className="detail-value">{formatNumber(district.activeJobCards)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">कुल श्रमिक | Total Workers</span>
              <span className="detail-value">{formatNumber(district.totalWorkers)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">काम मिले श्रमिक | Workers Provided Work</span>
              <span className="detail-value highlight">{formatNumber(district.workersProvided)}</span>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h3>📊 कार्य प्रदर्शन | Work Performance</h3>
          <div className="detail-items">
            <div className="detail-item">
              <span className="detail-label">कुल कार्य दिवस | Total Person Days</span>
              <span className="detail-value">{formatNumber(district.personDaysGenerated)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">औसत दिन/परिवार | Avg Days/Household</span>
              <span className="detail-value highlight" style={{ color: performance.color }}>
                {district.averageDaysPerHousehold} दिन
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">पूर्ण कार्य | Completed Works</span>
              <span className="detail-value">{formatNumber(district.completedWorks)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">चालू कार्य | Ongoing Works</span>
              <span className="detail-value">{formatNumber(district.ongoingWorks)}</span>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h3>💰 वित्तीय डेटा | Financial Data</h3>
          <div className="detail-items">
            <div className="detail-item">
              <span className="detail-label">कुल खर्च | Total Expenditure</span>
              <span className="detail-value">{formatCurrency(district.totalExpenditure)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">मजदूरी भुगतान | Wage Payment</span>
              <span className="detail-value">{formatCurrency(district.wagePayment)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">सामग्री भुगतान | Material Payment</span>
              <span className="detail-value">{formatCurrency(district.materialPayment)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">वित्तीय वर्ष | Financial Year</span>
              <span className="detail-value">{district.financialYear}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="detail-footer">
        <p className="last-updated">
          अंतिम अपडेट | Last Updated: {new Date(district.lastUpdated).toLocaleString('hi-IN')}
        </p>
        <p className="data-source">
          डेटा स्रोत | Data Source: {district.dataSource === 'api' ? 'Live API' : 'Cached Database'}
        </p>
      </div>
    </div>
  );
}

export default DistrictDetail;