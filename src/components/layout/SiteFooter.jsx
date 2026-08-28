import { useState } from 'react';
import { Link } from 'react-router-dom';

// Ported from legacy/js/app.js:553-579 (newsletter submit -> transient success state)

export default function SiteFooter() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    const input = event.target.elements.email;
    if (!input.checkValidity()) {
      input.reportValidity();
      return;
    }
    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      setEmail('');
    }, 1500);
  }

  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <p className="footer-logo">Funiro.</p>
          <address>
            400 University Drive Suite 200 Coral Gables,
            <br />
            FL 33134 USA
          </address>
        </div>

        <div className="footer-col">
          <h3>Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/shop">Shop</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h3>Help</h3>
          <ul>
            <li><a href="#top" onClick={(e) => e.preventDefault()}>Payment Options</a></li>
            <li><a href="#top" onClick={(e) => e.preventDefault()}>Returns</a></li>
            <li><a href="#top" onClick={(e) => e.preventDefault()}>Privacy Policies</a></li>
          </ul>
        </div>

        <div className="footer-newsletter">
          <h3>Newsletter</h3>
          <form className="newsletter-form" onSubmit={handleSubmit}>
            <label htmlFor="newsletter-email" className="sr-only">Email address</label>
            <input
              type="email"
              id="newsletter-email"
              name="email"
              placeholder="Enter Your Email Address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
            />
            <button type="submit" disabled={submitting}>
              {submitting ? 'SUBSCRIBED!' : 'SUBSCRIBE'}
            </button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <p>2023 furino. All rights reverved</p>
      </div>
    </footer>
  );
}
