import React, { useState } from "react";
import { apiBaseUrl } from "../../utils/authUtil";

export default function ProblemClassifierPage() {
  const [problemDescription, setProblemDescription] = useState("");
  const [problemSolution, setProblemSolution] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch(`${apiBaseUrl}/model/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: problemDescription,
          code: problemSolution,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to predict problem difficulty");
      }

      const data = await response.json();
      const difficultyMap = ["Easy", "Medium", "Hard"];
      setResult(difficultyMap[data.difficulty_rank]);
    } catch (error) {
      console.error("Error predicting problem difficulty:", error);
      setResult("Error occurred while predicting difficulty");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-white to-blue-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Problem Difficulty Classifier
        </h1>
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-3xl mx-auto">
          <form onSubmit={handleCheck} className="space-y-6">
            <div>
              <label
                htmlFor="problemDescription"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Problem Description
              </label>
              <textarea
                id="problemDescription"
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
                rows={4}
                required
              />
            </div>
            <div>
              <label
                htmlFor="problemSolution"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Problem Solution
              </label>
              <textarea
                id="problemSolution"
                value={problemSolution}
                onChange={(e) => setProblemSolution(e.target.value)}
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
                rows={4}
                required
              />
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 text-white px-6 py-2 rounded-full text-lg font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center shadow-lg"
              >
                {isLoading ? "Checking..." : "Check"}
              </button>
            </div>
          </form>
          {result && (
            <div className="mt-8 p-4 bg-gray-100 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Result:
              </h2>
              <p className="text-lg text-gray-700">
                The problem difficulty is classified as:{" "}
                <span className="font-bold text-blue-600">{result}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
