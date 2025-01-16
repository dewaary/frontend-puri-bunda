"use client"

import React, { useState } from "react";
import { useRouter } from "next/router"; // Import useRouter untuk navigasi setelah login

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
//   const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulasi proses login
    if (username === "admin" && password === "password") {
      setError(null);
    //   router.push("/dashboard"); // Redirect ke dashboard setelah login berhasil
    } else {
      setError("Username atau password salah!");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="max-w-md w-full p-6 bg-white shadow-md rounded-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <form onSubmit={handleLogin}>
          {/* Username */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Masukkan username"
            />
          </div>
  
          {/* Password */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Masukkan password"
            />
          </div>
  
          {/* Error Message */}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
  
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
  
};

export default LoginPage;
