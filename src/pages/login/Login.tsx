import React, { useState } from "react";
import Input from "../../components/input/input";
import Snackbar from "../../components/snackbar/Snackbar";
import { useNavigate } from "react-router-dom";
import * as Utils from "../../helpers/utils";
import { loginAccount } from "../../controllers/authController";
import Spinner from "../../components/spinner/Spinner";
interface RequiredValue {
  value: string,
  isValid: boolean
}

interface User {
  email: RequiredValue;
  password: RequiredValue;
}


const Login: React.FC = () => {
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarType, setSnackbarType] = useState<'success' | 'error' | 'info'>('info');
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

  const navigate = useNavigate();

  const [userData, setUserData] = useState<User>({
    email: {
      value: "",
      isValid: false
    },
    password: {
      value: "",
      isValid: false
    },
  })

  const inputsType = [
    {
      type: "email",
      placeHolder: "Email",
      name: "email",
      id: "inputLoginEmail",
      ChangeAction: (e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e)
    },
    {
      type: "password",
      placeHolder: "Password",
      name: "password",
      id: "inputLoginPassword",
      ChangeAction: (e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e)
    }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (typeof name !== "string" || !(name in userData)) {
      return
    }

    const MIN_PASSWORD_LENGTH = 6;

    setUserData((prev) => {

      const isValid =
        name === "name"
          ? Utils.validateName(value)
          : name === "email"
            ? Utils.validateEmail(value)
            : name == "password" ? value.length >= MIN_PASSWORD_LENGTH : prev[name as keyof User].isValid;
      return {
        ...prev,
        [name]: {
          ...prev[name as keyof User],
          value: value,
          isValid
        }
      }
    });
  };

  const showSnackbar = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setIsSnackbarOpen(true);
  };


  const handleSnackbarClose = () => {
    setIsSnackbarOpen(false);
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<boolean> => {
    e.preventDefault();
    if (Object.values(userData).every((field) => field.isValid) || loadingSubmit) {
      try {
        setLoadingSubmit(true);
        const loginResponse = await loginAccount({ email: userData.email.value, password: userData.password.value })

        if (!loginResponse.success) {
          console.log("[x] Login error -> ", loginResponse.msg)
          showSnackbar(loginResponse.msg, "error")
          setLoadingSubmit(false);
          return loginResponse.success
        }


        console.log("[x] Account logged successfully :)")
        setLoadingSubmit(false);
        return true;
      } catch (err: any) {
        console.log("[x] Login HandleSubmit error -> ", err);
        showSnackbar("User login failed. Please try again later.", "error")
        setLoadingSubmit(false);
        return false;
      }
    }
    setLoadingSubmit(false);
    return false
  }

  return (
    <div className="flex h-full items-center justify-center min-h-screen bg-main-color px-4">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl">
        <h1 className="text-2xl font-bold text-center text-white mb-6">
          Enter your email
        </h1>
        <form className="flex flex-col space-y-10">
          {inputsType.map((input, index) => {
            return <div className="space-y-1" key={index}>
              <Input
                type={input.type}
                id={input.id}
                inputName={input.name}
                placeholder={input.placeHolder}
                className="bg-steel rounded-xl"
                onChangeAction={input.ChangeAction}></Input>
              <span className="absolute text-error-red">{!userData[input.name as keyof User]?.isValid && userData[input.name as keyof User]?.value.length > 0 ? input.type == "password" ? "The password is not valid or not match" : "The value entered is not valid" : ""}</span>
            </div>
          }
          )}

          <div className="flex flex-col space-y-3">
            <button
              type="button"
              className="w-full py-3 text-gray-200 bg-steel border-steel rounded-xl hover:bg-gray-600 focus:outline-none"
            >
              Login with Google
            </button>
            <button
              type="submit"
              className={`w-full min-h-12 py-3 text-white ${Object.values(userData).every((field) => field.isValid) && !loadingSubmit
                ? 'hover:bg-blue-500 bg-royal-blue' : 'bg-disabled-gray'} focus:outline-none rounded-xl`}
              disabled={!Object.values(userData).every((field) => field.isValid) || loadingSubmit}
              onClick={handleSubmit}
            >
              {loadingSubmit ? <Spinner size={20}></Spinner> : "Login"}
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
      {isSnackbarOpen && (
        <Snackbar
          message={snackbarMessage}
          type={snackbarType}
          onClose={handleSnackbarClose}
          duration={3000}
        />
      )}
    </div>
  );
};

export default Login;