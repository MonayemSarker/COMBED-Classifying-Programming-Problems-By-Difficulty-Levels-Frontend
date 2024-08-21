import { useState } from "react";

const problems = [
  "Problem 1: Sorting an array. Lorem ipsum dolor sit amet.",
  "Problem 2: Finding the maximum subarray sum.",
  "Problem 3: Implementing a binary search algorithm.",
  "Problem 4: Solving the knapsack problem.",
  "Problem 5: Designing a RESTful API.",
  "Problem 6: Creating a responsive web layout.",
];

function ProblemComparison() {
  const [currentPair, setCurrentPair] = useState<number>(0);
  const [selectedProblem, setSelectedProblem] = useState<string | null>(null);

  const handleProblemClick = (problem: string) => {
    setSelectedProblem(problem);
    console.log("Selected Problem:", problem);
    if (currentPair < problems.length - 2) {
      setCurrentPair(currentPair + 2);
    } else {
      setCurrentPair(-1); // Indicates the end of the problems array
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      {currentPair === -1 ? (
        <h1 className="text-2xl font-semibold text-center">
          Thank you for participating!
        </h1>
      ) : (
        <>
          <h1 className="text-xl font-semibold text-center mb-8">
            Which problem is more difficult between the given scenarios?
          </h1>
          <div className="flex space-x-8">
            <div
              className="max-w-xs p-6 bg-white rounded-lg shadow-md cursor-pointer hover:bg-blue-100"
              onClick={() => handleProblemClick(problems[currentPair])}
            >
              <p className="text-lg text-center">{problems[currentPair]}</p>
            </div>
            <div
              className="max-w-xs p-6 bg-white rounded-lg shadow-md cursor-pointer hover:bg-blue-100"
              onClick={() => handleProblemClick(problems[currentPair + 1])}
            >
              <p className="text-lg text-center">{problems[currentPair + 1]}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ProblemComparison;
