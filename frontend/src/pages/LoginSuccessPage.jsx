import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginSuccessPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="success-container" style={{ textAlign: 'center', margin: '150px auto' }}>
      <div style={{ fontSize: '80px', color: '#4caf50', marginBottom: '20px' }}>
        ✓
      </div>
      <h2 style={{ color: '#333' }}>Login Successful!</h2>
      <p style={{ color: '#666' }}>Redirecting to homepage...</p>
      
      <div className="loader" style={{ margin: '30px auto', width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #fc2779', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default LoginSuccessPage;
