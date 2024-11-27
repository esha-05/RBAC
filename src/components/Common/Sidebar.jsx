import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaUsers, FaKey } from "react-icons/fa";
import { MdSecurity, MdDashboard } from "react-icons/md";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { CgMenuGridO } from "react-icons/cg";

const menuItems = [
  { label: "Dashboard", icon: <MdDashboard />, path: "/dashboard" },
  { label: "Users", icon: <FaUsers />, path: "/users" },
  { label: "Roles", icon: <MdSecurity />, path: "/roles" },
  { label: "Permissions", icon: <FaKey />, path: "/permissions" },
];

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="relative">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-blue-800 text-white sm:w-64 w-60 z-40 shadow-lg transform transition-transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
      >
        <div className="py-6 px-4 border-b border-blue-700">
          <Link to="/dashboard" className="text-xl font-bold">
            RBAC
          </Link>
        </div>

        <nav className="px-4">
          <ul className="space-y-4 mt-6">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 p-3 rounded-md ${
                    location.pathname === item.path
                      ? "bg-blue-700"
                      : "hover:bg-blue-700"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-base">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="sm:hidden fixed top-6 left-4 z-50 bg-blue-600 text-white p-2 rounded-full"
      >
        {isSidebarOpen ? (
          <AiOutlineCloseCircle size={20} />
        ) : (
          <CgMenuGridO size={20} />
        )}
      </button>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 sm:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Sidebar;
