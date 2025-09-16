import React from 'react';
import { Menu, Search, } from 'lucide-react';
const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 flex items-center justify-between p-4 relative">
      <div className="flex items-center">
        <button
          className="text-white focus:outline-none md:hidden mr-3"
          aria-label="Toggle sidebar"
        >
          <Menu size={24} />
        </button>
        <div className="relative w-64 sm:w-96">
          <input
            type="text"
            placeholder="Search"
            className="w-full border border-yellow-500 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <div className="absolute left-3 top-2.5 text-yellow-500">
            <Search size={20} />
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        {/* Notification Bell */}
        {/* <button className="relative p-2 text-black bg-white rounded-lg cursor-pointer hover:bg-yellow-500 transition-colors">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            3
          </span>
        </button> */}
        <div className="flex items-center cursor-pointer  rounded-lg p-1 transition-colors">
          <div className="mr-2 text-right hidden sm:block">
            <p className="text-sm font-medium">Admin</p>
            <p className="text-xs text-white-500">Administrator</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-black font-semibold">
            AU
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;
