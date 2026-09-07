import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Spin } from 'antd';
import { useAuth } from '../context/AuthContext.jsx';

// Landing page for the Google/Facebook OAuth redirect: stores tokens, or shows pending/error.
export default function OAuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const { loginWithTokens } = useAuth();
  const navigate = useNavigate();
  const [state, setState] = useState('working'); // 'working' | 'done' | 'pending' | 'error'
  const ranOnce = useRef(false);

  useEffect(() => {
    // guards against React StrictMode's double-invoke re-running this in dev
    if (ranOnce.current) return;
    ranOnce.current = true;

    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const status = searchParams.get('status');

    if (status === 'pending') {
      setState('pending');
      return;
    }
    if (status === 'error' || !accessToken || !refreshToken) {
      setState('error');
      return;
    }

    loginWithTokens(accessToken, refreshToken)
      .then(() => {
        setState('done');
        window.setTimeout(() => navigate('/'), 600);
      })
      .catch(() => setState('error'));
  }, [searchParams, loginWithTokens, navigate]);

  if (state === 'pending') {
    return (
      <main>
        <section className="favorite-section">
          <h2>Almost there</h2>
          <p className="favorite-empty">
            Your account was created and is waiting for an admin to approve it. Come back and log in once
            they have. <Link to="/login">Back to login</Link>.
          </p>
        </section>
      </main>
    );
  }

  if (state === 'error') {
    return (
      <main>
        <section className="favorite-section">
          <h2>Sign-in failed</h2>
          <p className="favorite-empty">
            Something went wrong signing you in. <Link to="/login">Try again</Link>.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main>
      <div style={{ padding: '120px 0', textAlign: 'center' }}>
        <Spin size="large" tip={state === 'done' ? 'Signed in — redirecting…' : 'Signing you in…'} />
      </div>
    </main>
  );
}
