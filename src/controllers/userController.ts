import { db, auth } from "../firebase/firebase.config";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  getDocs,
  where,
  onSnapshot,
} from "firebase/firestore";
import { mapAuthCodeToMessage } from "../helpers/utils";
import { uploadToCloudinary } from "./cloudinaryController";

interface User {
  name: string;
  email: string;
  contacts: {};
  profilePicture: string | "";
  status: string | "";
  uid?: string;
}

interface UserResponse {
  success: boolean;
  msg: string;
  data?: User | {};
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

export const getUserByEmail = async (
  userEmail: string
): Promise<UserResponse> => {
  const response = {
    msg: "",
    success: false,
    data: {},
  };
  try {
    const q = query(collection(db, "users"), where("email", "==", userEmail));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.error("User not found");
      response.success = false;
      response.msg = "User not found";
      return response;
    }

    const userDocSnap = querySnapshot.docs[0];
    const userData = userDocSnap.data();
    userData.id = userDocSnap.id;

    response.success = true;
    response.data = userData;
    return response;
  } catch (error: any) {
    console.error("Error getting user", error);
    response.success = false;
    response.msg = mapAuthCodeToMessage(error.code);
    return response;
  }
};

export const createUser = async (
  uid: string,
  userData: User
): Promise<UserResponse> => {
  const userResponse = {
    success: false,
    msg: "",
  };
  try {
    const userRef = doc(collection(db, "users"), uid); // Crea un documento con el UID personalizado
    await setDoc(userRef, userData); // Guarda los datos en el documento

    userResponse.success = true;
    userResponse.msg = "Usuario creado con éxito";
  } catch (err: any) {
    console.log("Error to create an user ->", err);
    userResponse.success = false;
    userResponse.msg = mapAuthCodeToMessage(err.code);
  }

  return userResponse;
};

export const addContactToUser = async (
  userToAdd: User // Usuario a agregar
): Promise<UserResponse> => {
  const response = {
    success: false,
    msg: "",
  };
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      response.msg = "User is not authenticated";
      return response;
    }

    if (!userToAdd) {
      response.msg = "The user to add is empty";
      return response;
    }

    if (!("uid" in userToAdd)) {
      response.msg = "The user to add is invalid";
      return response;
    }

    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      [`contacts.${userToAdd.uid}`]: {
        name: userToAdd.name,
        email: userToAdd.email,
        status: userToAdd.status || "",
        profilePicture: userToAdd.profilePicture || "",
      },
    });

    response.success = true;
    response.msg = "Contact added";
  } catch (error: any) {
    console.error("Error to add contact: ", error);
    response.success = false;
    response.msg = mapAuthCodeToMessage(error.code);
  }

  return response;
};

export const updateProfilePicture = async (file: File, userId: string) => {
  try {
    // Subir imagen a Cloudinary
    const imageUrl = await uploadToCloudinary(file);
    if (!imageUrl) {
      throw new Error("Failed to upload image to Cloudinary");
    }

    // Actualizar el campo `profilePicture` en Firestore
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      profilePicture: imageUrl,
    });

    return { success: true, imageUrl };
  } catch (error) {
    console.error("Error updating profile picture:", error);
    throw error;
  }
};

export const getLoggedEmail = (): string | null | undefined => {
  try {
    return auth.currentUser?.email;
  } catch (err: any) {
    return null;
  }
};

export const subscribeToContacts = (
  userId: string,
  callback: (contacts: { [key: string]: any }) => void
) => {
  try {
    const userRef = doc(db, "users", userId);

    // Escuchar cambios en el documento del usuario
    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        const userData = doc.data();
        const contacts = userData.contacts || {}; // Obtener los contactos del usuario
        callback(contacts); // Llamar al callback con los contactos actualizados
      }
    });

    return unsubscribe; // Retornar la función para desuscribirse
  } catch (error) {
    console.error("Error subscribing to contacts:", error);
    throw error;
  }
};

export const updateUserToken = async (token: string) => {
  try {
    const userId = auth.currentUser?.uid;

    if (!userId) {
      throw new Error("User is not authenticated");
    }

    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      token,
    });

    return true;
  } catch (error) {
    console.error("Error updating user token:", error);
    throw error;
  }
};

export const getUserToken = async (userId: string): Promise<string | null> => {
  try {
    const userDocRef = doc(db, "users", userId);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      console.error("User not found");
      return null;
    }

    const userData = userDocSnap.data();
    return userData.token;
  } catch (error) {
    console.error("Error getting user token:", error);
    return null;
  }
};
