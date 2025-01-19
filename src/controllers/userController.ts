import { db } from "../firebase/firebase.config";
import { doc, getDoc, setDoc, addDoc, collection } from "firebase/firestore";
import { mapAuthCodeToMessage } from "../helpers/utils";

interface User {
  name: string;
  email: string;
  contacts: {};
  profilePicture: string | "";
  status: string | "";
  id?: string;
}

interface UserResponse {
  success: boolean;
  msg: string;
}

export const getUserById = async (userId: string) => {
  try {
    const userDocRef = doc(db, "users", userId);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      console.error("Usuario no encontrado");
      return null;
    }

    const userData = userDocSnap.data();
    userData.id = userDocSnap.id;
    return userData;
  } catch (error) {
    console.error("Error getting user", error);
    throw new Error("Can't get the user");
  }
};

export const createUser = async (userData: User): Promise<UserResponse> => {
  const userResponse = {
    success: false,
    msg: "",
  };
  try {
    const docRef = await addDoc(collection(db, "users"), userData);
    userResponse.success = true;
    userResponse.msg = "Usuario creado con éxito";
  } catch (err: any) {
    console.log("Error to create an user ->", err);
    userResponse.success = false;
    userResponse.msg = mapAuthCodeToMessage(err.code);
  }

  return userResponse;
};
