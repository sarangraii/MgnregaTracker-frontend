// import React, { useState, useEffect, useCallback } from 'react';
// import { getDistrictDetails } from '../services/api';

// function DistrictDetail({ districtCode, onBack, speak }) {
//   const [district, setDistrict] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isSoundEnabled, setIsSoundEnabled] = useState(true);

//   const fetchDistrictDetails = useCallback(async () => {
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
//   }, [districtCode]);

//   useEffect(() => {
//     fetchDistrictDetails();
//   }, [fetchDistrictDetails]);

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
//     if (district && isSoundEnabled) {
//       const text = `${district.districtNameHindi} जिले में कुल ${district.personDaysGenerated} कार्य दिवस उत्पन्न किए गए हैं। औसत ${district.averageDaysPerHousehold} दिन प्रति परिवार। कुल खर्च ${district.totalExpenditure} रुपये।`;
//       speak(text);
//     }
//   };

//   const toggleSound = () => {
//     setIsSoundEnabled(!isSoundEnabled);
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
//         <div className="header-buttons">
//           <button 
//             onClick={toggleSound} 
//             className={`sound-toggle-button ${!isSoundEnabled ? 'muted' : ''}`}
//             title={isSoundEnabled ? 'आवाज़ बंद करें | Mute' : 'आवाज़ चालू करें | Unmute'}
//           >
//             {isSoundEnabled ? '🔊' : '🔇'}
//           </button>
//           <button 
//             onClick={handleSpeak} 
//             className="speak-button" 
//             title="सुनें | Listen"
//             disabled={!isSoundEnabled}
//           >
//             🔊 सुनें
//           </button>
//         </div>
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
  const [isSpeaking, setIsSpeaking] = useState(false);

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

  // Convert numbers to Hindi words
  const numberToHindiWords = (num) => {
    if (num === 0) return 'शून्य';
    
    const ones = ['', 'एक', 'दो', 'तीन', 'चार', 'पांच', 'छह', 'सात', 'आठ', 'नौ'];
    const teens = ['दस', 'ग्यारह', 'बारह', 'तेरह', 'चौदह', 'पंद्रह', 'सोलह', 'सत्रह', 'अट्ठारह', 'उन्नीस'];
    const tens = ['', '', 'बीस', 'तीस', 'चालीस', 'पचास', 'साठ', 'सत्तर', 'अस्सी', 'नब्बे'];
    
    const convertUnder100 = (n) => {
      if (n === 0) return '';
      if (n < 10) return ones[n];
      if (n < 20) return teens[n - 10];
      return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
    };
    
    const convert = (n) => {
      if (n === 0) return '';
      if (n < 100) return convertUnder100(n);
      if (n < 1000) {
        return ones[Math.floor(n / 100)] + ' सौ' + (n % 100 ? ' ' + convertUnder100(n % 100) : '');
      }
      if (n < 100000) {
        return convert(Math.floor(n / 1000)) + ' हज़ार' + (n % 1000 ? ' ' + convert(n % 1000) : '');
      }
      if (n < 10000000) {
        return convert(Math.floor(n / 100000)) + ' लाख' + (n % 100000 ? ' ' + convert(n % 100000) : '');
      }
      return convert(Math.floor(n / 10000000)) + ' करोड़' + (n % 10000000 ? ' ' + convert(n % 10000000) : '');
    };
    
    return convert(num).trim();
  };

  // Convert numbers to English words
  const numberToEnglishWords = (num) => {
    if (num === 0) return 'zero';
    
    const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    
    const convertUnder100 = (n) => {
      if (n === 0) return '';
      if (n < 10) return ones[n];
      if (n < 20) return teens[n - 10];
      return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
    };
    
    const convert = (n) => {
      if (n === 0) return '';
      if (n < 100) return convertUnder100(n);
      if (n < 1000) {
        return ones[Math.floor(n / 100)] + ' hundred' + (n % 100 ? ' and ' + convertUnder100(n % 100) : '');
      }
      if (n < 1000000) {
        return convert(Math.floor(n / 1000)) + ' thousand' + (n % 1000 ? ' ' + convert(n % 1000) : '');
      }
      if (n < 1000000000) {
        return convert(Math.floor(n / 1000000)) + ' million' + (n % 1000000 ? ' ' + convert(n % 1000000) : '');
      }
      return convert(Math.floor(n / 1000000000)) + ' billion' + (n % 1000000000 ? ' ' + convert(n % 1000000000) : '');
    };
    
    return convert(num).trim();
  };

  // Speak function - English only
  const handleSpeak = () => {
    if (!district || !isSoundEnabled || isSpeaking) return;

    setIsSpeaking(true);

    const text = `
      ${district.districtName} District Report.
      Total person days generated: ${numberToEnglishWords(district.personDaysGenerated)}.
      Average days per household: ${numberToEnglishWords(district.averageDaysPerHousehold)}.
      Total expenditure: ${numberToEnglishWords(district.totalExpenditure)} rupees.
      Total job cards: ${numberToEnglishWords(district.totalJobCards)}.
      Active job cards: ${numberToEnglishWords(district.activeJobCards)}.
      Total workers: ${numberToEnglishWords(district.totalWorkers)}.
      Workers provided work: ${numberToEnglishWords(district.workersProvided)}.
    `.replace(/\s+/g, ' ').trim();

    // If speak function is provided, use it
    if (speak) {
      speak(text);
      // Auto-stop after estimated time (assuming 150 words per minute)
      const estimatedDuration = (text.split(' ').length / 150) * 60 * 1000;
      setTimeout(() => {
        setIsSpeaking(false);
      }, estimatedDuration);
    } else {
      // Fallback to Web Speech API
      speakWithWebAPI(text);
    }
  };

  // Web Speech API for English
  const speakWithWebAPI = (text) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const speak = () => {
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Get available voices
        const voices = window.speechSynthesis.getVoices();
        
        // Find best English voice (prefer Indian English)
        const englishVoice = voices.find(voice => 
          voice.lang.includes('en-IN')
        ) || voices.find(voice =>
          voice.lang.includes('en-US') || voice.lang.includes('en-GB')
        );
        
        if (englishVoice) {
          utterance.voice = englishVoice;
          console.log('Using voice:', englishVoice.name);
        } else {
          utterance.lang = 'en-IN';
        }
        
        utterance.rate = 0.85;
        utterance.pitch = 1;
        utterance.volume = 1;

        utterance.onstart = () => {
          console.log('Speech started');
        };

        utterance.onend = () => {
          console.log('Speech ended');
          setIsSpeaking(false);
        };

        utterance.onerror = (event) => {
          console.error('Speech error:', event.error);
          setIsSpeaking(false);
        };

        window.speechSynthesis.speak(utterance);
      };

      // Load voices first (Chrome needs this)
      if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.onvoiceschanged = speak;
      } else {
        speak();
      }
    } else {
      alert('Your browser does not support text-to-speech');
      setIsSpeaking(false);
    }
  };

  // Stop speaking function
  const handleStop = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const toggleSound = () => {
    setIsSoundEnabled(!isSoundEnabled);
  };

  const getPerformanceLevel = (days) => {
    if (days >= 60) return { text: 'उत्कृष्ट | Excellent', color: '#4CAF50', emoji: '🌟' };
    if (days >= 40) return { text: 'अच्छा | Good', color: '#FF9800', emoji: '👍' };
    return { text: 'सुधार आवश्यक | Needs Improvement', color: '#F44336', emoji: '⚠️' };
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
            title={isSoundEnabled ? 'Mute' : 'Unmute'}
          >
            {isSoundEnabled ? '🔊' : '🔇'}
          </button>
          
          {!isSpeaking ? (
            <button 
              onClick={handleSpeak} 
              className="speak-button" 
              title="Listen to district report"
              disabled={!isSoundEnabled}
            >
              🔊 Listen
            </button>
          ) : (
            <button 
              onClick={handleStop} 
              className="speak-button stop-button" 
              title="Stop"
            >
              ⏹️ Stop
            </button>
          )}
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