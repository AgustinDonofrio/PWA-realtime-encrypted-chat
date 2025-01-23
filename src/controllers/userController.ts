import { db, auth } from "../firebase/firebase.config";
import {
  doc,
  getDoc,
  setDoc,
  addDoc,
  collection,
  query,
  getDocs,
  where,
  updateDoc,
} from "firebase/firestore";
import { mapAuthCodeToMessage } from "../helpers/utils";

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
  userEmail: string // Email del usuario al que se añadirá el contacto
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
    // Buscar al usuario a agregar por su email
    const userResponse = await getUserByEmail(userEmail);

    if (!userResponse.success) {
      response.msg = "The user searched doesn't exists";
      console.error(response.msg);
      return response;
    }

    const contactData = userResponse.data as User;

    if (!contactData) {
      response.msg = "The user searched doesn't exists";
      return response;
    }

    if (!("id" in contactData)) {
      response.msg = "The user searched doesn't exists";
      return response;
    }

    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      [`contacts.${contactData?.id}`]: {
        name: contactData?.name,
        email: contactData?.email,
        status: contactData?.status || "",
        profilePicture: contactData?.profilePicture || "",
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
