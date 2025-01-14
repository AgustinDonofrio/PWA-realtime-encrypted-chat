import React from "react";
import Input from "../../components/input/Input";

const Login: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 px-4">
      <div className="w-full max-w-sm p-6 bg-gray-800 rounded-lg shadow-md sm:max-w-md md:max-w-lg lg:max-w-xl">
        <h1 className="text-2xl font-bold text-center text-white mb-6">
          Enter your email
        </h1>
        <form>
          <Input
            type="email"
            id="email"
            placeholder="Email"
            className="mb-4"
          />
          <Input
            type="password"
            id="password"
            placeholder="Password"
            className="mb-4"
          />
          <button
            type="button"
            className="w-full py-2 mb-4 text-gray-200 bg-gray-700 border border-gray-600 rounded hover:bg-gray-600 focus:outline-none"
          >
            Login with Google
          </button>
          <button
            type="submit"
            className="w-full py-2 mb-4 text-white bg-blue-600 rounded hover:bg-blue-500 focus:outline-none"
          >
            Login
          </button>
        </form>
        <div className="text-center text-gray-400">
          <p className="text-sm">
            New user?{" "}
            <a href="#" className="font-medium text-blue-500 hover:underline">
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;