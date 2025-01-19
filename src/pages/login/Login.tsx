import React from "react";
import Input from "../../components/input/input";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-full items-center justify-center min-h-screen bg-main-color px-4">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl">
        <h1 className="text-2xl font-bold text-center text-white mb-6">
          Enter your email
        </h1>
        <form className="flex flex-col space-y-10">
          <Input
            type="email"
            id="email"
            placeholder="Email"
            className=" bg-steel rounded-xl"
            inputName="email"
          />
          <Input
            type="password"
            id="password"
            placeholder="Password"
            className=" bg-steel rounded-xl"
            inputName="password"
          />

          <div className="flex flex-col space-y-3">
            <button
              type="button"
              className="w-full py-3 text-gray-200 bg-steel border-steel rounded-xl hover:bg-gray-600 focus:outline-none"
            >
              Login with Google
            </button>
            <button
              type="submit"
              className="w-full py-3 text-white bg-royal-blue rounded-xl hover:bg-blue-500 focus:outline-none"
            >
              Login
            </button>

            <div className="text-center text-gray-400">
              <p className="text-sm">
                New user?{" "}
                <a href="#" onClick={() => { navigate("/register") }} className="font-medium text-blue-500 hover:underline">
                  Register
                </a>
              </p>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};

export default Login;