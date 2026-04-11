import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getMyTickets } from '../services/ticketService';
import TicketDetail from '../components/tickets/TicketDetail';
import Card, { CardBody } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { formatDate } from '../utils/dateUtils';

const STATUS_VARIANT = {
  OPEN: 'info',
  IN_PROGRESS: 'warning',
  RESOLVED: 'success',
  CLOSED: 'neutral',
  REJECTED: 'danger',
};

export default function MyPreviousTicketsPage() {
  const { user } = useAuth();
  const email = user?.email?.trim();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  const load = useCallback(async () => {
    if (!email) {
      setLoading(false);
      setTickets([]);
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await getMyTickets(email);
      const body = res.data;
      const list = Array.isArray(body) ? body : body?.data ?? body?.content ?? [];
      setTickets(Array.isArray(list) ? list : []);
    } catch (e) {
      console.error(e);
      setError('Could not load your tickets. Please try again.');
      setTickets([]);
    } finally {
      setLoading(false);
    }
  }, [email]);

  useEffect(() => {
    load();
  }, [load]);

  if (!email) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">My previous tickets</h1>
          <p className="mt-1 text-sm text-slate-600">Tickets linked to your account email.</p>
        </div>
        <Card>
          <CardBody className="py-10 text-center text-slate-600">
            Your profile does not include an email yet. Sign in again or contact support.
          </CardBody>
        </Card>
      </div>
    );
  }

  if (selectedId) {
    return (
      <div className="space-y-4">
        <div>
          <button
            type="button"
            onClick={() => setSelectedId(null)}
            className="text-sm font-bold text-blue-700 hover:underline"
          >
            Back to my tickets
          </button>
        </div>
        <TicketDetail ticketId={selectedId} onBack={() => setSelectedId(null)} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">My previous tickets</h1>
        <p className="mt-1 text-sm text-slate-600">
          Support requests you submitted with <span className="font-semibold text-slate-800">{email}</span>.
        </p>
      </div>

      {error && (
        <Card>
          <CardBody className="border border-red-200 bg-red-50 text-sm font-semibold text-red-800">
            {error}
          </CardBody>
        </Card>
      )}

      {loading ? (
        <Card>
          <CardBody className="py-16 text-center text-slate-500">Loading your tickets...</CardBody>
        </Card>
      ) : tickets.length === 0 ? (
        <Card>
          <CardBody className="py-14 text-center">
            <p className="mt-2 font-semibold text-slate-700">No tickets yet</p>
            <p className="mt-1 text-sm text-slate-500">When you submit a ticket, it will show up here.</p>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-3">
          {tickets.map((t) => (
            <Card key={t.id}>
              <CardBody className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                  <p className="font-extrabold text-slate-900">{t.title}</p>
                  <p className="mt-1 truncate text-sm text-slate-600">
                    {t.location && <span>{t.location}</span>}
                    {t.category && (
                      <span className="text-slate-400">
                        {t.location ? ' · ' : ''}
                        {t.category}
                      </span>
                    )}
                  </p>
                  <p className="mt-2 text-xs font-semibold text-slate-400">
                    {t.createdAt ? formatDate(t.createdAt) : ''}
                  </p>
                </div>
                <div className="flex flex-shrink-0 flex-wrap items-center gap-2">
                  <Badge variant={STATUS_VARIANT[t.status] ?? 'neutral'}>{t.status?.replace('_', ' ') ?? '-'}</Badge>
                  <Badge variant="neutral">{t.priority ?? '-'}</Badge>
                  <button
                    type="button"
                    onClick={() => setSelectedId(t.id)}
                    className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-800"
                  >
                    View
                  </button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}