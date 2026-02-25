import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

const InputField = ({ label, name, type = 'text', placeholder, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input 
      type={type} 
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

export default function BiodataForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    placeOfBirth: '',
    dateOfBirth: '',
    nik: '',
    nisn: '',
    address: '',
    phoneNumber: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

    const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/student/biodata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      setSuccess(data.message);
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <div className="bg-gray-50 h-full p-6 font-sans">
      <header className="flex items-center mb-8">
        <button className="text-blue-500 font-semibold flex items-center mr-4">
          <ArrowLeft size={20} className="mr-1" />
          Dashboard
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Biodata Form</h1>
      </header>

            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative mb-4" role="alert">{error}</div>}
      {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl relative mb-4" role="alert">{success}</div>}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <InputField label="Full Name" name="fullName" placeholder="Enter your full name" value={formData.fullName} onChange={handleChange} />
        <InputField label="Place of Birth" name="placeOfBirth" placeholder="City of birth" value={formData.placeOfBirth} onChange={handleChange} />
        <InputField label="Date of Birth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} />
        <InputField label="NIK (National ID Number)" name="nik" placeholder="16-digit NIK" value={formData.nik} onChange={handleChange} />
        <InputField label="NISN (National Student ID Number)" name="nisn" placeholder="10-digit NISN" value={formData.nisn} onChange={handleChange} />
        <InputField label="Address" name="address" placeholder="Your current address" value={formData.address} onChange={handleChange} />
        <InputField label="Phone Number" name="phoneNumber" placeholder="Active phone number" value={formData.phoneNumber} onChange={handleChange} />
        
        <div className="pt-4">
          <button 
            type="submit" 
            className="w-full bg-blue-500 text-white font-bold py-4 rounded-xl hover:bg-blue-600 transition-colors duration-300 shadow-lg shadow-blue-500/30"
          >
            Save Biodata
          </button>
        </div>
      </form>
    </div>
  );
}
