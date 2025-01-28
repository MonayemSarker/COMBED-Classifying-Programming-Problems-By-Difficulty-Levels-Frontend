import React, { useState, useEffect, useCallback } from "react";
import { apiBaseUrl } from "../../utils/authUtil";
import { InformationCircleIcon } from "@heroicons/react/24/solid";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

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

interface SurveyStats {
  problemSetNames: string[];
  participantStats: {
    notStarted: number;
    inProgress: number;
    finished: number;
    participantsCount: number;
  };
}

export default function AdminSurveyManagement() {
  const accessToken = localStorage.getItem("accessToken");
  const [problemSets, setProblemSets] = useState<ProblemSet[]>([]);
  const [searchResults, setSearchResults] = useState<Survey[]>([]);
  const [selectedSurvey, setSelectedSurvey] = useState<SurveyStats | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showSurveyNameInfo, setShowSurveyNameInfo] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  const [newSurvey, setNewSurvey] = useState({
    name: "",
    problemSet_ids: [] as string[],
  });

  useEffect(() => {
    fetchProblemSets();
  }, []);

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
          },
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
    [accessToken],
  );

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
    setIsLoadingDetails(true);
    try {
      const response = await fetch(`${apiBaseUrl}/surveys/stats/${surveyId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.ok) {
        const data: SurveyStats = await response.json();
        setSelectedSurvey(data);
      }
    } catch (error) {
      console.error("Error fetching survey details:", error);
    } finally {
      setIsLoadingDetails(false);
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

  const InfoPopup = ({
    show,
    onClose,
    content,
  }: {
    show: boolean;
    onClose: () => void;
    content: string;
  }) => {
    if (!show) return null;
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
          <div className="mt-3 text-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Survey Name Information
            </h3>
            <div className="mt-2 px-7 py-3">
              <p className="text-sm text-gray-500">{content}</p>
            </div>
            <div className="items-center px-4 py-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ParticipantStatsPieChart = ({
    stats,
  }: {
    stats: SurveyStats["participantStats"];
  }) => {
    const data = [
      { name: "Not Started", value: stats.notStarted },
      { name: "In Progress", value: stats.inProgress },
      { name: "Finished", value: stats.finished },
    ];

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
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
            <div className="flex items-center">
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
              <button
                type="button"
                onClick={() => setShowSurveyNameInfo(true)}
                className="ml-2 text-gray-500 hover:text-gray-700"
                aria-label="Information about Survey Name"
              >
                <InformationCircleIcon className="h-5 w-5" />
              </button>
            </div>
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
            {isLoadingDetails ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              </div>
            ) : (
              <div className="mt-3">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-gray-900">
                    Survey Details
                  </h3>
                  <button
                    onClick={() => setSelectedSurvey(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div className="mt-4 space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">
                      Problem Sets:
                    </h4>
                    <ul className="space-y-2">
                      {selectedSurvey.problemSetNames.map((name, index) => (
                        <li key={index} className="text-sm text-gray-600">
                          {name}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">
                      Participant Statistics:
                    </h4>
                    <ParticipantStatsPieChart
                      stats={selectedSurvey.participantStats}
                    />
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Total Participants:
                        </p>
                        <p className="text-lg font-semibold text-gray-700">
                          {selectedSurvey.participantStats.participantsCount}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Not Started:
                        </p>
                        <p className="text-lg font-semibold text-gray-700">
                          {selectedSurvey.participantStats.notStarted}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          In Progress:
                        </p>
                        <p className="text-lg font-semibold text-gray-700">
                          {selectedSurvey.participantStats.inProgress}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Finished:
                        </p>
                        <p className="text-lg font-semibold text-gray-700">
                          {selectedSurvey.participantStats.finished}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <InfoPopup
        show={showInfo}
        onClose={() => setShowInfo(false)}
        content="To create a new survey, please provide a survey name and select at least one problem set. The selected problem sets will determine the problems included in your survey."
      />
      <InfoPopup
        show={showSurveyNameInfo}
        onClose={() => setShowSurveyNameInfo(false)}
        content="Please provide a descriptive name for your survey. After entering the survey name, select at least one problem set from the options below to include in your survey."
      />
    </div>
  );
}
