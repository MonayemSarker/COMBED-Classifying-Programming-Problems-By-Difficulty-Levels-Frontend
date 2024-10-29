import { useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import AdminProfile from "./AdminProfile";
import AdminManageProblems from "./AdminManageProblems";
import AdminSurveyManagement from "./AdminSurveyManagement";

export default function HomePage() {
  const [activeSection, setActiveSection] = useState("profile");

  const renderActiveComponent = () => {
    switch (activeSection) {
      case "profile":
        return <AdminProfile />;
      case "manage-problems":
        return <AdminManageProblems />;
      case "survey-management":
        return <AdminSurveyManagement />;
      default:
        return <AdminProfile />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      <div className="flex-1 p-10 overflow-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Welcome, Admin!
        </h1>
        {renderActiveComponent()}
      </div>
    </div>
  );
}
