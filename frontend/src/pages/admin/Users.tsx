// src/components/Users.js

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../../contexts/Auth";
import Loading from "../../components/Loading";

const Users = () => {
  const { fetchUsers, allUsers: users } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getUsers = async () => {
      try {
        await fetchUsers();
      } catch (error) {
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    getUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen ">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 text-white">
      <h2 className="text-3xl font-bold  mb-6">User List</h2>
      {users.length === 0 ? (
        <p className="text-lg ">No users found</p>
      ) : (
        <table className="min-w-full ">
          <thead>
            <tr className="w-full bg-background border-b border-gray">
              <th className="p-4 text-left text-sm font-semibold text-white">
                Full Name
              </th>
              <th className="p-4 text-left text-sm font-semibold text-white">
                Username
              </th>
              <th className="p-4 text-left text-sm font-semibold text-white">
                Role
              </th>
              <th className="p-4 text-left text-sm font-semibold text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="p-4 text-white">{user.fullName}</td>
                <td className="p-4 text-white">@{user.username}</td>
                <td className="p-4 text-white">{user.role}</td>
                <td className="p-4">
                  <Link
                    to={`/admin/users/${user._id}`}
                    className="text-blue-500 hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Users;
