import React, { useState } from "react";
import Input from "../input/input";
import { getUserByEmail } from "../../controllers/userController";

interface AddContactModalProps {
  onClose: () => void;
  onAddContact: (contactId: string) => void;
}

const AddContactModal: React.FC<AddContactModalProps> = ({ onClose, onAddContact }) => {
  const [email, setEmail] = useState("");
  const [searchResult, setSearchResult] = useState<{ id: string; name: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    setSearchResult(null);

    try {
      const response = await getUserByEmail(email);

      if (response.success && response.data) {
        const { id, name } = response.data as { id: string; name: string };
        setSearchResult({ id, name });
      } else {
        setError("User not found");
      }
    } catch (err) {
      setError("An error occurred while searching for the user.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddContact = () => {
    if (searchResult && searchResult.id) {
      onAddContact(searchResult.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-main-color bg-opacity-80">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold text-center text-white mb-4">
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
        <button
          onClick={handleSearch}
          className="w-full bg-royal-blue p-2 rounded text-white hover:bg-blue-500"
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        {searchResult && (
          <div className="mt-4 p-4 bg-gray-700 rounded text-white">
            <p>Name: {searchResult.name}</p>
            <button
              onClick={handleAddContact}
              className="bg-green-700 p-2 mt-2 w-full rounded text-white hover:bg-green-600"
            >
              Add Contact
            </button>
          </div>
        )}
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