import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import AdminProfile from "./AdminProfile";
import AdminManageProblems from "./AdminManageProblems";
import AdminSurveyManagement from "./AdminSurveyManagement";
import AdminParticipantManagement from "./AdminParticipantManagement";
import AdminAdvanceOptions from "./AdminAdvanceOptions";
import { apiBaseUrl, decodeToken } from "../../utils/authUtil";

interface UserProfile {
  name: string;
  email: string;
  username: string;
  role: string;
}

export default function HomePage() {
  const [activeSection, setActiveSection] = useState("profile");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const accessToken = localStorage.getItem("accessToken");
  const decoded = decodeToken(accessToken);
  const userId = decoded?.sub;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${apiBaseUrl}/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [userId, accessToken]);

  const renderActiveComponent = () => {
    switch (activeSection) {
      case "profile":
        return (
          <AdminProfile isLoading={isLoading} profile={profile} error={error} />
        );
      case "manage-problems":
        return <AdminManageProblems />;
      case "survey-management":
        return <AdminSurveyManagement />;
      case "participant-management":
        return <AdminParticipantManagement />;
      case "advance-options":
        return <AdminAdvanceOptions />;
      default:
        return <AdminProfile />;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      <div className="flex-1 p-10 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome, {profile?.name}!
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            aria-label="Logout"
          >
            Logout
          </button>
        </div>
        {renderActiveComponent()}
      </div>
    </div>
  );
}
