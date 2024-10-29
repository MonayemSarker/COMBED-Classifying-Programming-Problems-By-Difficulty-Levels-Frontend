import { useEffect, useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import AdminProfile from "./AdminProfile";
import AdminManageProblems from "./AdminManageProblems";
import AdminSurveyManagement from "./AdminSurveyManagement";
import { decodeToken } from "../../utils/authUtil";

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

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:3000/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        // console.log("data", data);

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
          Welcome, {profile?.name}!
        </h1>
        {renderActiveComponent()}
      </div>
    </div>
  );
}
