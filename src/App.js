// import React, { useState, useEffect } from 'react';
// import './App.css';
// import Header from './components/Header';
// import DistrictCard from './components/DistrictCard';
// import DistrictDetail from './components/DistrictDetail';
// import { getDistricts } from './services/api';

// function App() {
//   const [districts, setDistricts] = useState([]);
//   const [selectedDistrict, setSelectedDistrict] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     fetchDistricts();
//   }, []);

//   const fetchDistricts = async () => {
//     try {
//       setLoading(true);
//       const response = await getDistricts();
//       setDistricts(response.data || []);
//       setError(null);
//     } catch (err) {
//       setError('डेटा लोड करने में समस्या | Unable to load data');
//       console.error('Error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredDistricts = districts.filter(district =>
//     district.districtName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     district.districtNameHindi.includes(searchTerm)
//   );

//   const handleDistrictClick = (district) => {
//     setSelectedDistrict(district);
//   };

//   const handleBack = () => {
//     setSelectedDistrict(null);
//   };

//   const speak = (text) => {
//     if ('speechSynthesis' in window) {
//       const utterance = new SpeechSynthesisUtterance(text);
//       utterance.lang = 'hi-IN';
//       window.speechSynthesis.speak(utterance);
//     }
//   };

//   if (selectedDistrict) {
//     return (
//       <div className="App">
//         <Header onBack={handleBack} />
//         <DistrictDetail 
//           districtCode={selectedDistrict.districtCode} 
//           onBack={handleBack}
//           speak={speak}
//         />
//       </div>
//     );
//   }

//   return (
//     <div className="App">
//       <Header />
      
//       <div className="hero-section">
//         <h1 className="hero-title">
//           मनरेगा जिला प्रदर्शन
//           <br />
//           <span className="hero-subtitle">MGNREGA District Performance</span>
//         </h1>
//         <p className="hero-description">
//           उत्तर प्रदेश के सभी जिलों का मनरेगा डेटा देखें
//           <br />
//           <span>View MGNREGA data for all districts of Uttar Pradesh</span>
//         </p>
//       </div>

//       <div className="search-container">
//         <div className="search-box">
//           <span className="search-icon">🔍</span>
//           <input
//             type="text"
//             placeholder="जिला खोजें | Search district..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="search-input"
//           />
//         </div>
//       </div>

//       {loading && (
//         <div className="loading">
//           <div className="spinner"></div>
//           <p>डेटा लोड हो रहा है | Loading data...</p>
//         </div>
//       )}

//       {error && (
//         <div className="error-message">
//           <span className="error-icon">⚠️</span>
//           <p>{error}</p>
//           <button onClick={fetchDistricts} className="retry-button">
//             फिर से कोशिश करें | Retry
//           </button>
//         </div>
//       )}

//       {!loading && !error && (
//         <>
//           <div className="stats-summary">
//             <div className="stat-card">
//               <span className="stat-icon">🏘️</span>
//               <div>
//                 <h3>{filteredDistricts.length}</h3>
//                 <p>जिले | Districts</p>
//               </div>
//             </div>
//             <div className="stat-card">
//               <span className="stat-icon">👷</span>
//               <div>
//                 <h3>{(filteredDistricts.reduce((sum, d) => sum + d.personDaysGenerated, 0) / 1000000).toFixed(1)}M</h3>
//                 <p>कार्य दिवस | Work Days</p>
//               </div>
//             </div>
//           </div>

//           <div className="districts-grid">
//             {filteredDistricts.map(district => (
//               <DistrictCard
//                 key={district.districtCode}
//                 district={district}
//                 onClick={() => handleDistrictClick(district)}
//               />
//             ))}
//           </div>

//           {filteredDistricts.length === 0 && (
//             <div className="no-results">
//               <span className="no-results-icon">🔍</span>
//               <p>कोई जिला नहीं मिला | No districts found</p>
//             </div>
//           )}
//         </>
//       )}

//       <footer className="footer">
//         <p>डेटा स्रोत: मनरेगा ओपन एपीआई | Data Source: MGNREGA Open API</p>
//         <p>अंतिम अपडेट: {new Date().toLocaleDateString('hi-IN')} | Last Updated: {new Date().toLocaleDateString('en-IN')}</p>
//       </footer>
//     </div>
//   );
// }

