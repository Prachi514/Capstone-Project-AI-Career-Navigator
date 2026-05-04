import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function GoogleSignIn({ setToken }) {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const containerRef = useRef(null);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    // Load GSI script globally (once)
    const id = 'google-identity-script';
    let script = document.getElementById(id);
    if (!script) {
      script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.id = id;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }

    const initGSI = () => {
      if (!window.google || !window.google.accounts || !window.google.accounts.id) return false;
      if (!clientId) {
        console.warn('VITE_GOOGLE_CLIENT_ID not set');
        return false;
      }

      if (!containerRef.current) return false;

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response) => {
          const idToken = response?.credential;
          if (!idToken) return;
          try {
            const res = await fetch('/api/auth/google', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ idToken })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Google sign-in failed');

            localStorage.setItem('token', data.token);
            localStorage.setItem('userName', data.user.name || data.user.email.split('@')[0]);
            localStorage.setItem('userEmail', data.user.email);
            if (data.user.createdAt) localStorage.setItem('userCreatedAt', data.user.createdAt);
            setToken?.(data.token);
            window.dispatchEvent(new Event('tokenUpdated'));
            navigate('/dashboard');
          } catch (err) {
            console.error('Google sign-in backend error', err);
          }
        }
      });

      // Render button into the ref container (not managed by React)
      window.google.accounts.id.renderButton(containerRef.current, {
        theme: 'outline',
        size: 'large'
      });

      return true;
    };

    // Try to initialize if GSI is ready
    if (initGSI()) {
      setReady(true);
      return;
    }

    // Wait for script load
    const onLoad = () => {
      if (initGSI()) setReady(true);
    };

    script.addEventListener('load', onLoad);

    // Poll as fallback
    let tries = 0;
    const interval = setInterval(() => {
      tries += 1;
      if (initGSI()) {
        setReady(true);
        clearInterval(interval);
      }
      if (tries > 15) clearInterval(interval);
    }, 200);

    return () => {
      script.removeEventListener('load', onLoad);
      clearInterval(interval);
    };
  }, [clientId, navigate, setToken]);

  if (!clientId) {
    return (
      <div className="mt-4 text-sm text-red-600">
        Google Sign-In is not configured. Set <code>VITE_GOOGLE_CLIENT_ID</code> in your `.env`.
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div ref={containerRef} />
      {!ready && <div className="text-sm text-gray-500">Loading Google sign-in…</div>}
    </div>
  );
}
