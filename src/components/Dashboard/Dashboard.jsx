import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaUsers, FaKey } from "react-icons/fa";
import { MdSecurity } from "react-icons/md";
import { IoMdPeople } from "react-icons/io";
import Navbar from "../Common/Navbar";
import { users, roles, permissions } from "../Api/MockDatas";

const Dashboard = () => {
  const [totals, setTotals] = useState({
    users: 0,
    roles: 0,
    permissions: 0,
    activeUsers: 0,
  });

  useEffect(() => {
    setTotals({
      users: users.length,
      roles: roles.length,
      permissions: permissions.length,
      activeUsers: users.filter((user) => user.status === "Active").length,
    });
  }, []);

  const cards = [
    {
      label: "Total Users",
      value: totals.users,
      icon: <FaUsers />,
      color: "orange",
      link: "/users",
    },
    {
      label: "Roles",
      value: totals.roles,
      icon: <MdSecurity />,
      color: "green",
      link: "/roles",
    },
    {
      label: "Permissions",
      value: totals.permissions,
      icon: <FaKey />,
      color: "teal",
      link: "/permissions",
    },
    {
      label: "Active Users",
      value: totals.activeUsers,
      icon: <IoMdPeople />,
      color: "blue",
      link: "/users",
    },
  ];

  return (
    <div className="p-6">
      <Navbar />
      <div className="bg-gray-100 rounded-lg shadow-md mt-6 p-6">
        <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((card, index) => (
            <Link
              to={card.link}
              key={index}
              className={`flex items-center p-4 bg-white rounded-lg shadow hover:bg-${card.color}-100 transition`}
            >
              <div
                className={`p-3 mr-4 text-${card.color}-500 bg-${card.color}-100 rounded-full`}
              >
                <div className="text-xl">{card.icon}</div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {card.label}
                </p>
                <p className="text-xl font-semibold text-gray-700">
                  {card.value}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