// export default App;
import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import DistrictCard from './components/DistrictCard';
import DistrictDetail from './components/DistrictDetail';
import { getDistricts, startKeepAlive } from './services/api';

function App() {
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isWakingUp, setIsWakingUp] = useState(false);

  // Start keep-alive to prevent backend from sleeping
  useEffect(() => {
    const stopKeepAlive = startKeepAlive();
    return () => stopKeepAlive();
  }, []);

  useEffect(() => {
    fetchDistricts();
  }, []);

  const fetchDistricts = async () => {
    try {
      setLoading(true);
      setIsWakingUp(true);
      setError(null);
      
      const response = await getDistricts();
      setDistricts(response.data || []);
      setError(null);
    } catch (err) {
      // Better error messages based on error type
      if (err.code === 'ECONNABORTED') {
        setError('⏱️ सर्वर धीमा है, कृपया प्रतीक्षा करें | Server is waking up, please wait...');
      } else if (!err.response) {
        setError('🔌 सर्वर से कनेक्ट नहीं हो पा रहा | Unable to connect to server');
      } else {
        setError('डेटा लोड करने में समस्या | Unable to load data');
      }
      console.error('Error:', err);
    } finally {
      setLoading(false);
      setIsWakingUp(false);
    }
  };

  const filteredDistricts = districts.filter(district =>
    district.districtName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    district.districtNameHindi.includes(searchTerm)
  );

  const handleDistrictClick = (district) => {
    setSelectedDistrict(district);
  };

  const handleBack = () => {
    setSelectedDistrict(null);
  };

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  if (selectedDistrict) {
    return (
      <div className="App">
        <Header onBack={handleBack} />
        <DistrictDetail 
          districtCode={selectedDistrict.districtCode} 
          onBack={handleBack}
          speak={speak}
        />
      </div>
    );
  }

  return (
    <div className="App">
      <Header />
      
      <div className="hero-section">
        <h1 className="hero-title">
          मनरेगा जिला प्रदर्शन
          <br />
          <span className="hero-subtitle">MGNREGA District Performance</span>
        </h1>
        <p className="hero-description">
          उत्तर प्रदेश के सभी जिलों का मनरेगा डेटा देखें
          <br />
          <span>View MGNREGA data for all districts of Uttar Pradesh</span>
        </p>
      </div>

      <div className="search-container">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="जिला खोजें | Search district..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          {isWakingUp ? (
            <>
              <p>⏳ सर्वर जाग रहा है | Server is waking up...</p>
              <p className="loading-subtext">पहली बार 50-60 सेकंड लग सकते हैं | First load may take 50-60 seconds</p>
            </>
          ) : (
            <p>डेटा लोड हो रहा है | Loading data...</p>
          )}
        </div>
      )}

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <p>{error}</p>
          <button onClick={fetchDistricts} className="retry-button">
            फिर से कोशिश करें | Retry
          </button>
          <p className="error-subtext">
            💡 युक्ति: पहली बार लोड होने में समय लगता है
            <br />
            Tip: First load takes time due to server wake-up
          </p>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="stats-summary">
            <div className="stat-card">
              <span className="stat-icon">🏘️</span>
              <div>
                <h3>{filteredDistricts.length}</h3>
                <p>जिले | Districts</p>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-icon">👷</span>
              <div>
                <h3>{(filteredDistricts.reduce((sum, d) => sum + d.personDaysGenerated, 0) / 1000000).toFixed(1)}M</h3>
                <p>कार्य दिवस | Work Days</p>
              </div>
            </div>
          </div>

          <div className="districts-grid">
            {filteredDistricts.map(district => (
              <DistrictCard
                key={district.districtCode}
                district={district}
                onClick={() => handleDistrictClick(district)}
              />
            ))}
          </div>

          {filteredDistricts.length === 0 && (
            <div className="no-results">
              <span className="no-results-icon">🔍</span>
              <p>कोई जिला नहीं मिला | No districts found</p>
            </div>
          )}
        </>
      )}

      <footer className="footer">
        <p>डेटा स्रोत: मनरेगा ओपन एपीआई | Data Source: MGNREGA Open API</p>
        <p>अंतिम अपडेट: {new Date().toLocaleDateString('hi-IN')} | Last Updated: {new Date().toLocaleDateString('en-IN')}</p>
      </footer>
    </div>
  );
}

export default App;