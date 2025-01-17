import { db, auth } from "../firebase/firebase.config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";

interface CreateUserRequest {
  body: {
    email: string;
    password: string;
  };
}

interface CreateUserResponse {
  status: (code: number) => CreateUserResponse;
  json: (body: { code: number; data?: any; errors?: string }) => void;
}

export const createUser = async (
  req: CreateUserRequest,
  res: CreateUserResponse
) => {
  const { email, password } = req.body;

  try {
    console.log("[x] Creating user...");
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    res.status(201).json({ code: 201, data: user });
  } catch (error) {
    console.log("[X] Creation user error ->", error);
    res.status(400).json({ code: 400, errors: (error as Error).message });
  }
};
