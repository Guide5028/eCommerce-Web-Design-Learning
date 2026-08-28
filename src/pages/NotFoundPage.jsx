import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <main>
      <section className="favorite-section">
        <h2>Page not found</h2>
        <p className="favorite-empty">
          Back to <Link to="/">home</Link>.
        </p>
      </section>
    </main>
  );
}
