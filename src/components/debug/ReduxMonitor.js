import React from 'react';
import { useSelector } from 'react-redux';

const ReduxMonitor = () => {
  const { loading, error, prescriptions } = useSelector(state => state.auth);
  
  if (process.env.NODE_ENV !== 'development') return null;
  
  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '10px', 
      right: '10px', 
      padding: '10px', 
      background: '#f8f9fa',
      border: '1px solid #ddd',
      borderRadius: '5px',
      zIndex: 9999,
      maxWidth: '300px',
      maxHeight: '200px',
      overflow: 'auto',
      fontSize: '12px'
    }}>
      <div><strong>Redux State:</strong></div>
      <div>Loading: {loading ? 'true' : 'false'}</div>
      {error && <div style={{ color: 'red' }}>Error: {JSON.stringify(error)}</div>}
      <div>Prescriptions: {prescriptions?.length || 0}</div>
      <button 
        onClick={() => console.log('Auth State:', useSelector(state => state.auth))} 
        style={{ marginTop: '5px', padding: '2px 5px', fontSize: '10px' }}
      >
        Log State
      </button>
    </div>
  );
};

export default ReduxMonitor;
