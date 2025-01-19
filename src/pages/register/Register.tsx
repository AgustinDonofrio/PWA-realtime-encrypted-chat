import React, { useState } from "react";
import Input from "../../components/input/input";
import * as Utils from "../../helpers/utils"
import { useNavigate, } from "react-router-dom";
import { createAccount } from "../../controllers/authController"
import { createUser } from "../../controllers/userController"

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


    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<boolean> => {
        e.preventDefault()
        try {
            const registerResponse = await createAccount({ name: userData.name.value, email: userData.email.value, password: userData.password.value })

            if (!registerResponse.success) {
                console.log("[x] Register error -> ", registerResponse.msg)
                return registerResponse.success
            }

            const userToCreate = {
                name: userData.name.value,
                email: userData.email.value,
                contacts: {},
                status: "-",
                profilePicture: ""
            }

            const createUserResponse = await createUser(userToCreate);

            if (!createUserResponse.success) {
                console.log("[x] Register error -> ", createUserResponse.msg);
                return createUserResponse.success;
            }

            console.log("[x] Account created successfully :)")
            return true;
        } catch (err) {
            console.log("[x] HandleSubmit error -> ", err);
            return false;
        }
    }
    return (
        <div className="flex h-full items-center justify-center min-h-screen bg-main-color px-4">
            <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl">
                <h1 className="text-2xl font-bold text-center text-white mb-6">
                    Create an account
                </h1>
                <form className="flex flex-col space-y-10">
                    {inputsType.map((input, index) => {
                        return <div className="space-y-1">
                            <Input
                                key={index}
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
                            className={`w-full py-3 text-white ${Object.values(userData).every((field) => field.isValid)
                                ? 'hover:bg-blue-500 bg-royal-blue' : 'bg-disabled-gray'} focus:outline-none rounded-xl`}
                            disabled={!Object.values(userData).every((field) => field.isValid)}
                            onClick={handleSubmit}
                        >
                            Register
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

            </div>
        </div>
    );
};

export default Register;