import React, { useState, useEffect } from "react";
import { apiBaseUrl } from "../../utils/authUtil";

interface Problem {
  id: string;
  description: string;
  code: string;
  initial_score: number;
}

interface ProblemSet {
  id: string;
  name: string;
}

export default function AdminManageProblems() {
  const accessToken = localStorage.getItem("accessToken");
  const [problems, setProblems] = useState<Problem[]>([]);
  const [problemSets, setProblemSets] = useState<ProblemSet[]>([]);
  const [showProblems, setShowProblems] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedProblemSetId, setSelectedProblemSetId] = useState<string>("");

  const [newProblem, setNewProblem] = useState({
    problemSet_id: "",
    description: "",
    code: "",
    initial_score: "Easy",
  });

  const [newProblemSet, setNewProblemSet] = useState({
    name: "",
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

  const handleCreateProblem = async (e: React.FormEvent) => {
    e.preventDefault();
    const scoreMappings = { Easy: 0, Medium: 1, Hard: 2 };
    const problemData = {
      ...newProblem,
      initial_score:
        scoreMappings[newProblem.initial_score as keyof typeof scoreMappings],
    };
    try {
      const response = await fetch(`${apiBaseUrl}/problems`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(problemData),
      });
      if (response.ok) {
        alert("Problem created successfully");
        setNewProblem({
          problemSet_id: "",
          description: "",
          code: "",
          initial_score: "Easy",
        });
      }
    } catch (error) {
      console.error("Error creating problem:", error);
    }
  };

  const handleCreateProblemSet = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiBaseUrl}/problems/set`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(newProblemSet),
      });
      if (response.ok) {
        alert("Problem set created successfully");
        setNewProblemSet({ name: "" });
        fetchProblemSets();
      }
    } catch (error) {
      console.error("Error creating problem set:", error);
    }
  };

  const handleShowProblems = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/problems`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setProblems(data);
        setShowProblems(true);
      }
    } catch (error) {
      console.error("Error fetching problems:", error);
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !selectedProblemSetId) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(
        `${apiBaseUrl}/problems/set/${selectedProblemSetId}/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        }
      );
      if (response.ok) {
        alert("CSV file uploaded successfully");
        setSelectedFile(null);
        setSelectedProblemSetId("");
      }
    } catch (error) {
      console.error("Error uploading CSV:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Problems</h1>

      {/* Create Problem Form */}
      <div className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4">
        <h2 className="text-xl font-semibold mb-4">Create a New Problem</h2>
        <form onSubmit={handleCreateProblem}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="problemSetSelect"
            >
              Select Problem Set
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="problemSetSelect"
              value={selectedProblemSetId}
              onChange={(e) => setSelectedProblemSetId(e.target.value)}
              required
            >
              <option value="">Select a Problem Set</option>
              {problemSets.map((set) => (
                <option key={set.id} value={set.id}>
                  {set.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="description"
            >
              Problem Description
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="description"
              value={newProblem.description}
              onChange={(e) =>
                setNewProblem({ ...newProblem, description: e.target.value })
              }
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="code"
            >
              Solution Code
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="code"
              value={newProblem.code}
              onChange={(e) =>
                setNewProblem({ ...newProblem, code: e.target.value })
              }
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="initial_score"
            >
              Initial Score
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="initial_score"
              value={newProblem.initial_score}
              onChange={(e) =>
                setNewProblem({ ...newProblem, initial_score: e.target.value })
              }
              required
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Create Problem
          </button>
        </form>
      </div>

      {/* Create Problem Set Form */}
      <div className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4">
        <h2 className="text-xl font-semibold mb-4">Create A Problem Set</h2>
        <form onSubmit={handleCreateProblemSet}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              value={newProblemSet.name}
              onChange={(e) =>
                setNewProblemSet({ ...newProblemSet, name: e.target.value })
              }
              required
            />
          </div>
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Create Problem Set
          </button>
        </form>
      </div>

      {/* CSV Upload Form */}
      <div className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4">
        <h2 className="text-xl font-semibold mb-4">
          Upload CSV for Problem Set
        </h2>
        <form onSubmit={handleFileUpload}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="problemSetSelect"
            >
              Select Problem Set
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="problemSetSelect"
              value={selectedProblemSetId}
              onChange={(e) => setSelectedProblemSetId(e.target.value)}
              required
            >
              <option value="">Select a Problem Set</option>
              {problemSets.map((set) => (
                <option key={set.id} value={set.id}>
                  {set.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="csvFile"
            >
              CSV File
            </label>
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
          </div>
          <button
            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Upload CSV
          </button>
        </form>
      </div>

      {/* Show All Problems Button */}
      <button
        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={handleShowProblems}
      >
        Show All Problems
      </button>

      {/* Problems List Modal */}
      {showProblems && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
          id="my-modal"
        >
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/5 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                All Problems
              </h3>
              <div className="mt-2 px-7 py-3">
                <ul className="space-y-4">
                  {problems.map((problem) => (
                    <li key={problem.id} className="text-left border-b pb-4">
                      <h4 className="font-bold">{problem.description}</h4>
                      <pre className="mt-2 bg-gray-100 p-2 rounded text-sm overflow-x-auto">
                        {problem.code}
                      </pre>
                      <p className="mt-2">
                        Initial Score:{" "}
                        {problem.initial_score === 0
                          ? "Easy"
                          : problem.initial_score === 1
                          ? "Medium"
                          : "Hard"}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="items-center px-4 py-3">
              <button
                id="ok-btn"
                className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                onClick={() => setShowProblems(false)}
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
