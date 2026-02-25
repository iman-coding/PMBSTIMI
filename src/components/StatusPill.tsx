import { CheckCircle, Clock } from 'lucide-react';

export const StatusPill = ({ status }) => {
  const isPaid = status === 'Paid' || status === 'Complete';
  return (
    <span 
      className={`px-3 py-1 text-sm font-semibold rounded-full flex items-center ${isPaid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
      {isPaid ? <CheckCircle size={14} className="mr-1.5" /> : <Clock size={14} className="mr-1.5" />}
      {status}
    </span>
  );
};
