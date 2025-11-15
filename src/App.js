import React, { useState, useEffect } from 'react';
import { getDistricts, startKeepAlive, pingBackend } from './services/api';
import DistrictDetail from './components/DistrictDetail';
import './App.css';

function App() {
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [coldStart, setColdStart] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  // Start keep-alive on mount
  useEffect(() => {
    console.log('🚀 App mounted - starting keep-alive');
    const stopKeepAlive = startKeepAlive();
    
    return () => {
      console.log('👋 App unmounting');
      stopKeepAlive();
    };
  }, []);

  // Fetch districts
  useEffect(() => {
    fetchDistricts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDistricts = async () => {
    setLoading(true);
    setError(null);
    
    // Show cold start message after 10 seconds
    const coldStartTimer = setTimeout(() => {
      setColdStart(true);
    }, 10000);
    
    try {
      console.log('📊 Fetching districts...');
      
      // Wake up backend first
      await pingBackend();
      
      // Small delay to let backend warm up
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const response = await getDistricts();
      
      if (response.success && response.data) {
        setDistricts(response.data);
        console.log(`✅ Loaded ${response.data.length} districts`);
        setRetryCount(0);
      } else {
        throw new Error('Invalid response format');
      }
      
    } catch (err) {
      console.error('❌ Error fetching districts:', err);
      
      const errorMsg = err.userMessage || err.message || 'Failed to load data';
      setError(errorMsg);
      
      // Auto-retry only once if timeout/network error
      if (retryCount < 1 && (err.code === 'ECONNABORTED' || !err.response)) {
        console.log(`🔄 Will auto-retry in 15 seconds...`);
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          fetchDistricts();
        }, 15000);
      }
      
    } finally {
      clearTimeout(coldStartTimer);
      setLoading(false);
      setColdStart(false);
    }
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  const filteredDistricts = districts.filter(district =>
    district.districtName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    district.districtNameHindi.includes(searchTerm)
  );

  if (selectedDistrict) {
    return (
      <div className="App">
        <div className="header">
          <div className="header-content">
            <button 
              onClick={() => setSelectedDistrict(null)} 
              className="back-button"
            >
              ← वापस जाएं | Back to List
            </button>
          </div>
        </div>
        <DistrictDetail 
          districtCode={selectedDistrict} 
          onBack={() => setSelectedDistrict(null)} 
        />
      </div>
    );
  }

  return (
    <div className="App">
      <div className="header">
        <div className="header-content">
          <div className="header-logo">
            <span className="logo-icon">🏛️</span>
            <div>
              <h2>MGNREGA Tracker</h2>
              <p>मनरेगा ट्रैकर</p>
            </div>
          </div>
          <div className="state-badge">
            Uttar Pradesh | उत्तर प्रदेश
          </div>
        </div>
      </div>

      <div className="hero-section">
        <h1 className="hero-title">MGNREGA District Tracker</h1>
        <p className="hero-subtitle">उत्तर प्रदेश जिला ट्रैकर</p>
        <p className="hero-description">
          Track employment statistics across all districts
          <br />
          <span>सभी जिलों में रोजगार के आंकड़े देखें</span>
        </p>
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>
            {coldStart 
              ? '⏳ Server is waking up...\nThis can take 30-60 seconds on first load.\n\n💡 Tip: The app keeps server awake for faster subsequent loads!'
              : '📊 Loading districts data...'}
          </p>
        </div>
      ) : error ? (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <p>{error}</p>
          
          <div style={{ 
            background: '#f5f5f5', 
            padding: '20px', 
            borderRadius: '10px', 
            margin: '20px 0',
            textAlign: 'left'
          }}>
            <h3 style={{ marginBottom: '10px', color: '#333' }}>Try these solutions:</h3>
            <ul style={{ paddingLeft: '20px', color: '#555' }}>
              <li>✅ Wait 60 seconds for server to fully wake up</li>
              <li>🔄 Click the retry button below</li>
              <li>🌐 Check your internet connection</li>
              <li>🔃 Refresh the page completely</li>
            </ul>
          </div>
          
          <button 
            onClick={() => {
              setRetryCount(0);
              fetchDistricts();
            }} 
            className="retry-button"
          >
            🔄 फिर से कोशिश करें | Retry Now
          </button>
          
          {retryCount > 0 && (
            <p style={{ marginTop: '15px', color: '#666', fontSize: '14px' }}>
              Automatic retry in progress...
            </p>
          )}
        </div>
      ) : (
        <>
          <div className="search-container">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search district / जिला खोजें..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          {filteredDistricts.length === 0 ? (
            <div className="no-results">
              <span className="no-results-icon">🔍</span>
              <p>No districts found | कोई जिला नहीं मिला</p>
            </div>
          ) : (
            <div className="districts-grid">
              {filteredDistricts.map((district) => (
                <div
                  key={district.districtCode}
                  className="district-card"
                  onClick={() => setSelectedDistrict(district.districtCode)}
                >
                  <div className="district-header">
                    <h3>{district.districtName}</h3>
                    <p className="district-hindi">{district.districtNameHindi}</p>
                  </div>
                  
                  <div className="district-stats">
                    <div className="stat-item">
                      <span className="stat-icon">👷</span>
                      <div>
                        <div className="stat-value">
                          {formatNumber(district.personDaysGenerated)}
                        </div>
                        <div className="stat-label">Person Days | कार्य दिवस</div>
                      </div>
                    </div>
                    
                    <div className="stat-item">
                      <span className="stat-icon">📊</span>
                      <div>
                        <div className="stat-value">
                          {district.averageDaysPerHousehold} days
                        </div>
                        <div className="stat-label">Avg Days/Household | औसत</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="card-footer">
                    <p className="view-details">
                      👉 Click to view details | विवरण देखें
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <div className="footer">
        <p>📊 Data from MGNREGA Public Portal</p>
        <p>Last Updated: {new Date().toLocaleDateString('en-IN')}</p>
        <p style={{ fontSize: '0.85rem', color: '#999', marginTop: '10px' }}>
          Showing {districts.length} districts from Uttar Pradesh
        </p>
      </div>
    </div>
  );
}

export default App;