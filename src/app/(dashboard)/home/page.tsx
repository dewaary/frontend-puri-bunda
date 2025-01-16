"use client"

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Dashboard = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Dummy data
  const data = {
    karyawan: [
      { id: 1, name: "Karyawan 1", joinedAt: "2024-12-01" },
      { id: 2, name: "Karyawan 2", joinedAt: "2024-12-05" },
      { id: 3, name: "Karyawan 3", joinedAt: "2025-01-05" },
    ],
    login: [
      { userId: 1, loginAt: "2024-12-01" },
      { userId: 2, loginAt: "2024-12-02" },
      { userId: 3, loginAt: "2025-01-05" },
    ],
    topUsers: [
      { name: "User 1", loginCount: 35, lastLogin: "2025-01-15" },
      { name: "User 2", loginCount: 40, lastLogin: "2025-01-14" },
    ],
  };

  // Fungsi untuk filter karyawan dan login berdasarkan rentang waktu
  const filterByDateRange = () => {
    const start = startDate?.getTime();
    const end = endDate?.getTime();

    if (!start || !end) {
      return;
    }

    const filteredKaryawan = data.karyawan.filter((karyawan) => {
      const joinedAt = new Date(karyawan.joinedAt).getTime();
      return joinedAt >= start && joinedAt <= end;
    });

    const filteredLogin = data.login.filter((login) => {
      const loginAt = new Date(login.loginAt).getTime();
      return loginAt >= start && loginAt <= end;
    });

    return {
      filteredKaryawan,
      filteredLogin,
    };
  };

  const filteredData = filterByDateRange();

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold">Dashboard Overview</h2>

      {/* Filter */}
      <div className="flex gap-4 my-4">
        <div>
          <label>Start Date:</label>
          <DatePicker
            selected={startDate}
            onChange={(date: Date) => setStartDate(date)}
            dateFormat="yyyy-MM-dd"
          />
        </div>
        <div>
          <label>End Date:</label>
          <DatePicker
            selected={endDate}
            onChange={(date: Date) => setEndDate(date)}
            dateFormat="yyyy-MM-dd"
          />
        </div>
        <button
          onClick={filterByDateRange}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Apply Filter
        </button>
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg">Jumlah Karyawan</h3>
          <p className="text-2xl font-bold">
            {filteredData?.filteredKaryawan?.length || data.karyawan.length}
          </p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg">Jumlah Login</h3>
          <p className="text-2xl font-bold">
            {filteredData?.filteredLogin?.length || data.login.length}
          </p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg">Jumlah Unit</h3>
          <p className="text-2xl font-bold">{data.unit}</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg">Jumlah Jabatan</h3>
          <p className="text-2xl font-bold">{data.jabatan}</p>
        </div>
      </div>

      {/* Top 10 Users */}
      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-lg mb-4">Top 10 Users with More Than 25 Logins</h3>
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Login Count</th>
              <th className="py-2 px-4 text-left">Last Login</th>
            </tr>
          </thead>
          <tbody>
            {data.topUsers.map((user, index) => (
              <tr key={index} className="border-b hover:bg-gray-100">
                <td className="py-2 px-4">{user.name}</td>
                <td className="py-2 px-4">{user.loginCount}</td>
                <td className="py-2 px-4">{user.lastLogin}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
