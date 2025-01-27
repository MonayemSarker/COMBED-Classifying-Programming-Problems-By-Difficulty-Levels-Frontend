import React, { useState, useEffect, useRef } from "react";
import { apiBaseUrl } from "../../utils/authUtil";

interface EvaluationResult {
  classification_report: string;
  confusion_matrix: number[][];
}

export default function AdminAdvanceOptions() {
  const [isLoadingRank, setIsLoadingRank] = useState(false);
  const [isLoadingTrain, setIsLoadingTrain] = useState(false);
  const [isLoadingEvaluate, setIsLoadingEvaluate] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [evaluationResult, setEvaluationResult] =
    useState<EvaluationResult | null>(null);
  const [showEvaluationPopup, setShowEvaluationPopup] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setShowEvaluationPopup(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleRankSurveyData = async () => {
    setIsLoadingRank(true);
    try {
      const response = await fetch(`${apiBaseUrl}/problems/rankAttachment`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to rank survey data");
      }

      const data = await response.json();
      if (data.message === "Problem ranking completed successfully") {
        setSuccessMessage("Problem ranking completed successfully");
        setShowSuccessPopup(true);
        setTimeout(() => setShowSuccessPopup(false), 3000);
      }
    } catch (error) {
      console.error("Error ranking survey data:", error);
    } finally {
      setIsLoadingRank(false);
    }
  };

  const handleTrainModel = async () => {
    setIsLoadingTrain(true);
    try {
      const response = await fetch(`${apiBaseUrl}/model/train`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to train model");
      }

      const data = await response.json();
      if (data.status === "Model trained successfully") {
        setSuccessMessage("Model trained successfully");
        setShowSuccessPopup(true);
        setTimeout(() => setShowSuccessPopup(false), 3000);
      }
    } catch (error) {
      console.error("Error training model:", error);
    } finally {
      setIsLoadingTrain(false);
    }
  };

  const handleEvaluateModel = async () => {
    setIsLoadingEvaluate(true);
    try {
      const response = await fetch(`${apiBaseUrl}/model/evaluate`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to evaluate model");
      }

      const data: EvaluationResult = await response.json();
      setEvaluationResult(data);
      setShowEvaluationPopup(true);
    } catch (error) {
      console.error("Error evaluating model:", error);
    } finally {
      setIsLoadingEvaluate(false);
    }
  };

  const renderClassificationReport = () => {
    if (!evaluationResult) return null;
    const lines = evaluationResult.classification_report.split("\n");
    const headers = ["Class", "Precision", "Recall", "F1-Score", "Support"];

    const classRows = lines.slice(2, -4).map((line) => {
      const cells = line.trim().split(/\s+/);
      return {
        Class: cells[0],
        Precision: cells[1],
        Recall: cells[2],
        "F1-Score": cells[3],
        Support: cells[4],
      };
    });

    const accuracyLine = lines.find((line) =>
      line.trim().startsWith("accuracy"),
    );
    const accuracyValues = accuracyLine.trim().split(/\s+/);
    const accuracyRow = {
      Class: "accuracy",
      Precision: accuracyValues[1],
      Recall: "",
      "F1-Score": "",
      Support: accuracyValues[2],
    };

    const allRows = [...classRows, accuracyRow];

    return (
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {allRows.map((row, index) => (
            <tr key={index}>
              {headers.map((header) => (
                <td
                  key={header}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                >
                  {row[header]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="container mx-auto p-4 relative">
      <h2 className="text-2xl font-bold mb-4">Advanced Options</h2>
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="space-y-8">
          <div className="border-b pb-6">
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Rank Survey Data
            </label>
            <p className="text-gray-600 mb-4">
              Click the button below to rank the survey data. This process may
              take a few moments.
            </p>
            <button
              onClick={handleRankSurveyData}
              disabled={isLoadingRank}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-blue-300"
            >
              {isLoadingRank ? "Ranking..." : "Rank Survey Data"}
            </button>
          </div>
          <div className="border-b pb-6">
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Train Model
            </label>
            <p className="text-gray-600 mb-4">
              Click the button below to train the model. This process may take
              several minutes.
            </p>
            <button
              onClick={handleTrainModel}
              disabled={isLoadingTrain}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:bg-green-300"
            >
              {isLoadingTrain ? "Training..." : "Train Model"}
            </button>
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Evaluate Model
            </label>
            <p className="text-gray-600 mb-4">
              Click the button below to evaluate the model and view the
              classification report.
            </p>
            <button
              onClick={handleEvaluateModel}
              disabled={isLoadingEvaluate}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 disabled:bg-purple-300"
            >
              {isLoadingEvaluate ? "Evaluating..." : "Evaluate Model"}
            </button>
          </div>
        </div>
      </div>
      {showSuccessPopup && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 mt-4 z-50">
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-md"
            role="alert"
          >
            <strong className="font-bold">Success!</strong>
            <span className="block sm:inline"> {successMessage}</span>
          </div>
        </div>
      )}
      {showEvaluationPopup && evaluationResult && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
          onClick={() => setShowEvaluationPopup(false)}
        >
          <div
            className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white"
            ref={popupRef}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mt-3">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
                Model Evaluation Results
              </h3>
              <div className="mt-2 px-7 py-3 overflow-x-auto">
                {renderClassificationReport()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
