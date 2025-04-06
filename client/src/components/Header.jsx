import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Flame, User, LogOut, Menu } from "lucide-react";
import { useSelector } from "react-redux";
const Header = () => {
  const authUser = useSelector((state) => state.auth.authUser);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  return (
    <div>
      <header className="bg-gradient-to-r from-pink-200 via-pink-500 to-pink-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <Flame className="w-8 h-8 text-white" />
                <span className="text-2xl font-bold text-white hidden sm:inline">
                  Dertin
                </span>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              {authUser ? <Flame /> : <Flame />}
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
