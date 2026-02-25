import { useState } from 'react';
import { ArrowLeft, Banknote, ClipboardCopy } from 'lucide-react';

const PaymentDetail = ({ label, value }) => (
  <div className="flex justify-between items-center py-4 border-b border-gray-200">
    <span className="text-gray-600">{label}</span>
    <span className="font-bold text-gray-800">{value}</span>
  </div>
);

export default function PaymentPage() {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [error, setError] = useState('');

  const handleConfirmPayment = async () => {
    setError('');
    try {
      const response = await fetch('/api/student/confirm-payment', { method: 'POST' });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      setIsConfirmed(true);
    } catch (err) {
      setError(err.message);
    }
  };
  const registrationFee = 'Rp 500.000';
  const uniqueCode = '123';
  const totalAmount = 'Rp 500.123';
  const bankDetails = {
    bank: 'Bank Central Asia (BCA)',
    accountNumber: '888-1234-567',
    accountName: 'Yayasan Pendidikan Hebat',
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    // Maybe show a toast notification here
    alert(`Copied: ${text}`);
  };

  return (
    <div className="bg-gray-50 h-full p-6 font-sans">
      <header className="flex items-center mb-8">
        <button className="text-blue-500 font-semibold flex items-center mr-4">
          <ArrowLeft size={20} className="mr-1" />
          Dashboard
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Payment</h1>
      </header>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h2 className="font-bold text-lg text-center mb-1 text-gray-800">Total Amount</h2>
        <p className="text-4xl font-bold text-center text-blue-500 mb-6">{totalAmount}</p>
        
        <div className="mb-6">
          <PaymentDetail label="Registration Fee" value={registrationFee} />
          <PaymentDetail label="Unique Code" value={uniqueCode} />
        </div>

        <div className="bg-blue-50 p-4 rounded-xl text-center text-blue-800">
          <p className="font-semibold">Please transfer the exact total amount.</p>
          <p className="text-sm">The unique code is used to verify your payment.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mt-4">
        <h3 className="font-bold text-lg mb-4 text-gray-800">Bank Transfer Details</h3>
        <div className="space-y-3">
          <p className="text-gray-600">{bankDetails.bank}</p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-mono font-bold text-gray-800">{bankDetails.accountNumber}</p>
            <button onClick={() => handleCopy(bankDetails.accountNumber)} className="text-blue-500 hover:text-blue-700">
              <ClipboardCopy size={20} />
            </button>
          </div>
          <p className="text-gray-600">a/n {bankDetails.accountName}</p>
        </div>
      </div>

            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative mt-4" role="alert">{error}</div>}
      {isConfirmed && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl relative mt-4" role="alert">Your confirmation has been sent. Please wait for admin to verify.</div>}

      <div className="pt-6">
        <button 
          onClick={handleConfirmPayment}
          disabled={isConfirmed}
          className="w-full bg-blue-500 text-white font-bold py-4 rounded-xl hover:bg-blue-600 transition-colors duration-300 shadow-lg shadow-blue-500/30 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isConfirmed ? 'Confirmation Sent' : 'I Have Completed the Payment'}
        </button>
      </div>
    </div>
  );
}
