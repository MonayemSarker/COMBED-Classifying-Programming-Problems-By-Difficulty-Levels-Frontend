import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

function Survey() {
  const [surveyId, setSurveyId] = useState("");
  //   const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your logic to handle the survey ID submission, e.g., validation or forwarding to the next step.
    // Example: navigate to the next step page
    // navigate(`/survey/${surveyId}`);
  };

  return (
    <div className="h-[82vh] flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg"
      >
        <div className="mb-5">
          <label
            htmlFor="surveyId"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Survey ID:
          </label>
          <input
            type="text"
            id="surveyId"
            value={surveyId}
            onChange={(e) => setSurveyId(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
        </div>
        <button
          type="submit"
          className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full"
        >
          ➔
        </button>
      </form>
    </div>
  );
}

export default Survey;
