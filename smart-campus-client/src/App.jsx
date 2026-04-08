import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import BookingRequest from './pages/BookingRequest';
import UserDashboard from './pages/UserDashboard';
import AdminPanel from './pages/AdminPanel';

function App() {
  const isAdmin = false;

  return (
    <Router>
      <div className="min-h-full bg-slate-50 text-slate-900">
        <header className="border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#094886] text-sm font-semibold text-white shadow-sm">
                SC
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-900">Smart Campus</span>
                <span className="text-xs text-slate-500">Resource booking</span>
              </div>
            </Link>

            <nav className="flex items-center gap-2 text-sm">
              <NavLink to="/book" label="Book" />
              <NavLink to="/dashboard" label="Dashboard" />
              {isAdmin && (
                <Link
                  to="/admin"
                  className="rounded-full bg-[#094886] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#094886]/90"
                >
                  Admin
                </Link>
              )}
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<HomePage isAdmin={isAdmin} />} />
            <Route path="/book" element={<BookingRequest />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function NavLink({ to, label }) {
  return (
    <Link
      to={to}
      className="rounded-full px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
    >
      {label}
    </Link>
  );
}

function HomePage({ isAdmin }) {
  const cards = [
    {
      title: 'Book Resource',
      text: 'Create requests for rooms, labs, and equipment with date and time slots.',
      cta: 'Start Booking',
      to: '/book',
    },
    {
      title: 'Track Requests',
      text: 'Check status updates from pending to approved or rejected in one place.',
      cta: 'View Dashboard',
      to: '/dashboard',
    },
    {
      title: 'Admin Actions',
      text: 'Review requests quickly and manage approvals with clear status controls.',
      cta: isAdmin ? 'Open Admin' : 'Admin View',
      to: isAdmin ? '/admin' : '/dashboard',
    },
  ];

  const flow = [
    'Submit booking request',
    'Status becomes pending',
    'Admin approves or rejects',
    'Approved booking can be cancelled',
  ];

  return (
    <div className="space-y-10">
      <section className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="space-y-5">
          <span className="inline-flex items-center rounded-full bg-[#094886]/5 px-3 py-1 text-xs font-medium text-[#094886]">
            Campus resource booking
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            A clear way to request and manage campus resources.
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-slate-600">
            Submit booking requests, track statuses, and keep admins and users aligned on what is reserved and when.
          </p>

          <div className="flex flex-wrap gap-3 pt-1">
            <Link
              to="/book"
              className="inline-flex items-center justify-center rounded-full bg-[#094886] px-6 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#094886]/90"
            >
              Create booking
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              View my bookings
            </Link>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-card">
          <h2 className="text-sm font-semibold text-slate-900">How it works</h2>
          <p className="mt-2 text-xs text-slate-500">Typical flow for any booking.</p>
          <ol className="mt-4 space-y-3 text-sm">
            {flow.map((step, index) => (
              <li key={step} className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#2563EB] text-[10px] font-semibold text-white">
                  {index + 1}
                </span>
                <span className="text-slate-700">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="space-y-4">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Quick access</h2>
            <p className="text-xs text-slate-500">Jump directly into the main areas of the system.</p>
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          {cards.map((card) => (
            <article key={card.title} className="flex flex-col justify-between rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">{card.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">{card.text}</p>
              </div>
              <Link
                to={card.to}
                className="mt-4 inline-flex text-xs font-semibold text-[#2563EB] hover:text-[#2563EB]/80"
              >
                {card.cta}
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default App;
