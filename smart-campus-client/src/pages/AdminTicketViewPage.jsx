import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TicketList from '../components/tickets/TicketList';
import TicketDetail from '../components/tickets/TicketDetail';

export default function AdminTicketViewPage() {
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  return (
    <div className="flex min-h-dvh bg-slate-50">
      <Sidebar />

      <main className="min-w-0 flex-1 p-4 sm:p-8">
        <header className="mb-4">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">🎫 Ticket View</h1>
          <p className="mt-1 text-sm text-slate-500">
            Open, review, and manage support tickets.
          </p>
        </header>

        {selectedTicketId ? (
          <TicketDetail
            ticketId={selectedTicketId}
            onBack={() => setSelectedTicketId(null)}
          />
        ) : (
          <TicketList onViewTicket={setSelectedTicketId} />
        )}
      </main>
    </div>
  );
}
