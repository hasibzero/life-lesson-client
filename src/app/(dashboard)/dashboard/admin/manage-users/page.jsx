"use client";

import React, { useState, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight, Shield, UserCheck, UserX, Crown, Trash2, Users } from "lucide-react";
import { Spinner, Button } from "@heroui/react";
import toast from "react-hot-toast";

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  // Fetch Users
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/admin/users`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        toast.error("Failed to load platform users.");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Server connection error.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [backendUrl]);

  // Handle User Action Updates (Suspend, Make Premium, Make Admin, Delete)
  const handleUpdateUser = async (userId, updatePayload, successMessage) => {
    try {
      const response = await fetch(`${backendUrl}/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatePayload),
      });

      if (response.ok) {
        toast.success(successMessage);
        setUsers(users.map(u => u._id === userId ? { ...u, ...updatePayload } : u));
      } else {
        toast.error("Failed to update user.");
      }
    } catch (error) {
      toast.error("An error occurred.");
    }
  };

  // Handle Delete User
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to permanently delete this user?")) return;

    try {
      const response = await fetch(`${backendUrl}/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("User deleted successfully.");
        setUsers(users.filter(u => u._id !== userId));
      } else {
        toast.error("Failed to delete user.");
      }
    } catch (error) {
      toast.error("Server error while deleting user.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "short", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Detailed Stats Calculations
  const totalUsersCount = users.length;
  const adminUsersCount = users.filter(u => u.role === "admin").length;
  const proUsersCount = users.filter(u => u.plan === "premium" && u.role !== "admin").length;
  const freeUsersCount = users.filter(u => u.plan !== "premium" && u.role !== "admin").length;

  // Filter Logic
  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = selectedRole === "All" || user.role?.toLowerCase() === selectedRole.toLowerCase();
    const matchesStatus = selectedStatus === "All" || (user.status || "Active")?.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  if (isLoading) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" color="current" className="text-[#0f766e]" />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-8 font-sans">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#1a202c] dark:text-white tracking-tight">
          User Management
        </h1>
        <p className="text-[15px] text-zinc-600 dark:text-zinc-400 mt-1">
          Manage and oversee all registered users on the platform.
        </p>
      </div>

      {/* Metric Cards Row - Separated into 4 distinct cards for Total, Admins, Pro, and Free */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Users */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
          <span className="text-[13px] font-bold text-zinc-500 uppercase tracking-wider mb-2">
            Total Users
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-zinc-900 dark:text-white">
              {totalUsersCount.toLocaleString()}
            </span>
            <Users className="w-5 h-5 text-zinc-400" />
          </div>
        </div>

        {/* Admin Users */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
          <span className="text-[13px] font-bold text-zinc-500 uppercase tracking-wider mb-2">
            Admin Users
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
              {adminUsersCount.toLocaleString()}
            </span>
            <Shield className="w-5 h-5 text-indigo-500" />
          </div>
        </div>

        {/* Pro / Premium Users */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
          <span className="text-[13px] font-bold text-zinc-500 uppercase tracking-wider mb-2">
            Pro Users
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-[#0f766e] dark:text-[#16A696]">
              {proUsersCount.toLocaleString()}
            </span>
            <Crown className="w-5 h-5 text-amber-500" />
          </div>
        </div>

        {/* Free Users */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
          <span className="text-[13px] font-bold text-zinc-500 uppercase tracking-wider mb-2">
            Free Users
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-zinc-700 dark:text-zinc-300">
              {freeUsersCount.toLocaleString()}
            </span>
            <span className="text-[12px] font-semibold text-zinc-400">Standard</span>
          </div>
        </div>

      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 shadow-sm">
        
        <div className="relative flex-1 w-full flex items-center">
          <Search className="absolute left-4 w-4 h-4 text-zinc-400" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users by name or email..."
            className="w-full bg-[#f9fafb] dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-[14px] text-zinc-900 dark:text-white outline-none focus:border-[#0f766e] transition-colors"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select 
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="cursor-pointer bg-[#f9fafb] dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-[14px] text-zinc-900 dark:text-white outline-none focus:border-[#0f766e] transition-colors"
          >
            <option value="All">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="User">User</option>
          </select>

          <select 
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="cursor-pointer bg-[#f9fafb] dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-[14px] text-zinc-900 dark:text-white outline-none focus:border-[#0f766e] transition-colors"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>

      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 text-[13px] font-bold text-zinc-500 uppercase tracking-wider bg-zinc-50/50 dark:bg-zinc-900/50">
                <th className="py-4 px-6">User</th>
                <th className="py-4 px-6">Role</th>
                <th className="py-4 px-6">Joined Date</th>
                <th className="py-4 px-6">Subscription</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-[14px]">
              {currentUsers.map((u) => {
                const userInitial = u.name ? u.name.charAt(0).toUpperCase() : "U";
                const isSuspended = (u.status || "Active") === "Suspended";
                const isPremium = u.plan === "premium";
                const isAdmin = u.role === "admin";

                return (
                  <tr key={u._id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors">
                    
                    {/* User Details */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#0f766e] text-white flex items-center justify-center font-bold text-sm shrink-0 uppercase overflow-hidden">
                          {u.image ? (
                            <img src={u.image} alt="" className="w-full h-full rounded-full object-cover" />
                          ) : (
                            userInitial
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-zinc-900 dark:text-white">
                            {u.name || "Unnamed User"}
                          </span>
                          <span className="text-[13px] text-zinc-500">
                            {u.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-4 px-6">
                      <span className={`inline-flex px-3 py-1 rounded-full text-[12px] font-semibold ${
                        isAdmin ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400" : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                      }`}>
                        {isAdmin ? "Admin" : "User"}
                      </span>
                    </td>

                    {/* Joined Date */}
                    <td className="py-4 px-6 text-zinc-600 dark:text-zinc-400 font-medium">
                      {formatDate(u.createdAt)}
                    </td>

                    {/* Subscription */}
                    <td className="py-4 px-6 font-semibold text-zinc-900 dark:text-white">
                      {isPremium ? "Pro" : "Free"}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold ${
                        isSuspended ? "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400" : "bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isSuspended ? "bg-red-500" : "bg-teal-500"}`}></span>
                        {isSuspended ? "Suspended" : "Active"}
                      </span>
                    </td>

                    {/* Actions Menu */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        
                        {/* Toggle Ban / Unban */}
                        <button
                          onClick={() => handleUpdateUser(u._id, { status: isSuspended ? "Active" : "Suspended" }, isSuspended ? "User activated" : "User suspended")}
                          title={isSuspended ? "Activate User" : "Suspend User"}
                          className={`p-2 rounded-xl transition-colors cursor-pointer ${isSuspended ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" : "bg-amber-50 text-amber-600 hover:bg-amber-100"}`}
                        >
                          {isSuspended ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                        </button>

                        {/* Toggle Premium */}
                        <button
                          onClick={() => handleUpdateUser(u._id, { plan: isPremium ? "free" : "premium" }, isPremium ? "Subscription set to Free" : "Upgraded to Premium Pro")}
                          title={isPremium ? "Downgrade to Free" : "Upgrade to Premium"}
                          className="p-2 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 transition-colors cursor-pointer"
                        >
                          <Crown className="w-4 h-4" />
                        </button>

                        {/* Toggle Admin */}
                        <button
                          onClick={() => handleUpdateUser(u._id, { role: isAdmin ? "user" : "admin" }, isAdmin ? "Admin privileges revoked" : "User promoted to Admin")}
                          title={isAdmin ? "Revoke Admin" : "Make Admin"}
                          className="p-2 rounded-xl bg-teal-50 text-teal-600 hover:bg-teal-100 dark:bg-teal-500/10 dark:text-teal-400 transition-colors cursor-pointer"
                        >
                          <Shield className="w-4 h-4" />
                        </button>

                        {/* Delete User */}
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          title="Delete User"
                          className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                      </div>
                    </td>

                  </tr>
                );
              })}

              {currentUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-500">
                    No users found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <span className="text-[14px] text-zinc-500">
            Showing {filteredUsers.length > 0 ? indexOfFirstItem + 1 : 0} to {Math.min(indexOfLastItem, filteredUsers.length)} of {filteredUsers.length} users
          </span>

          {totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="w-9 h-9 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="w-9 h-9 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}