import React, { useState } from "react";
import { apiBaseUrl } from "../../utils/authUtil";
import { InformationCircleIcon } from "@heroicons/react/24/solid";

interface Participant {
  id: string;
  email: string;
  name: string;
  designation: string;
  location: string;
  institution: string;
}

export default function AdminParticipantManagement() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [showParticipants, setShowParticipants] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const accessToken = localStorage.getItem("accessToken");
  const [showInfo, setShowInfo] = useState<string | null>(null);

  const [newParticipant, setNewParticipant] = useState({
    email: "",
    name: "",
    designation: "",
    location: "",
    institution: "",
  });

  const handleCreateParticipant = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiBaseUrl}/participants`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(newParticipant),
      });
      if (response.ok) {
        alert("Participant created successfully");
        setNewParticipant({
          email: "",
          name: "",
          designation: "",
          location: "",
          institution: "",
        });
      }
    } catch (error) {
      console.error("Error creating participant:", error);
    }
  };

  const handleShowParticipants = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/participants`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setParticipants(data);
        setShowParticipants(true);
      }
    } catch (error) {
      console.error("Error fetching participants:", error);
    }
  };

  const handleBulkUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(`${apiBaseUrl}/participants/bulk-create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });
      if (response.ok) {
        alert("Participants uploaded successfully");
        setSelectedFile(null);
      }
    } catch (error) {
      console.error("Error uploading participants:", error);
    }
  };

  const InfoPopup = ({
    show,
    onClose,
    title,
    content,
  }: {
    show: boolean;
    onClose: () => void;
    title: string;
    content: string;
  }) => {
    if (!show) return null;

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
          <div className="mt-3 text-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {title}
            </h3>
            <div className="mt-2 px-7 py-3">
              <p className="text-sm text-gray-500">{content}</p>
            </div>
            <div className="items-center px-4 py-3">
              <button
                className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const InputWithInfo = ({
    label,
    id,
    type,
    value,
    onChange,
    info,
  }: {
    label: string;
    id: string;
    type: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    info: string;
  }) => (
    <div className="mb-4">
      <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor={id}
      >
        {label}
      </label>
      <div className="flex items-center">
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          required
        />
        <button
          type="button"
          onClick={() => setShowInfo(id)}
          className="ml-2 text-gray-500 hover:text-gray-700"
          aria-label={`Information about ${label}`}
        >
          <InformationCircleIcon className="h-5 w-5" />
        </button>
      </div>
      <InfoPopup
        show={showInfo === id}
        onClose={() => setShowInfo(null)}
        title={`${label} Information`}
        content={info}
      />
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Participant Management</h2>

      {/* Create Participant Form */}
      <div className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4">
        <h3 className="text-xl font-semibold mb-4">Create New Participant</h3>
        <form onSubmit={handleCreateParticipant}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputWithInfo
              label="Email"
              id="email"
              type="email"
              value={newParticipant.email}
              onChange={(e) =>
                setNewParticipant({ ...newParticipant, email: e.target.value })
              }
              info="Enter the participant's email address. This will be used for communication and login purposes."
            />
            <InputWithInfo
              label="Name"
              id="name"
              type="text"
              value={newParticipant.name}
              onChange={(e) =>
                setNewParticipant({ ...newParticipant, name: e.target.value })
              }
              info="Enter the full name of the participant."
            />
            <InputWithInfo
              label="Designation"
              id="designation"
              type="text"
              value={newParticipant.designation}
              onChange={(e) =>
                setNewParticipant({
                  ...newParticipant,
                  designation: e.target.value,
                })
              }
              info="Enter the participant's job title or role."
            />
            <InputWithInfo
              label="Location"
              id="location"
              type="text"
              value={newParticipant.location}
              onChange={(e) =>
                setNewParticipant({
                  ...newParticipant,
                  location: e.target.value,
                })
              }
              info="Enter the participant's location (e.g., city, country)."
            />
            <InputWithInfo
              label="Institution"
              id="institution"
              type="text"
              value={newParticipant.institution}
              onChange={(e) =>
                setNewParticipant({
                  ...newParticipant,
                  institution: e.target.value,
                })
              }
              info="Enter the name of the institution or organization the participant is affiliated with."
            />
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Create Participant
          </button>
        </form>
      </div>

      {/* Bulk Upload Form */}
      <div className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4">
        <h3 className="text-xl font-semibold mb-4">Bulk Upload Participants</h3>
        <form onSubmit={handleBulkUpload}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="csvFile"
            >
              CSV File
            </label>
            <div className="flex items-center">
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="csvFile"
                type="file"
                accept=".csv"
                onChange={(e) =>
                  setSelectedFile(e.target.files ? e.target.files[0] : null)
                }
                required
              />
              <button
                type="button"
                onClick={() => setShowInfo("csvFile")}
                className="ml-2 text-gray-500 hover:text-gray-700"
                aria-label="Information about CSV file upload"
              >
                <InformationCircleIcon className="h-5 w-5" />
              </button>
            </div>
            <InfoPopup
              show={showInfo === "csvFile"}
              onClose={() => setShowInfo(null)}
              title="CSV File Upload Information"
              content="Upload a CSV file containing participant information. The file should have columns for email, name, designation, location, and institution."
            />
          </div>
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Upload CSV
          </button>
        </form>
      </div>

      {/* Show All Participants Button */}
      <button
        className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={handleShowParticipants}
      >
        Show All Participants
      </button>

      {/* Participants List Modal */}
      {showParticipants && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/5 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                All Participants
              </h3>
              <div className="mt-2 px-7 py-3">
                <div className="grid gap-4">
                  {participants.map((participant) => (
                    <div key={participant.id} className="border-b pb-4">
                      <h4 className="font-bold">{participant.name}</h4>
                      <p className="text-sm text-gray-600">
                        Email: {participant.email}
                      </p>
                      <p className="text-sm text-gray-600">
                        Designation: {participant.designation}
                      </p>
                      <p className="text-sm  text-gray-600">
                        Location: {participant.location}
                      </p>
                      <p className="text-sm text-gray-600">
                        Institution: {participant.institution}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="items-center px-4 py-3">
              <button
                className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                onClick={() => setShowParticipants(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
