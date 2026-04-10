import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../lib/apiBase';

export default function ResourceEntryRedirect() {
  const [resourceId, setResourceId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchFirstResource = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/resources`, {
          params: { page: 0, size: 1, sortBy: 'name', sortDir: 'asc' },
        });

        const firstId = response.data?.content?.[0]?.id;
        if (isMounted) {
          setResourceId(firstId ?? null);
        }
      } catch {
        if (isMounted) {
          setResourceId(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchFirstResource();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-[#094886]" />
      </div>
    );
  }

  if (resourceId != null) {
    return <Navigate to={`/resource/${resourceId}`} replace />;
  }

  return <Navigate to="/resources" replace />;
}
