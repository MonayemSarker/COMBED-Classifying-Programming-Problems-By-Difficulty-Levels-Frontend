import React, { useState, useEffect } from "react";
import { apiBaseUrl } from "../../utils/authUtil";

interface ProblemSet {
  id: string;
  name: string;
}

interface Survey {
  id: string;
  name: string;
  problemSets: ProblemSet[];
}

export default function AdminSurveyManagement() {
  const accessToken = localStorage.getItem("accessToken");
  const [problemSets, setProblemSets] = useState<ProblemSet[]>([]);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [showSurveys, setShowSurveys] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [newSurvey, setNewSurvey] = useState({
    name: "",
    problemSet_ids: [] as string[],
  });

  useEffect(() => {
    fetchProblemSets();
  }, []);

  const fetchProblemSets = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/problems/sets`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setProblemSets(data);
      }
    } catch (error) {
      console.error("Error fetching problem sets:", error);
    }
  };

  const handleCreateSurvey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newSurvey.problemSet_ids.length === 0) {
      alert("Please select at least one problem set.");
      return;
    }
    try {
      const response = await fetch(`${apiBaseUrl}/surveys`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(newSurvey),
      });
      if (response.ok) {
        alert("Survey created successfully");
        setNewSurvey({ name: "", problemSet_ids: [] });
      }
    } catch (error) {
      console.error("Error creating survey:", error);
    }
  };

  const handleShowSurveys = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/surveys`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setSurveys(data);
        setShowSurveys(true);
      }
    } catch (error) {
      console.error("Error fetching surveys:", error);
    }
  };

  const handleSearchSurvey = async () => {
    if (!searchTerm) return;
    try {
      const response = await fetch(`${apiBaseUrl}surveys/${searchTerm}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setSelectedSurvey(data);
      }
    } catch (error) {
      console.error("Error fetching survey details:", error);
    }
  };

  const handleProblemSetChange = (id: string) => {
    setNewSurvey((prev) => {
      const updatedIds = prev.problemSet_ids.includes(id)
        ? prev.problemSet_ids.filter((setId) => setId !== id)
        : [...prev.problemSet_ids, id];
      return { ...prev, problemSet_ids: updatedIds };
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Survey Management</h2>

      {/* Search Survey */}
      <div className="mb-8 flex justify-center">
        <input
          className="shadow appearance-none border rounded w-64 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
          type="text"
          placeholder="Search survey by name or ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={handleSearchSurvey}
        >
          Search
        </button>
      </div>

      {/* Create Survey Form */}
      <div className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4">
        <h3 className="text-xl font-semibold mb-4">Create a New Survey</h3>
        <form onSubmit={handleCreateSurvey}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="surveyName"
            >
              Survey Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="surveyName"
              type="text"
              value={newSurvey.name}
              onChange={(e) =>
                setNewSurvey({ ...newSurvey, name: e.target.value })
              }
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Problem Sets
            </label>
            <div className="max-h-48 overflow-y-auto">
              {problemSets.map((set) => (
                <div key={set.id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={`problemSet-${set.id}`}
                    value={set.id}
                    checked={newSurvey.problemSet_ids.includes(set.id)}
                    onChange={() => handleProblemSetChange(set.id)}
                    className="mr-2"
                  />
                  <label htmlFor={`problemSet-${set.id}`}>{set.name}</label>
                </div>
              ))}
            </div>
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Create Survey
          </button>
        </form>
      </div>

      {/* Show All Surveys Button */}
      <button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
        onClick={handleShowSurveys}
      >
        Show All Surveys
      </button>

      {/* Surveys List Modal */}
      {showSurveys && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
          id="surveys-modal"
        >
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/5 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                All Surveys
              </h3>
              <div className="mt-2 px-7 py-3">
                <ul className="space-y-4">
                  {surveys.map((survey) => (
                    <li key={survey.id} className="text-left border-b pb-4">
                      <h4 className="font-bold">{survey.name}</h4>
                      <p className="mt-2">
                        Problem Sets:{" "}
                        {survey.problemSets.map((set) => set.name).join(", ")}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="items-center px-4 py-3">
              <button
                className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                onClick={() => setShowSurveys(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Survey Details Modal */}
      {selectedSurvey && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
          id="survey-details-modal"
        >
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/5 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Survey Details
              </h3>
              <div className="mt-2 px-7 py-3 text-left">
                <h4 className="font-bold">{selectedSurvey.name}</h4>
                <p className="mt-2">ID: {selectedSurvey.id}</p>
                <p className="mt-2">Problem Sets:</p>
                <ul className="list-disc list-inside">
                  {selectedSurvey.problemSets.map((set) => (
                    <li key={set.id}>{set.name}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="items-center px-4 py-3">
              <button
                className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                onClick={() => setSelectedSurvey(null)}
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
