import { useState, useEffect } from 'react';
import { FiShield, FiUser } from 'react-icons/fi';

const AdminLoginButton = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem('role');
    setIsAdmin(role === 'admin');
  }, []);

  const handleAdminLogin = () => {
    if (isAdmin) {
      // Logout from admin
      localStorage.removeItem('role');
      setIsAdmin(false);
      window.location.reload();
    } else {
      // Login as admin
      localStorage.setItem('role', 'admin');
      setIsAdmin(true);
      window.location.reload();
    }
  };

  return (
    <button
      onClick={handleAdminLogin}
      className={`fixed bottom-4 right-4 px-4 py-2 rounded-lg font-medium transition-all duration-300 z-50 ${
        isAdmin 
          ? 'bg-red-600 hover:bg-red-700 text-white' 
          : 'bg-[#094886] hover:bg-[#2563eb] text-white'
      }`}
    >
      {isAdmin ? (
        <div className="flex items-center space-x-2">
          <FiUser className="w-4 h-4" />
          <span>Exit Admin</span>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <FiShield className="w-4 h-4" />
          <span>Admin</span>
        </div>
      )}
    </button>
  );
};

export default AdminLoginButton;
