import React, { useState, useEffect } from "react";
import Navbar from "../Common/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTrash, FaSearch, FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import EditRoleModal from "../Modal/EditModal/EditRoleModal";
import AddRole from "../Modal/AddModal/AddRoleModal";
import { roles as importedRoles } from "../Api/MockDatas";

const Role = () => {
  const rowsPerPage = 5;
  const headings = [
    { key: "Id", value: "ID" },
    { key: "rolename", value: "Role" },
    { key: "description", value: "Description" },
    { key: "permission", value: "Permissions" },
    { key: "action", value: "Actions" },
  ];

  const [roles, setRoles] = useState(importedRoles);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "Id", direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const filteredRoles = roles
    .filter((role) => {
      const lowerSearchTerm = searchTerm.toLowerCase();
      return (
        role.rolename.toLowerCase().includes(lowerSearchTerm) ||
        role.description.toLowerCase().includes(lowerSearchTerm)
      );
    })
    .filter((role) => (filterRole ? role.rolename === filterRole : true))
    .sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

  const paginatedRoles = filteredRoles.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const totalPages = Math.ceil(filteredRoles.length / rowsPerPage);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRowSelection = (roleId) => {
    setSelectedRows((prev) =>
      prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId]
    );
  };

  const toggleSelectAll = () => {
    setSelectedRows(selectedRows.length === roles.length ? [] : roles.map((role) => role.Id));
  };

  const handleEdit = (role) => {
    setSelectedRole(role);
    setIsEditModalOpen(true);
  };

  const handleDelete = (roleId) => {
    Swal.fire({
      title: "Are you sure?",
      text: `This will delete the role with ID ${roleId}. This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        setRoles((prev) => prev.filter((role) => role.Id !== roleId));
        toast.success(`Role with ID ${roleId} deleted successfully`);
      }
    });
  };

  const handleBulkDelete = () => {
    if (selectedRows.length === 0) {
      toast.error("No roles selected for deletion");
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete ${selectedRows.length} role(s). This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete them!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        setRoles((prev) => prev.filter((role) => !selectedRows.includes(role.Id)));
        toast.success(`${selectedRows.length} role(s) deleted successfully`);
        setSelectedRows([]);
      }
    });
  };

  const handleAddRole = (newRole) => {
    setRoles((prev) => [
      ...prev,
      {
        Id: prev.length + 1,
        rolename: newRole.rolename,
        description: newRole.description,
        permissions: newRole.permissions,
      },
    ]);
    toast.success("New role added successfully!");
  };

  return (
    <div className="p-6">
      <Navbar />
      <div className="bg-gray-100 rounded-lg shadow-md mt-6 p-6">
        <h1 className="text-2xl font-bold mb-4">Role Management</h1>
        <div className="mb-4 flex justify-between items-center">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search roles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 rounded-lg border"
            />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="p-2 rounded-lg border"
            >
              <option value="">Filter by Role</option>
              {roles.map((role) => (
                <option key={role.Id} value={role.rolename}>
                  {role.rolename}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-3">
            <AddRole onAddRole={handleAddRole} />
            <button
              className="bg-red-600 text-white p-2 rounded-lg flex items-center gap-2"
              onClick={handleBulkDelete}
            >
              <FaTrash /> Delete Selected
            </button>
          </div>
        </div>

        <table className="w-full table-auto text-left text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th>
                <input type="checkbox" onChange={toggleSelectAll} />
              </th>
              {headings.map((heading) => (
                <th
                  key={heading.key}
                  onClick={() => handleSort(heading.key)}
                  className="cursor-pointer px-6 py-2 font-semibold"
                >
                  {heading.value}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedRoles.map((role) => (
              <tr key={role.Id} className="hover:bg-gray-50 border-b">
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(role.Id)}
                    onChange={() => handleRowSelection(role.Id)}
                  />
                </td>
                <td>{role.Id}</td>
                <td>{role.rolename}</td>
                <td>{role.description}</td>
                <td>{Object.keys(role.permissions).join(", ")}</td>
                <td className="flex gap-3">
                  <button onClick={() => handleEdit(role)}>
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(role.Id)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex justify-between items-center">
          <div>Page {currentPage} of {totalPages}</div>
          <div>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => handlePageChange(idx + 1)}
                className={`p-2 mx-1 rounded-lg ${currentPage === idx + 1 ? "bg-blue-700 text-white" : "bg-gray-300"}`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {isEditModalOpen && (
          <EditRoleModal
            role={selectedRole}
            onSave={(updatedRole) => setRoles((prev) =>
              prev.map((role) => (role.Id === updatedRole.Id ? updatedRole : role))
            )}
            onClose={() => setIsEditModalOpen(false)}
          />
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Role;
