import TicketForm from '../components/tickets/TicketForm';

export default function TicketPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Support Tickets</h1>
        <p className="mt-1 text-sm text-slate-600">
          Report technical issues and campus maintenance incidents.
        </p>
      </div>
      <TicketForm />
    </div>
  );
}
