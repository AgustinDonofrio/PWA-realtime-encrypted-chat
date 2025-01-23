import React, { useState } from "react";
import Input from "../input/input";
import { getUserByEmail, addContactToUser } from "../../controllers/userController";
import Spinner from "../spinner/Spinner"

interface AddContactModalProps {
  onClose: () => void;
  onAddContact: (contactId: string) => void;
}

const AddContactModal: React.FC<AddContactModalProps> = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [searchResult, setSearchResult] = useState<{ id: string; name: string, email: string, status: string, profilePicture: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    setSearchResult(null);

    try {
      const response = await getUserByEmail(email);

      if (response.success && response.data) {
        const { id, name, status, email, profilePicture } = response.data as { id: string; name: string, status: string, email: string, profilePicture: string };

        console.log(profilePicture)
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
      await addContactToUser({ uid: searchResult.id, name: searchResult.name, status: searchResult.status, email: searchResult.email, contacts: [], profilePicture: searchResult.profilePicture })
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-main-color bg-opacity-80">
      <div className="flex flex-col space-y-3 bg-gray-800 p-6 rounded-lg shadow-lg w-96">
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
          {searchResult && (
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