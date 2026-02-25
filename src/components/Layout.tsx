import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="bg-gray-800 min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm h-[80vh] max-h-[900px] bg-black rounded-[60px] border-[14px] border-black overflow-hidden shadow-2xl relative">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-8 bg-black rounded-b-3xl z-10"></div>
        
        {/* Screen Content */}
        <div className="bg-white w-full h-full overflow-y-auto">
          <Outlet />
        </div>

        {/* Home Bar */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-36 h-1.5 bg-gray-400 rounded-full"></div>
      </div>
    </div>
  );
}
