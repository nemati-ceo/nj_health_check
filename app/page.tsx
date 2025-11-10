'use client';
import { useState } from 'react';

export default function ApiTestPage() {
  const [url, setUrl] = useState('https://dev-api.pencilly.us/api/v1/health');
  const [data, setData] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleFetch = async () => {
    if (!url) {
      setData('Please enter a valid URL.');
      setIsError(true);
      return;
    }

    setLoading(true);
    setData('');
    setIsError(false);

    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);

    xhr.onload = () => {
      let formattedData = xhr.responseText;
      try {
        const json = JSON.parse(xhr.responseText);
        formattedData = JSON.stringify(json, null, 2);
      } catch {
        // Not JSON, keep as text
      }
      setData(`Status: ${xhr.status} ${xhr.statusText}\n\n${formattedData}`);
      setIsError(xhr.status < 200 || xhr.status >= 300);
      setLoading(false);
    };

    xhr.onerror = () => {
      let errorMsg = 'Network error';
      if (xhr.status === 0) {
        errorMsg = 'CORS error or unable to access the resource (blocked by CORS policy)';
      } else {
        errorMsg = `Error: ${xhr.status} ${xhr.statusText}`;
      }
      setData(errorMsg);
      setIsError(true);
      setLoading(false);
    };

    xhr.send();
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>API Fetcher</h1>
      <input
        type="text"
        placeholder="Enter API URL (e.g. https://dev-api.pencilly.us/api/v1/health/)"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{
          width: '100%',
          maxWidth: 600,
          padding: 10,
          marginBottom: 10,
          fontSize: 16,
        }}
      />
      <button
        onClick={handleFetch}
        disabled={loading}
        style={{
          padding: '10px 20px',
          fontSize: 16,
          cursor: 'pointer',
          background: '#0070f3',
          color: '#fff',
          border: 'none',
          borderRadius: 5,
        }}
      >
        {loading ? 'Fetching...' : 'Fetch Data'}
      </button>

      <pre
        style={{
          marginTop: 20,
          whiteSpace: 'pre-wrap',
          background: '#f5f5f5',
          padding: 15,
          borderRadius: 5,
          maxWidth: 800,
          overflowX: 'auto',
          color: isError ? 'red' : 'green',
        }}
      >
        {data || 'Response will appear here...'}
      </pre>
    </div>
  );
}
