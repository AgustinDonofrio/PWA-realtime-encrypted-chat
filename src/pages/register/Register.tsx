import React, { useState } from "react";
import Input from "../../components/input/input";
import Snackbar from "../../components/snackbar/Snackbar";
import Spinner from "../../components/spinner/Spinner";
import * as Utils from "../../helpers/utils"
import { useNavigate, } from "react-router-dom";
import { createAccount } from "../../controllers/authController"
import { createUser } from "../../controllers/userController"
import { auth } from "../../firebase/firebase.config"
import { CiLock } from "react-icons/ci";

interface RequiredValue {
    value: string,
    isValid: boolean
}

interface User {
    name: RequiredValue;
    email: RequiredValue;
    password: RequiredValue;
}

const Register: React.FC = () => {

    const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>('');
    const [snackbarType, setSnackbarType] = useState<'success' | 'error' | 'info'>('info');
    const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false)

    const [userData, setUserData] = useState<User>({
        name: {
            value: "",
            isValid: false
        },
        email: {
            value: "",
            isValid: false
        },
        password: {
            value: "",
            isValid: false
        },
    })
    const [repeatedPassword, setRepeatedPassword] = useState<RequiredValue>({
        value: "",
        isValid: false
    })

    const navigate = useNavigate();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (typeof name !== "string" || !(name in userData)) {
            return
        }

        setUserData((prev) => {

            const isValid =
                name === "name"
                    ? Utils.validateName(value)
                    : name === "email"
                        ? Utils.validateEmail(value)
                        : name == "password" ? Utils.validatePassword(value, repeatedPassword.value) : prev[name as keyof User].isValid;
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

    const inputsType = [
        {
            type: "text",
            placeHolder: "Name",
            name: "name",
            id: "inputRegisterName",
            ChangeAction: (e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e)
        },
        {
            type: "email",
            placeHolder: "Email",
            name: "email",
            id: "inputRegisterEmail",
            ChangeAction: (e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e)
        },
        {
            type: "password",
            placeHolder: "Password",
            name: "password",
            id: "inputRegisterPassword",
            ChangeAction: (e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e)
        }
        , {
            type: "password",
            placeHolder: "Repeat password",
            name: "repeatedPassword",
            id: "inputRegisterRepeatPassword",
            ChangeAction: (e: React.ChangeEvent<HTMLInputElement>) => handleRepeatedPasswordChange(e)
        }
    ]

    const handleRepeatedPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRepeatedPassword({
            value: e.target.value,
            isValid: Utils.validatePassword(userData.password.value, e.target.value),
        });
        setUserData((prev) => ({
            ...prev,
            password: {
                ...prev.password,
                isValid: Utils.validatePassword(prev.password.value, e.target.value),
            },
        }));
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
                const registerResponse = await createAccount({ name: userData.name.value, email: userData.email.value, password: userData.password.value })

                if (!registerResponse.success) {
                    console.log("[x] Register error -> ", registerResponse.msg)
                    showSnackbar(registerResponse.msg, "error")
                    setLoadingSubmit(false);
                    return registerResponse.success
                }

                const userToCreate = {
                    name: userData.name.value,
                    email: userData.email.value,
                    contacts: {},
                    status: "-",
                    profilePicture: ""
                }

                if (!auth.currentUser?.uid) {
                    showSnackbar("User registration failed. Please try again later.", "error")
                    setLoadingSubmit(false);
                    return false
                }

                const createUserResponse = await createUser(auth.currentUser?.uid, userToCreate);

                if (!createUserResponse.success) {
                    console.log("[x] Register error -> ", createUserResponse.msg);
                    showSnackbar(registerResponse.msg, "error");
                    setLoadingSubmit(false);
                    return createUserResponse.success;
                }

                console.log("[x] Account created successfully :)")
                setLoadingSubmit(false);
                return true;
            } catch (err: any) {
                console.log("[x] HandleSubmit error -> ", err);
                showSnackbar("User registration failed. Please try again later.", "error")
                setLoadingSubmit(false);
                return false;
            }
        }
        setLoadingSubmit(false);
        return false
    }
    return (
        <div className="flex flex-col h-full items-center min-h-screen bg-main-color px-4 py-4 justify-between text-main-gray">
            <form className="flex flex-col space-y-10 w-full">
                <div className="flex flex-col w-full space-y-10">
                    <div className="flex justify-start space-x-5 items-center">
                        <img className="w-12 h-12" src="/images/logo.png" alt="logo" />
                        <h1 className="text-[22px] font-bold text-center text-white">
                            Register  to BlueCrypt
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
                        type="submit"
                        className={`w-11/12 self-center min-h-12 py-3 text-white ${Object.values(userData).every((field) => field.isValid) && !loadingSubmit
                            ? 'hover:bg-blue-500 bg-royal-blue' : 'bg-disabled-gray'} focus:outline-none rounded-xl`}
                        disabled={!Object.values(userData).every((field) => field.isValid) || loadingSubmit}
                        onClick={handleSubmit}
                    >
                        {loadingSubmit ? <Spinner size={20}></Spinner> : "Register"}
                    </button>

                    <div className="text-center text-gray-400">
                        <p className="text-sm">
                            Do you have an account?{" "}
                            <a href="#" onClick={() => { navigate("/") }} className="font-medium text-blue-500 hover:underline">
                                Login
                            </a>
                        </p>
                    </div>
                </div>

            </form>

            <div className="w-full text-center flex justify-center items-center space-x-1 text-sm "><CiLock></CiLock> <span className="justify-center text-sm"> Your personal messages are end-to-end encrypted.</span></div>
            {
                isSnackbarOpen && (
                    <Snackbar
                        message={snackbarMessage}
                        type={snackbarType}
                        onClose={handleSnackbarClose}
                        duration={3000}
                    />
                )
            }

        </div >
    );
};

export default Register;