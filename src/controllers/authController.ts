import { db, auth } from "../firebase/firebase.config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { mapAuthCodeToMessage } from "../helpers/utils";
import bcrypt from "bcryptjs";
interface user {
  name: string;
  email: string;
  password: string;
}

interface authResponse {
  success: boolean;
  msg: string;
}

export const createAccount = async (userData: user): Promise<authResponse> => {
  const response = {
    success: false,
    msg: "",
  };
  try {
    console.log("[x] Creating user...");
    const hashedPassword = bcrypt.hashSync(userData.password, 10);
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      hashedPassword
    );
    const user = userCredential.user;
    response.success = true;
    response.msg = "User created successfuly";
    return response;
  } catch (error: any) {
    console.log("[X] Creation user error ->", error);
    response.success = false;
    response.msg = mapAuthCodeToMessage(error.code);
    return response;
  }
};

export const loginUser = async (userData: user): Promise<authResponse> => {
  const response = {
    success: false,
    msg: "",
  };
  try {
    const userLogged = await signInWithEmailAndPassword(
      auth,
      userData.email,
      userData.password
    );
    const user = userLogged.user;
    response.success = true;
    response.msg = "User logged successfuly";
    return response;
  } catch (error: any) {
    console.log("[X] Login user error ->", error);
    response.success = false;
    response.msg = mapAuthCodeToMessage(error.code);
    return response;
  }
};
