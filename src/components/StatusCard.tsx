import { CheckCircle, ArrowRight } from 'lucide-react';

export const StatusCard = ({ icon, title, status, link, linkText, completed }) => (
  <div className={`bg-white p-6 rounded-2xl shadow-sm border ${completed ? 'border-green-200' : 'border-gray-200'}`}>
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
          {icon}
        </div>
        <h3 className="font-bold text-lg text-gray-800">{title}</h3>
      </div>
      {completed && <CheckCircle className="text-green-500" size={24} />}
    </div>
    <p className={`mb-4 ${completed ? 'text-green-600' : 'text-gray-500'}`}>{status}</p>
    {!completed && (
      <a href={link} className="font-semibold text-blue-500 hover:text-blue-600 flex items-center">
        {linkText}
        <ArrowRight size={16} className="ml-1" />
      </a>
    )}
  </div>
);
