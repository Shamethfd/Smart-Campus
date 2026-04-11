import Sidebar from '../components/Sidebar';
import ResourceList from './ResourceList';

export default function AdminEditResourcesPage() {
  return (
    <div className="flex min-h-screen" style={{ background: '#f0f4fa' }}>
      <Sidebar />
      <main className="min-w-0 flex-1 overflow-auto">
        <div className="border-b border-slate-200/80 bg-white/80 px-4 py-6 backdrop-blur-sm sm:px-8">
          <h1 className="text-2xl font-black tracking-tight" style={{ color: '#094886' }}>
            Edit resources
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Search, view, edit, or remove campus resources.
          </p>
        </div>
        <ResourceList />
      </main>
    </div>
  );
}