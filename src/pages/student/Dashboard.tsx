import { useState, useEffect } from 'react';
import { User, CreditCard, FileText, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StatusCard } from '../../components/StatusCard';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/student/me');
        if (!response.ok) throw new Error('Failed to fetch user data');
        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    navigate('/login');
  };

  return (
    <div className="bg-gray-50 h-full p-6 font-sans">
      <header className="mb-8">
        <div className="flex items-center">
          <img src="https://picsum.photos/seed/student/100/100" alt="Student" className="w-16 h-16 rounded-full mr-4 border-4 border-white shadow" />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Welcome, {user?.name || 'Student'}!</h1>
            <p className="text-gray-500">Let's complete your application.</p>
          </div>
          <button onClick={handleLogout} className="ml-auto bg-red-500 text-white font-bold py-2 px-4 rounded-xl hover:bg-red-600 transition-colors duration-300">
            Logout
          </button>
        </div>
      </header>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative mb-4" role="alert">{error}</div>}

      {user && user.admissionStatus !== 'Pending' && (
        <div className={`p-6 rounded-2xl mb-6 text-center ${user.admissionStatus === 'Passed' ? 'bg-green-100 border-green-200' : 'bg-red-100 border-red-200'} border`}>
          <h2 className={`text-2xl font-bold ${user.admissionStatus === 'Passed' ? 'text-green-800' : 'text-red-800'}`}>Admission Result: {user.admissionStatus}</h2>
          <p className={`mt-2 ${user.admissionStatus === 'Passed' ? 'text-green-600' : 'text-red-600'}`}>
            {user.admissionStatus === 'Passed' 
              ? 'Congratulations! You have been accepted. Please await further information.' 
              : 'We regret to inform you that you have not passed at this time. Thank you for your interest.'}
          </p>
        </div>
      )}

      <div className="space-y-4">
        <StatusCard 
          icon={<CreditCard size={20} />}
          title="Payment"
          status={user?.paymentStatus || 'Awaiting'}
          link="/student/payment"
          linkText={user?.paymentStatus === 'Awaiting' ? 'Make Payment' : 'View Details'}
          completed={user?.paymentStatus !== 'Awaiting'}
        />
        <StatusCard 
          icon={<User size={20} />}
          title="Biodata"
          status={user?.biodataStatus || 'Incomplete'}
          link="/student/biodata"
          linkText={user?.biodataStatus === 'Incomplete' ? 'Fill Biodata' : 'Edit Biodata'}
          completed={user?.biodataStatus === 'Complete'}
        />
        <StatusCard 
          icon={<FileText size={20} />}
          title="Documents"
          status={user?.documentStatus || 'Incomplete'}
          link="/student/documents"
          linkText={user?.documentStatus === 'Incomplete' ? 'Upload Files' : 'View Documents'}
          completed={user?.documentStatus !== 'Incomplete'}
        />
         <StatusCard 
          icon={<CheckCircle size={20} />}
          title="Academic Test"
          status={user?.documentStatus !== 'Approved' ? 'Awaiting document approval' : (user?.tkaStatus || 'Pending')}
          link={user?.documentStatus === 'Approved' ? "/student/test" : "#"}
          linkText={user?.documentStatus === 'Approved' ? (user?.tkaStatus === 'Pending' ? 'Take Test' : 'View Score') : 'Locked'}
          completed={user?.tkaStatus === 'Complete'}
        />
      </div>
    </div>
  );
}
