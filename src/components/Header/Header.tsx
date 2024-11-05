"use client";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-center h-16">
          <div className="text-center">
            <span className="text-3xl font-serif text-gray-800 tracking-tight">
              SurveyClass
            </span>
          </div>
        </nav>
      </div>
    </header>
  );
}
