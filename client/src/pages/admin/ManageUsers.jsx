import React, { useEffect, useState } from "react";
import Title from "../../components/admin/Title";
import Loading from "../../components/Loading";
import SearchBar from "../../components/SearchBar";
import { useAppContext } from "../../context/AppContext";
import { toast } from "react-hot-toast";

const ManageUsers = () => {
  const { axios, getToken } = useAppContext();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("/api/admin/all-users", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) setUsers(data.users);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load users");
    }
    setLoading(false);
  };

  const handleRoleChange = async (userId, role) => {
    try {
      const { data } = await axios.put(
        `/api/admin/update-role/${userId}`,
        { role },
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );
      if (data.success) {
        toast.success("Role updated");
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, role } : u))
        );
      } else toast.error(data.message);
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = (searchText
    ? users.filter(
        (u) =>
          u.name.toLowerCase().includes(searchText.toLowerCase()) ||
          u.email.toLowerCase().includes(searchText.toLowerCase())
      )
    : users
  ).sort((a, b) => {
    if (a.role === 'superadmin') return -1;
    if (b.role === 'superadmin') return 1;
    return 0;
  });

  return loading ? (
    <Loading />
  ) : (
    <>
      <Title text1="Manage" text2="Users" />
      <div className="max-w-4xl mt-6 overflow-x-auto">
        <div className="mb-3 w-72"><SearchBar value={searchText} onChange={setSearchText} /></div>
        <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
          <thead>
            <tr className="bg-primary/20 text-left text-white">
              <th className="p-2 font-medium pl-5">Name</th>
              <th className="p-2 font-medium">Email</th>
              <th className="p-2 font-medium">Role</th>
            </tr>
          </thead>
          <tbody className="text-sm font-light">
            {filtered.map((user) => (
              <tr key={user._id} className="border-b border-primary/10 bg-primary/5 even:bg-primary/10">
                <td className="p-2 pl-5">{user.name}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">
                  {user.role === "superadmin" ? (
                    <span className="text-yellow-400 font-semibold drop-shadow-lg">
                      Super&nbsp;Admin
                    </span>
                  ) : (
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className="bg-gray-800 border border-gray-600 px-2 py-1 rounded-md cursor-pointer"
                    >
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ManageUsers; 