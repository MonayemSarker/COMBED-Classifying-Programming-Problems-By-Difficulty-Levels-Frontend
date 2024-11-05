import { ArrowRightIcon, UserIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-white to-blue-50">
      <main>
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-blue-600 opacity-10 animate-pulse"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-20"></div>
          </div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 animate-fade-in-down">
              Welcome to Our Amazing Platform
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-3xl mx-auto animate-fade-in-up">
              Discover a new way to streamline your workflow, boost
              productivity, and achieve your goals with our innovative solution.
            </p>
            <button className="bg-blue-600 text-white px-10 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center mx-auto shadow-lg">
              Get Started
              <ArrowRightIcon className="ml-2 h-6 w-6" />
            </button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
        </section>

        <section id="about" className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
              About Us
            </h2>
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <p className="text-xl text-gray-600 leading-relaxed">
                  We are a team of passionate individuals dedicated to creating
                  innovative solutions that make a difference. Our mission is to
                  empower businesses and individuals with cutting-edge
                  technology to achieve their full potential.
                </p>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <button
                  onClick={handleLogin}
                  className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-medium text-blue-600 border-2 border-blue-600 rounded-full hover:text-white"
                >
                  <span className="absolute inset-0 w-full h-full bg-blue-600 group-hover:w-full transition-all duration-300 ease-out opacity-0 group-hover:opacity-100"></span>
                  <span className="relative flex items-center">
                    Admin Login
                    <UserIcon className="ml-2 h-5 w-5" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
