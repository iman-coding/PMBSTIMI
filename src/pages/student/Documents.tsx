import { useState } from 'react';
import { ArrowLeft, UploadCloud, File, X } from 'lucide-react';

const FileUploadSlot = ({ label, file, onFileChange, onFileRemove }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    {file ? (
      <div className="flex items-center justify-between bg-gray-100 p-3 rounded-xl border border-gray-200">
        <div className="flex items-center">
          <File className="text-gray-500 mr-3" size={20} />
          <span className="text-gray-800 font-medium">{file.name}</span>
        </div>
        <button onClick={onFileRemove} className="text-red-500 hover:text-red-700">
          <X size={20} />
        </button>
      </div>
    ) : (
      <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
        <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">Drag & drop or <span className="font-semibold text-blue-500">browse</span></p>
        <input type="file" className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer" onChange={onFileChange} />
      </div>
    )}
  </div>
);

export default function DocumentsPage() {
  const [files, setFiles] = useState({
    ktp: null,
    kk: null,
    ijazah: null,
  });

  const handleFileChange = (e, type) => {
    setFiles(prev => ({ ...prev, [type]: e.target.files[0] }));
  };

  const handleFileRemove = (type) => {
    setFiles(prev => ({ ...prev, [type]: null }));
  };

    const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const formData = new FormData();
    if (files.ktp) formData.append('ktp', files.ktp);
    if (files.kk) formData.append('kk', files.kk);
    if (files.ijazah) formData.append('ijazah', files.ijazah);

    if (formData.entries().next().done) {
      setError('Please upload at least one document.');
      return;
    }

    try {
      const response = await fetch('/api/student/upload-documents', {
        method: 'POST',
        body: formData,
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
        <h1 className="text-2xl font-bold text-gray-800">Upload Documents</h1>
      </header>

            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative mb-4" role="alert">{error}</div>}
      {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl relative mb-4" role="alert">{success}</div>}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <FileUploadSlot 
          label="KTP (ID Card)"
          file={files.ktp}
          onFileChange={(e) => handleFileChange(e, 'ktp')}
          onFileRemove={() => handleFileRemove('ktp')}
        />
        <FileUploadSlot 
          label="Kartu Keluarga (Family Card)"
          file={files.kk}
          onFileChange={(e) => handleFileChange(e, 'kk')}
          onFileRemove={() => handleFileRemove('kk')}
        />
        <FileUploadSlot 
          label="Ijazah SMA (High School Diploma)"
          file={files.ijazah}
          onFileChange={(e) => handleFileChange(e, 'ijazah')}
          onFileRemove={() => handleFileRemove('ijazah')}
        />
        <div className="pt-4">
          <button 
            type="submit" 
            className="w-full bg-blue-500 text-white font-bold py-4 rounded-xl hover:bg-blue-600 transition-colors duration-300 shadow-lg shadow-blue-500/30"
          >
            Submit Documents
          </button>
        </div>
      </form>
    </div>
  );
}
