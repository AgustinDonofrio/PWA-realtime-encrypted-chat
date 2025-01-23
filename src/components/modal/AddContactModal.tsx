import React, { useState, useRef, useEffect } from "react";
import Input from "../input/input";
import { getUserByEmail, addContactToUser, getLoggedEmail } from "../../controllers/userController";
import * as Utils from "../../helpers/utils"
import Spinner from "../spinner/Spinner"

interface AddContactModalProps {
  onClose: () => void;
  reloadContactList: () => void;
}

const AddContactModal: React.FC<AddContactModalProps> = ({ onClose, reloadContactList }) => {
  const [email, setEmail] = useState("");
  const [searchResult, setSearchResult] = useState<{ id: string; name: string, email: string, status: string, profilePicture: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loggedEmail = getLoggedEmail();
  const modalRef = useRef<HTMLDivElement>(null);

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    setSearchResult(null);

    try {

      if (!Utils.validateEmail(email)) {
        return setError("Invalid email");
      }

      if (loggedEmail == email) {
        return setError("You can't search yourself");
      }

      setError("");

      const response = await getUserByEmail(email);

      if (response.success && response.data) {
        const { id, name, status, email, profilePicture } = response.data as { id: string; name: string, status: string, email: string, profilePicture: string };

        setSearchResult({ id, name, email, status, profilePicture });
      } else {
        setError("User not found");
      }
    } catch (err) {
      setError("An error occurred while searching for the user.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddContact = async () => {
    if (searchResult && searchResult.id) {
      setLoading(true);
      await addContactToUser({ uid: searchResult.id, name: searchResult.name, status: searchResult.status, email: searchResult.email, contacts: [], profilePicture: searchResult.profilePicture })
      await reloadContactList();
      setLoading(false);
      onClose();
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-main-color bg-opacity-80">
      <div ref={modalRef} className="flex flex-col space-y-3 bg-gray-800 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold text-center text-white">
          Add a New Contact
        </h2>
        <Input
          type="email"
          id="email-input"
          placeholder="Enter email address"
          className="mb-4"
          inputName="email"
          onChangeAction={(e) => setEmail(e.target.value)}
        />
        <div className="p-2">
          {loading && <Spinner></Spinner>}
          {error && <p className="text-red-500 text-center">{error}</p>}
          {searchResult && !loading && (
            <div className="p-4 bg-gray-700 rounded text-white">
              <p>Name: {searchResult.name}</p>
              <button
                onClick={handleAddContact}
                className="bg-green-700 p-2 mt-2 w-full rounded text-white hover:bg-green-600"
              >
                Add Contact
              </button>
            </div>
          )}
        </div>
        <button
          onClick={handleSearch}
          className="w-full bg-royal-blue p-2 rounded text-white hover:bg-blue-500"
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>


        <button
          onClick={onClose}
          className="w-full mt-4 bg-gray-600 p-2 rounded text-white hover:bg-gray-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AddContactModal;