import React, { useState } from "react";
import Input from "../../components/input/input";
import Snackbar from "../../components/snackbar/Snackbar";
import { useNavigate } from "react-router-dom";
import * as Utils from "../../helpers/utils";
import { loginAccount, loginWithGoogle, logout } from "../../controllers/authController";
import { getUserByEmail, createUser } from "../../controllers/userController";
import Spinner from "../../components/spinner/Spinner";
import { auth } from "../../firebase/firebase.config";
import { CiLock } from "react-icons/ci";
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
      }
    }
    return false
  }

  const handleGoogleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<boolean> => {
    e.preventDefault();
    setLoadingSubmit(true);
    try {

      const googleResponse = await loginWithGoogle();

      if (!googleResponse.success || !googleResponse.google.user.email) {
        console.log("[x] Google login error -> ", googleResponse.msg)
        showSnackbar(googleResponse.msg, "error")
        setLoadingSubmit(false);
      }

      const userExists = await getUserByEmail(googleResponse.google.user.email);

      if (!userExists.success && auth.currentUser?.uid) {
        const userToCreate = {
          name: googleResponse.google.user.displayName,
          email: googleResponse.google.user.email,
          contacts: {},
          profilePicture: googleResponse.google.user.photoURL,
          status: "-"
        }

        const userResponse = await createUser(auth.currentUser?.uid, userToCreate);

        if (!userResponse.success) {
          console.log("[x] Google login error -> ", userResponse.msg);
          showSnackbar(userResponse.msg, "error");
          setLoadingSubmit(false);
          await logout();
          return userResponse.success;
        }
      }

      setLoadingSubmit(false);
      return true;
    } catch (err) {
      console.log("[x] Login HandleGoogleSubmit error -> ", err);
      showSnackbar("Google login failed. Please try again later.", "error")
      setLoadingSubmit(false);
    }
    return false;
  }

  return (
    <div className="flex flex-col h-full items-center min-h-screen bg-main-color px-4 py-4 justify-between text-main-gray">
      <form className="flex flex-col space-y-10 max-w-7xl">
        <div className="flex flex-col w-full space-y-10">
          <div className="flex justify-start space-x-5 items-center">
            <img className="w-12 h-12" src="/images/logo.png" alt="logo" />
            <h1 className="text-[22px] font-bold text-center text-white">
              Log in to BlueCrypt
            </h1>
          </div>
          <span>Send private messages to your contacts though BlueCrypt in your browser.</span>
        </div>
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
            className="self-center w-11/12 min-h-12 py-3 text-gray-200 bg-steel border-steel rounded-xl hover:bg-gray-600 focus:outline-none"
            onClick={handleGoogleSubmit}
          >
            {loadingSubmit ? <Spinner size={20}></Spinner> : "Login with Google"}
          </button>
          <button
            type="submit"
            className={`self-center w-11/12 min-h-12 py-3 text-white ${Object.values(userData).every((field) => field.isValid) && !loadingSubmit
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

      <div className="w-full text-center flex justify-center items-center space-x-1 text-sm "><CiLock></CiLock> <span className="justify-center text-sm"> Your personal messages are end-to-end encrypted.</span></div>
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