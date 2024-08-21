import React, { useState } from "react";

interface LoginProps {
  onLogin: (username: string, password: string) => void;
}

function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div className="h-[82vh] flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg mx-auto flex-col bg-white p-8 rounded-lg shadow-lg"
        style={{ minHeight: "400px" }} // Optional: Adjust height as needed
      >
        <div className="mb-5">
          <label
            htmlFor="username"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Username:
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Password:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
        </div>

        <button
          type="submit"
          className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-4 self-center"
        >
          Login
        </button>
        <hr className="mt-5" />
        <p className="text-center text-gray-500 text-lg">
          Here for{" "}
          <a href="#" className="text-blue-500 hover:underline">
            Survey
          </a>
          ?
        </p>
      </form>
    </div>
  );
}

export default Login;
