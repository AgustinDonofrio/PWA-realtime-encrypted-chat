import React, { useState, useEffect } from "react";
import Input from "../../components/input/input";
import * as Utils from "../../helpers/utils"

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
    const [repeatedPassword, setRepeatedPassword] = useState<string>("")

    const validateName = (value: string): boolean => {
        return value.length > 0;
    };

    const validateEmail = (value: string): boolean => {
        return value.includes("@");
    };


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
                        : name === "password"
                            ? Utils.validatePassword(value, repeatedPassword)
                            : prev[name as keyof User].isValid;
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
            ChangeAction: (e: React.ChangeEvent<HTMLInputElement>) => setRepeatedPassword(e.target.value)
        }
    ]

    useEffect(() => {
        console.log("Estoy entrando en cada cambio del repeated XD", userData.password.value, repeatedPassword)
        setUserData((prev) => ({
            ...prev,
            password: {
                ...prev.password,
                isValid: Utils.validatePassword(prev.password.value, repeatedPassword),
            },
        }));
        console.log("Estoy saliendo en cada cambio del repeated XD", userData.password.value, repeatedPassword)
        console.log(userData)
    }, [repeatedPassword])

    return (
        <div className="flex h-full items-center justify-center min-h-screen bg-main-color px-4">
            <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl">
                <h1 className="text-2xl font-bold text-center text-white mb-6">
                    Create an account
                </h1>
                <form className="flex flex-col space-y-6">
                    {inputsType.map((input, index) => {
                        return <Input
                            key={index}
                            type={input.type}
                            id={input.id}
                            inputName={input.name}
                            placeholder={input.placeHolder}
                            className="bg-steel rounded-xl"
                            onChangeAction={input.ChangeAction}></Input>
                    }
                    )}

                    <div className="flex flex-col space-y-3">
                        <button
                            type="submit"
                            className="w-full py-3 text-white bg-royal-blue rounded-xl hover:bg-blue-500 focus:outline-none"
                        >
                            Register
                        </button>

                        <div className="text-center text-gray-400">
                            <p className="text-sm">
                                Do you have an account?{" "}
                                <a href="#" className="font-medium text-blue-500 hover:underline">
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