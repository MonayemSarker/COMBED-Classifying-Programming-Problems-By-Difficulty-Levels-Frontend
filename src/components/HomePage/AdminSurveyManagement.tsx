import React, { useState, useEffect, useCallback } from "react";
import { apiBaseUrl } from "../../utils/authUtil";

interface ProblemSet {
  id: string;
  name: string;
}

interface Survey {
  id: string;
  name: string;
  problemSet_ids: string[];
  created_by: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminSurveyManagement() {
  const accessToken = localStorage.getItem("accessToken");
  const [problemSets, setProblemSets] = useState<ProblemSet[]>([]);
  const [searchResults, setSearchResults] = useState<Survey[]>([]);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const [newSurvey, setNewSurvey] = useState({
    name: "",
    problemSet_ids: [] as string[],
  });

  // Fetch problem sets on component mount
  useEffect(() => {
    fetchProblemSets();
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const response = await fetch(
          `${apiBaseUrl}/surveys?name=${encodeURIComponent(query)}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data);
        }
      } catch (error) {
        console.error("Error searching surveys:", error);
      } finally {
        setIsSearching(false);
      }
    },
    [accessToken]
  );

  // Handle search input changes with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      debouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, debouncedSearch]);

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

  const handleSurveyClick = async (surveyId: string) => {
    try {
      const response = await fetch(`${apiBaseUrl}/surveys/${surveyId}`, {
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

      {/* Real-time Search */}
      <div className="mb-8">
        <div className="max-w-xl mx-auto">
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="Search surveys by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Search Results */}
          {searchTerm && (
            <div className="mt-2 bg-white rounded-lg shadow-lg">
              {isSearching ? (
                <div className="p-4 text-center text-gray-500">
                  Searching...
                </div>
              ) : searchResults.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {searchResults.map((survey) => (
                    <li
                      key={survey.id}
                      onClick={() => handleSurveyClick(survey.id)}
                      className="p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                    >
                      <h4 className="font-medium text-gray-900">
                        {survey.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Created:{" "}
                        {new Date(survey.createdAt).toLocaleDateString()}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No such survey available
                </div>
              )}
            </div>
          )}
        </div>
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

      {/* Survey Details Modal */}
      {selectedSurvey && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/5 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Survey Details
              </h3>
              <div className="mt-2 space-y-4">
                <div>
                  <h4 className="font-bold text-lg">{selectedSurvey.name}</h4>
                  <p className="text-sm text-gray-500">
                    ID: {selectedSurvey.id}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Problem Set IDs:</p>
                  <ul className="list-disc list-inside">
                    {selectedSurvey.problemSet_ids.map((id) => (
                      <li key={id} className="text-sm text-gray-600">
                        {id}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="text-sm text-gray-600">
                  <p>Created by: {selectedSurvey.created_by}</p>
                  <p>
                    Created:{" "}
                    {new Date(selectedSurvey.createdAt).toLocaleString()}
                  </p>
                  <p>
                    Updated:{" "}
                    {new Date(selectedSurvey.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-5">
              <button
                className="w-full px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
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
