/**
 * UnauthorizedPage.jsx
 * Shown when a user tries to access a page they don't have permission for.
 */

import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import Card, { CardBody } from '../components/ui/Card';

export default function UnauthorizedPage() {
  const { user } = useAuth();
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardBody className="py-10 text-center">
          <div className="text-4xl">🚫</div>
          <div className="mt-2 text-5xl font-extrabold tracking-tight text-red-600">
            403
          </div>
          <h1 className="mt-3 text-xl font-extrabold text-slate-900">
            Access Denied
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            You don't have permission to view this page.
            {user ? (
              <>
                {' '}
                Your current role is{' '}
                <span className="font-extrabold">{user.role}</span>.
              </>
            ) : null}
          </p>
          <Button as={Link} to="/dashboard" className="mt-6">
            ← Back to Dashboard
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
