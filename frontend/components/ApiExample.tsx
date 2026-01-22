'use client';

import { useState } from 'react';
import { useApi, useMutation } from '@/hooks/useApi';
import type {EmailResponse, HealthResponse, ItemListResponse, SubmitResponse} from '@/lib/types';

/**
 * Example component demonstrating API integration with the Symfony backend
 */
export default function ApiExample() {
  const [formData, setFormData] = useState({ name: '', email: '' });

  // Fetch health status
  const { data: health, loading: healthLoading, error: healthError, refetch: refetchHealth } = 
    useApi<HealthResponse>('/health');

  // Fetch items list
  const { data: items, loading: itemsLoading, error: itemsError, refetch: refetchItems } = 
    useApi<ItemListResponse>('/data');

  // Submit mutation
  const { mutate: submitForm, loading: submitLoading, data: submitResponse } = 
    useMutation<typeof formData, SubmitResponse>('post', '/submit');

  const [emailFormData, setEmailFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const {mutate: sendEmail, loading: sendEmailLoading, data: sendEmailResponse } = useMutation<typeof emailFormData, EmailResponse>('post', '/contact-email');
  
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendEmail(emailFormData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitForm(formData);
    setFormData({ name: '', email: '' });
  };

  // Helper function to extract error message
  const getErrorMessage = (error: Error | null): string => {
    if (!error) return '';
    
    console.log('Error details:', error); // Debug logging
    
    // Check if it's an Axios error with response
    if ('response' in error && error.response) {
      return 'Connection failed - Check if backend is running on https://127.0.0.1:8000';
    }
    // Check if it's a network error
    if ('request' in error && error.request && !('response' in error)) {
      return 'Network error - Backend not reachable';
    }
    // Check for CORS or SSL certificate errors
    if (error.message.includes('Network Error') || error.message.includes('ERR_')) {
      return 'Cannot connect to backend at https://127.0.0.1:8000 - Check CORS/SSL settings';
    }
    // Default error message
    return error.message || 'Unknown error occurred';
  };

  return (
    <div className="api-example">
      <style jsx>{`
        .api-example {
          max-width: 800px;
          margin: 2rem auto;
          padding: 2rem;
          font-family: system-ui, -apple-system, sans-serif;
        }
        
        .section {
          margin-bottom: 2rem;
          padding: 1.5rem;
          border-radius: 12px;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        h2 {
          margin: 0 0 1rem 0;
          color: #e94560;
          font-size: 1.25rem;
        }
        
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 500;
        }
        
        .status-ok {
          background: rgba(16, 185, 129, 0.15);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }
        
        .status-error {
          background: rgba(239, 68, 68, 0.15);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }
        
        .status-loading {
          background: rgba(59, 130, 246, 0.15);
          color: #3b82f6;
          border: 1px solid rgba(59, 130, 246, 0.3);
        }
        
        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: currentColor;
        }
        
        .item-grid {
          display: grid;
          gap: 1rem;
          margin-top: 1rem;
        }
        
        .item-card {
          padding: 1rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .item-card h3 {
          margin: 0 0 0.5rem 0;
          color: #fff;
          font-size: 1rem;
        }
        
        .item-card p {
          margin: 0;
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.875rem;
        }
        
        form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        input {
          padding: 0.75rem 1rem;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.05);
          color: #fff;
          font-size: 1rem;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        
        input:focus {
          outline: none;
          border-color: #e94560;
          box-shadow: 0 0 0 3px rgba(233, 69, 96, 0.2);
        }
        
        input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }
        
        button {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          border: none;
          background: linear-gradient(135deg, #e94560 0%, #0f3460 100%);
          color: #fff;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(233, 69, 96, 0.4);
        }
        
        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .success-message {
          padding: 1rem;
          border-radius: 8px;
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: #10b981;
          margin-top: 1rem;
        }
        
        .meta {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.4);
          margin-top: 0.5rem;
        }
        
        .refetch-btn {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          margin-top: 1rem;
        }
        
        .refetch-btn:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.3);
        }
      `}</style>

      {/* Health Check Section */}
      <div className="section">
        <h2>🔌 API Health Status</h2>
        {healthLoading && (
          <span className="status-badge status-loading">
            <span className="dot"></span>
            Checking connection...
          </span>
        )}
        {healthError && (
          <span className="status-badge status-error">
            <span className="dot"></span>
            {getErrorMessage(healthError)}
          </span>
        )}
        {health && (
          <>
            <span className="status-badge status-ok">
              <span className="dot"></span>
              Connected - API v{health.version}
            </span>
            <p className="meta">Last checked: {new Date(health.timestamp).toLocaleString()}</p>
          </>
        )}
        <button className="refetch-btn" onClick={refetchHealth}>
          Refresh Status
        </button>
      </div>

      {/* Items List Section */}
      <div className="section">
        <h2>📦 Items from Backend ({items?.total || 0} total)</h2>
        {itemsLoading && <p style={{ color: 'rgba(255,255,255,0.6)' }}>Loading items...</p>}
        {itemsError && (
          <div className="status-badge status-error" style={{ display: 'block', marginTop: '1rem' }}>
            {getErrorMessage(itemsError)}
          </div>
        )}
        {items && (
          <div className="item-grid">
            {items.items.map((item) => (
              <div key={item.id} className="item-card">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        )}
        <button className="refetch-btn" onClick={refetchItems}>
          Reload Items
        </button>
      </div>

      {/* Form Submission Section */}
      <div className="section">
        <h2>📝 Submit Data to Backend</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
          <input
            type="email"
            placeholder="Your email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            required
          />
          <button type="submit" disabled={submitLoading}>
            {submitLoading ? 'Sending...' : 'Submit to API'}
          </button>
        </form>
        {submitResponse?.success && (
          <div className="success-message">
            ✓ {submitResponse.message}
          </div>
        )}
      </div>
      {/* Email Contact Form Section */}
      <div className="section">
        <h2>📧 Send Contact Email</h2>
        <form onSubmit={handleEmailSubmit}>
          <input
            type="text"
            placeholder="Your name"
            value={emailFormData.name}
            onChange={(e) => setEmailFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
          <input
            type="email"
            placeholder="Your email"
            value={emailFormData.email}
            onChange={(e) => setEmailFormData(prev => ({ ...prev, email: e.target.value }))}
            required
          />
          <textarea
            placeholder="Your message"
            value={emailFormData.message}
            onChange={(e) => setEmailFormData(prev => ({ ...prev, message: e.target.value }))}
            required
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#fff',
              fontSize: '1rem',
              minHeight: '100px',
              resize: 'vertical',
              fontFamily: 'inherit'
            }}
          />
          <button type="submit" disabled={sendEmailLoading}>
            {sendEmailLoading ? 'Sending...' : 'Send Email'}
          </button>
        </form>
        {sendEmailResponse?.success && (
          <div className="success-message">
            ✓ {sendEmailResponse.message}
          </div>
        )}
        {sendEmailResponse?.error && (
          <div style={{
            padding: '1rem',
            borderRadius: '8px',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#ef4444',
            marginTop: '1rem'
          }}>
            ✗ {sendEmailResponse.error}
          </div>
        )}
      </div>

    </div>
  );
}

