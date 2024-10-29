import { useState } from "react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("profile");

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    {
      id: "profile",
      label: "Profile",
      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    },
    {
      id: "manage-problems",
      label: "Manage Problems",
      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
    },
    {
      id: "survey-management",
      label: "Survey Management",
      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M15 13l-3 3m0 0l-3-3m3 3V8",
    },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "w-64" : "w-16"
        } bg-gray-800 text-white transition-all duration-300 ease-in-out flex flex-col`}
      >
        <div className="flex items-center justify-between p-4">
          <h2
            className={`text-lg font-semibold ${isOpen ? "block" : "hidden"}`}
          >
            Admin Options
          </h2>
          <button
            onClick={toggleSidebar}
            className="text-white focus:outline-none focus:ring-2 focus:ring-white rounded-md"
            aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
          >
            {isOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 5l7 7-7 7M5 5l7 7-7 7"
                />
              </svg>
            )}
          </button>
        </div>
        <hr className="border-gray-600 my-4" />
        <nav className="flex-grow">
          <ul className="space-y-2 px-2">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`/${item.id}`}
                  className={`flex items-center py-2 px-4 rounded transition-colors duration-200 ${
                    activeSection === item.id
                      ? "bg-gray-700 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                  onClick={() => setActiveSection(item.id)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={item.icon}
                    />
                  </svg>
                  <span className={isOpen ? "block" : "hidden"}>
                    {item.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-grow bg-gray-100 p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          Welcome to the Admin Dashboard
        </h1>
        <p className="text-gray-600">
          You are currently viewing the {activeSection.replace("-", " ")}{" "}
          section.
        </p>
      </div>
    </div>
  );
}
