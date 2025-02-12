import { db, auth } from "../firebase/firebase.config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { mapAuthCodeToMessage } from "../helpers/utils";
import { deleteFromIndexedDB, saveToIndexedDB } from "./indexDbHelpers";

interface User {
  name?: string;
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  msg: string;
  data?: User | null | "";
  google?: any;
}

export const createAccount = async (userData: User): Promise<AuthResponse> => {
  const response = {
    success: false,
    msg: "",
  };
  try {
    console.log("[x] Creating user...");
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      userData.password
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

export const loginAccount = async (userData: User): Promise<AuthResponse> => {
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
    saveToIndexedDB("auth", user);
    return response;
  } catch (error: any) {
    console.log("[X] Login user error ->", error);
    response.success = false;
    response.msg = mapAuthCodeToMessage(error.code);
    return response;
  }
};

export const loginWithGoogle = async (): Promise<AuthResponse> => {
  const response = {
    success: false,
    msg: "",
    data: null,
    google: {},
  };

  try {
    console.log("[x] Logging in with Google...");

    // Crea un proveedor de autenticación de Google
    const provider = new GoogleAuthProvider();

    // Muestra un popup para iniciar sesión con Google
    const userCredential = await signInWithPopup(auth, provider);

    response.google = userCredential;
    response.success = true;
    response.msg = "Login with Google successful";
    saveToIndexedDB("auth", userCredential);
    // Devuelve los detalles del usuario autenticado
    return response;
  } catch (error: any) {
    console.log("[X] Login with Google error ->", error);
    response.success = false;
    response.msg = mapAuthCodeToMessage(error.code); // Mapea el error si es necesario
    return response;
  }
};

export const logout = async (): Promise<AuthResponse> => {
  const response = {
    success: true,
    msg: "",
  };
  try {
    await signOut(auth);
    deleteFromIndexedDB("auth");
    return response;
  } catch (err: any) {
    response.success = false;
    response.msg = mapAuthCodeToMessage(err.code); // Mapea el error si es necesario
    return response;
  }
};
