import React, { useState, useEffect } from "react";
import Navbar from "../Common/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTrash, FaSearch, FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import AddPermissionModal from "../Modal/AddModal/AddPermissionModal";
import EditPermissionModal from "../Modal/EditModal/EditPermissionModal";
import { permissions as importedPermissions } from "../Api/MockDatas";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

const Permissions = () => {
  const [permissions, setPermissions] = useState(importedPermissions);
  const [searchTerm, setSearchTerm] = useState("");
  const [permissionFilter, setPermissionFilter] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editPermissionData, setEditPermissionData] = useState(null);

  const rowsPerPage = 5;
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  /** Filter and sort logic **/
  const filteredPermissions = permissions.filter((permission) => {
    const matchesSearch =
      permission.permission.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      permission.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    const matchesFilter = !permissionFilter || permission.permission === permissionFilter;
    return matchesSearch && matchesFilter;
  });

  const sortedPermissions = [...filteredPermissions].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const paginatedPermissions = sortedPermissions.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  /** Handlers **/
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleAddPermission = (newPermission) => {
    setPermissions((prev) => [...prev, { id: Date.now(), ...newPermission }]);
    setIsAddModalOpen(false);
    toast.success("Permission added successfully!");
  };

  const handleEditPermission = (updatedPermission) => {
    setPermissions((prev) =>
      prev.map((perm) => (perm.id === updatedPermission.id ? updatedPermission : perm))
    );
    setIsEditModalOpen(false);
    toast.success("Permission updated successfully!");
  };

  const handleDeletePermission = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setPermissions((prev) => prev.filter((perm) => perm.id !== id));
        toast.success("Permission deleted successfully!");
      }
    });
  };

  const handleBulkDelete = () => {
    if (!selectedRows.length) {
      toast.error("No permissions selected for deletion!");
      return;
    }
    Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete ${selectedRows.length} permissions.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete them!",
    }).then((result) => {
      if (result.isConfirmed) {
        setPermissions((prev) => prev.filter((perm) => !selectedRows.includes(perm.id)));
        setSelectedRows([]);
        toast.success(`${selectedRows.length} permissions deleted successfully!`);
      }
    });
  };

  const handleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleSelectAllRows = (checked) => {
    setSelectedRows(checked ? permissions.map((perm) => perm.id) : []);
  };

  const uniquePermissions = Array.from(new Set(permissions.map((perm) => perm.permission)));
  const totalPages = Math.ceil(sortedPermissions.length / rowsPerPage);

  /** Pagination **/
  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <div className="p-6">
      <Navbar />
      <ToastContainer />
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Permissions</h1>

        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Search..."
              className="border rounded px-4 py-2 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="border rounded px-4 py-2"
              value={permissionFilter}
              onChange={(e) => setPermissionFilter(e.target.value)}
            >
              <option value="">All Permissions</option>
              {uniquePermissions.map((perm) => (
                <option key={perm} value={perm}>
                  {perm}
                </option>
              ))}
            </select>
          </div>
          <div className="space-x-2">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded"
              onClick={() => setIsAddModalOpen(true)}
            >
              Add Permission
            </button>
            <button
              className="bg-red-600 text-white px-4 py-2 rounded"
              onClick={handleBulkDelete}
            >
              Delete Selected
            </button>
          </div>
        </div>

        <table className="w-full text-left border">
          <thead>
            <tr>
              <th className="border p-2">
                <input
                  type="checkbox"
                  checked={selectedRows.length === permissions.length}
                  onChange={(e) => handleSelectAllRows(e.target.checked)}
                />
              </th>
              <th className="border p-2" onClick={() => handleSort("id")}>
                ID {sortConfig.key === "id" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th className="border p-2">Permission</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPermissions.map((perm) => (
              <tr key={perm.id}>
                <td className="border p-2">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(perm.id)}
                    onChange={() => handleSelectRow(perm.id)}
                  />
                </td>
                <td className="border p-2">{perm.id}</td>
                <td className="border p-2">{perm.permission}</td>
                <td className="border p-2">{perm.description}</td>
                <td className="border p-2 space-x-2">
                  <button
                    className="text-blue-600"
                    onClick={() => {
                      setEditPermissionData(perm);
                      setIsEditModalOpen(true);
                    }}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-600"
                    onClick={() => handleDeletePermission(perm.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex justify-between">
          <div>Page {currentPage} of {totalPages}</div>
          <div className="space-x-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`px-4 py-2 rounded ${
                  currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isAddModalOpen && (
        <AddPermissionModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleAddPermission}
        />
      )}

      {isEditModalOpen && editPermissionData && (
        <EditPermissionModal
          isOpen={isEditModalOpen}
          permissionData={editPermissionData}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleEditPermission}
        />
      )}
    </div>
  );
};

export default Permissions;
