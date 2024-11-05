import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiBaseUrl } from "../../utils/authUtil";

interface ProblemPair {
  id: string;
  surveyParticipants_id: string;
  problem_1_id: string;
  problem_2_id: string;
  difficult_problem_id: string | null;
  createdAt: string;
}

interface ProblemDetails {
  id: string;
  description: string;
  code: string;
}

function ProblemComparison() {
  const location = useLocation();
  const navigate = useNavigate();
  const [problemPairs, setProblemPairs] = useState<ProblemPair[]>([]);
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  const [problem1Details, setProblem1Details] = useState<ProblemDetails | null>(
    null
  );
  const [problem2Details, setProblem2Details] = useState<ProblemDetails | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSurveyCompleted, setIsSurveyCompleted] = useState(false);

  useEffect(() => {
    const pairs = location.state?.problemPairs as ProblemPair[];
    if (!pairs || pairs.length == 0) {
      navigate("/survey");
    } else {
      const incompletePairs = pairs.filter(
        (pair) => pair.difficult_problem_id === null
      );
      setProblemPairs(incompletePairs);
      console.log(incompletePairs);

      if (incompletePairs.length == 0) {
        setIsSurveyCompleted(true);
        setIsLoading(false);
      }
    }
  }, [location.state, navigate]);

  useEffect(() => {
    if (problemPairs.length > 0 && currentPairIndex < problemPairs.length) {
      fetchProblemDetails();
    }
  }, [problemPairs, currentPairIndex]);

  const fetchProblemDetails = async () => {
    setIsLoading(true);
    setError(null);
    const currentPair = problemPairs[currentPairIndex];

    try {
      const [problem1Response, problem2Response] = await Promise.all([
        fetch(`${apiBaseUrl}/problems/${currentPair.problem_1_id}`),
        fetch(`${apiBaseUrl}/problems/${currentPair.problem_2_id}`),
      ]);

      if (!problem1Response.ok || !problem2Response.ok) {
        throw new Error("Failed to fetch problem details");
      }

      const problem1Data = await problem1Response.json();
      const problem2Data = await problem2Response.json();

      setProblem1Details(problem1Data);
      setProblem2Details(problem2Data);
    } catch (err) {
      setError("An error occurred while fetching problem details");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProblemClick = async (problemId: string) => {
    try {
      const response = await fetch(`${apiBaseUrl}/surveys/update-difficulty`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pairId: problemPairs[currentPairIndex].id,
          difficultProblemId: problemId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update difficulty");
      }

      // Move to the next pair
      if (currentPairIndex < problemPairs.length - 1) {
        setCurrentPairIndex(currentPairIndex + 1);
      } else {
        // All pairs have been compared
        setIsSurveyCompleted(true);
      }
    } catch (err) {
      setError("An error occurred while updating difficulty");
      console.error(err);
    }
  };

  if (isLoading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  if (isSurveyCompleted) {
    return (
      <div className="text-center mt-8 text-2xl font-semibold">
        This survey is completed. Thank you for participating!
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-8">
        Select Comparatively difficult problem by clicking on them
      </h1>
      <div className="flex flex-col md:flex-row justify-between space-y-8 md:space-y-0 md:space-x-8">
        {problem1Details && (
          <div className="w-full md:w-1/2 space-y-4">
            <div
              className="bg-green-50 p-6 rounded-lg shadow-md cursor-pointer hover:bg-green-100 transition-colors duration-200"
              onClick={() => handleProblemClick(problem1Details.id)}
            >
              <h2 className="text-xl font-semibold mb-4">
                Problem 1 Description
              </h2>
              <p>{problem1Details.description}</p>
            </div>
            <div
              className="bg-green-50 p-6 rounded-lg shadow-md cursor-pointer hover:bg-green-100 transition-colors duration-200"
              onClick={() => handleProblemClick(problem1Details.id)}
            >
              <h2 className="text-xl font-semibold mb-4">Problem 1 Code</h2>
              <pre className="bg-white p-4 rounded overflow-x-auto">
                <code>{problem1Details.code}</code>
              </pre>
            </div>
          </div>
        )}
        {problem2Details && (
          <div className="w-full md:w-1/2 space-y-4">
            <div
              className="bg-blue-50 p-6 rounded-lg shadow-md cursor-pointer hover:bg-blue-100 transition-colors duration-200"
              onClick={() => handleProblemClick(problem2Details.id)}
            >
              <h2 className="text-xl font-semibold mb-4">
                Problem 2 Description
              </h2>
              <p>{problem2Details.description}</p>
            </div>
            <div
              className="bg-blue-50 p-6 rounded-lg shadow-md cursor-pointer hover:bg-blue-100 transition-colors duration-200"
              onClick={() => handleProblemClick(problem2Details.id)}
            >
              <h2 className="text-xl font-semibold mb-4">Problem 2 Code</h2>
              <pre className="bg-white p-4 rounded overflow-x-auto">
                <code>{problem2Details.code}</code>
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProblemComparison;
