import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AddPermissionModal = ({ onAddPermission }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [permissionData, setPermissionData] = useState({
    name: "",
    description: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPermissionData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!permissionData.name || !permissionData.description) {
      alert("Please fill in all fields.");
      return;
    }

    onAddPermission(permissionData);

    // Reset form and close modal
    setPermissionData({ name: "", description: "" });
    setModalOpen(false);
  };

  return (
    <div>
      {/* Trigger Button */}
      <button
        onClick={() => setModalOpen(true)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-white bg-blue-700 rounded-md hover:bg-blue-600"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
        Add Permission
      </button>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
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
                <h2 className="text-lg font-semibold">Add Permission</h2>
                <button
                  onClick={() => setModalOpen(false)}
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
                    Permission Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={permissionData.name}
                    onChange={handleInputChange}
                    className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter permission name"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={permissionData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter description"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 text-white bg-blue-700 rounded-md hover:bg-blue-600"
                  >
                    Add Permission
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

export default AddPermissionModal;
