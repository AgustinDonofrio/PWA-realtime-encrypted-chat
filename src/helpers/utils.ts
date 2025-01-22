import CryptoJS from "crypto-js";

const PASS_MIN_LENGTH = 6;
const NAME_MIN_LENGTH = 3;
const EMAIL_REGEX =
  /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]{1,})+$/;

export const validateEmail = (email: string): boolean | null => {
  return EMAIL_REGEX.test(email);
};

export const validatePassword = (
  password: string,
  repeatedPassword: string
): boolean => {
  if (password.length < PASS_MIN_LENGTH) return false;

  return repeatedPassword === password;
};

export const validateName = (name: string): boolean => {
  if (name.trim().length == 0) return false;

  if (name.length < NAME_MIN_LENGTH) return false;

  return true;
};

export const containsOnlySpaces = (value: string): boolean => {
  return value.trim().length === 0;
};

export const mapAuthCodeToMessage = (authCode: string): string => {
  switch (authCode) {
    case "auth/invalid-email":
      return "Your email address appears to be malformed.";

    case "auth/invalid-password":
      return "Your password is wrong.";

    case "auth/user-not-found":
      return "User doesn't exist.";

    case "auth/uid-already-exists":
      return "User already exists";

    case "auth/invalid-disabled-field":
      return "User has been disabled.";

    case "auth/too-many-requests":
      return "Too many requests. Try again later.";

    case "auth/operation-not-allowed":
      return "Signing in is not enabled.";

    case "auth/invalid-provider-data":
      return "Invalid information provided";

    case "auth/invalid-credential":
      return "Invalid credentials";

    case "auth/email-already-in-use":
      return "The email has already been used";

    case "auth/invalid-login-credentials":
      return "Invalid login credentials";
    default:
      return "Oops! Something went wrong. Please try again later.";
  }
};

// Función para cifrar un mensaje
export const encryptMessage = (message: string): string => {
  const SECRET_KEY = import.meta.env.VITE_CRYPTO_SECRET_KET;

  const ciphertext = CryptoJS.AES.encrypt(message, SECRET_KEY).toString();
  return ciphertext;
};

export const decryptMessage = (ciphertext: string): string => {
  try {
    const SECRET_KEY = import.meta.env.VITE_CRYPTO_SECRET_KET;
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    const originalMessage = bytes.toString(CryptoJS.enc.Utf8);

    return originalMessage;
  } catch (err) {
    return "Error getting message, try again";
  }
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};