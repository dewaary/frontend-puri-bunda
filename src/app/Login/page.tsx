"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../../utils/api";
import { toast } from "react-toastify";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!username || !password) {
      setError("Username and password required.");
      toast.error("Username and password required.");
      return;
    }
  
    setLoading(true);
    setError(null);
  
    try {
      const payload = {
        username: username,
        password: password,
      };
  
      const response = await api.post("/login", payload);
  
      if (response.data.statusCode === 200) {
        localStorage.setItem("token", response.data.data.token);
        toast.success("Login succesfuly! redirect to dashboard...", {
          position: "top-right",
          autoClose: 3000,
        });
        router.push("/home");
      } else {
        toast.error(response.data.status, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error: any) {
      if (error.response) {
        toast.error( error.response.data.status, {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.error("Network Connection. Please try again.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="max-w-md w-full p-6 bg-white shadow-md rounded-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Input username"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Input password"
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className={`w-full bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 ${
              loading && "opacity-50 cursor-not-allowed"
            }`}
            disabled={loading}
          >
            {loading ? (
              <svg
                role="status"
                className="w-5 h-5 text-white animate-spin inline mr-2"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5909C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5909C0 22.9767 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9767 100 50.5909ZM9.08167 50.5909C9.08167 74.2286 25.7723 90.9192 50 90.9192C74.2277 90.9192 90.9183 74.2286 90.9183 50.5909C90.9183 26.9532 74.2277 10.2626 50 10.2626C25.7723 10.2626 9.08167 26.9532 9.08167 50.5909Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 96.8972 33.5532C95.0889 28.8227 92.871 24.3692 89.3296 20.5308C85.7891 16.6923 81.0322 13.5466 76.0728 11.4003C70.6024 8.96031 64.6818 7.91086 58.7348 8.32258C56.2586 8.51555 54.7904 10.8964 55.4275 13.3217C56.0646 15.747 58.5475 17.0915 61.0126 16.877C65.9013 16.4812 70.7193 17.5768 75.0405 19.924C79.3616 22.2713 83.0574 25.7871 85.7997 30.1492C88.542 34.5112 90.2559 39.5549 90.7557 44.838C91.0456 47.3794 93.5421 49.1281 96.9676 48.4152Z"
                  fill="#1c64f2"
                />
              </svg>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
