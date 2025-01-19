import { db } from "../firebase/firebase.config";
import { doc, getDoc } from "firebase/firestore";

interface user {
  name: string;
  email: string;
  contacts: [];
  profilePicture: string;
  status: string;
  id: string;
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
