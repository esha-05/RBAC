import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AddUserModal = ({ onAddUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "Admin",
    status: "Active",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user.name || !user.email) {
      alert("Please provide both name and email.");
      return;
    }

    const newUser = {
      ...user,
      created: new Date().toISOString(),
    };

    const existingUsers = JSON.parse(sessionStorage.getItem("users")) || [];
    sessionStorage.setItem("users", JSON.stringify([...existingUsers, newUser]));

    onAddUser(newUser);
    setUser({ name: "", email: "", role: "Admin", status: "Active" });
    setIsOpen(false);
  };

  return (
    <div>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-white bg-blue-700 rounded-md hover:bg-blue-600"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
        Invite Member
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg w-96"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Invite Team Member</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={user.name}
                    onChange={handleInputChange}
                    className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter user name"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={user.email}
                    onChange={handleInputChange}
                    className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter user email"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="role"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={user.role}
                    onChange={handleInputChange}
                    className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="HR">HR</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={user.status}
                    onChange={handleInputChange}
                    className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 text-white bg-blue-700 rounded-md hover:bg-blue-600"
                  >
                    Invite Member
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddUserModal;
