import { useState, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { StatusPill } from '../../components/StatusPill';

 

export default function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/admin/students');
      if (!response.ok) throw new Error('Failed to fetch students');
      const data = await response.json();
      setStudents(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleUpdateAdmission = async (userId, status) => {
    try {
      const response = await fetch('/api/admin/update-admission-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, status }),
      });
      if (!response.ok) throw new Error('Failed to update status');
      fetchStudents();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleApproveDocuments = async (userId) => {
    try {
      const response = await fetch('/api/admin/approve-documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (!response.ok) throw new Error('Failed to approve documents');
      fetchStudents();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleApprovePayment = async (userId) => {
    try {
      const response = await fetch('/api/admin/approve-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (!response.ok) throw new Error('Failed to approve payment');
      // Refresh student list after approval
      fetchStudents();
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <div className="bg-gray-50 h-full font-sans">
      <header className="bg-white p-6 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-500">Manage new student admissions.</p>
      </header>

      <div className="p-6">
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative mb-4" role="alert">{error}</div>}
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search students..." 
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center font-semibold text-gray-600 bg-white border border-gray-200 px-4 py-3 rounded-xl hover:bg-gray-50">
            Filter <ChevronDown size={20} className="ml-2" />
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Name</th>
                <th className="p-4 font-semibold text-gray-600">Payment</th>
                <th className="p-4 font-semibold text-gray-600">Biodata</th>
                <th className="p-4 font-semibold text-gray-600">Documents</th>
                <th className="p-4 font-semibold text-gray-600">TKA Score</th>
                <th className="p-4 font-semibold text-gray-600">Admission</th>
                <th className="p-4 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="border-b border-gray-200 last:border-b-0">
                  <td className="p-4 flex items-center">
                    <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full mr-4" />
                    <div>
                      <p className="font-bold text-gray-800">{student.name}</p>
                      <p className="text-sm text-gray-500">{student.email}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <StatusPill status={student.paymentStatus} />
                  </td>
                  <td className="p-4">
                    <StatusPill status={student.biodataStatus} />
                  </td>
                  <td className="p-4">
                    <StatusPill status={student.documentStatus} />
                  </td>
                  <td className="p-4 font-bold text-gray-800 text-center">{student.tkaScore ?? 'N/A'}</td>
                  <td className="p-4">
                    <StatusPill status={student.admissionStatus} />
                  </td>
                  <td className="p-4">
                    {student.paymentStatus === 'Awaiting' && (
                      <button onClick={() => handleApprovePayment(student.id)} className="font-semibold text-blue-500 hover:text-blue-600">
                        Approve Payment
                      </button>
                    )}
                     {student.paymentStatus === 'Paid' && student.biodataStatus === 'Complete' && student.documentStatus !== 'Approved' && (
                      <button onClick={() => handleApproveDocuments(student.id)} className="font-semibold text-purple-500 hover:text-purple-600">
                        Approve Documents
                      </button>
                    )}
                    {student.documentStatus === 'Approved' && student.admissionStatus === 'Pending' && (
                        <div className="flex space-x-2">
                          <button onClick={() => handleUpdateAdmission(student.id, 'Passed')} className="font-semibold text-green-500 hover:text-green-600">Pass</button>
                          <button onClick={() => handleUpdateAdmission(student.id, 'Failed')} className="font-semibold text-red-500 hover:text-red-600">Fail</button>
                        </div>
                      )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
