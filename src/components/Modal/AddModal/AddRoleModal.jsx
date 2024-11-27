import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

const AddRoleModal = ({ onAddRole }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [role, setRole] = useState({
    rolename: "",
    description: "",
    permissions: {
      read: false,
      write: false,
      delete: false,
      manageRoles: false,
      viewAnalytics: false,
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRole((prevRole) => ({ ...prevRole, [name]: value }));
  };

  const togglePermission = (permission) => {
    setRole((prevRole) => ({
      ...prevRole,
      permissions: {
        ...prevRole.permissions,
        [permission]: !prevRole.permissions[permission],
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!role.rolename || !role.description) {
      toast.error("Role name and description are required.", {
        position: "top-right",
      });
      return;
    }

    onAddRole(role);

    setRole({
      rolename: "",
      description: "",
      permissions: {
        read: false,
        write: false,
        delete: false,
        manageRoles: false,
        viewAnalytics: false,
      },
    });

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
        Add Role
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
                <h2 className="text-lg font-semibold">Add New Role</h2>
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
                    htmlFor="rolename"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Role Name
                  </label>
                  <input
                    type="text"
                    id="rolename"
                    name="rolename"
                    value={role.rolename}
                    onChange={handleInputChange}
                    className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter role name"
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
                    value={role.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter description"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Permissions
                  </label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    {Object.keys(role.permissions).map((permission) => (
                      <label key={permission} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={role.permissions[permission]}
                          onChange={() => togglePermission(permission)}
                          className="form-checkbox text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {permission.replace(/([A-Z])/g, " $1")}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 text-white bg-blue-700 rounded-md hover:bg-blue-600"
                  >
                    Add Role
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

export default AddRoleModal;
