function Sidebar() {
  return (
    <div className="w-1/6 h-screen bg-gray-800 text-white flex flex-col p-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Admin Options</h2>
      </div>
      <hr className="border-gray-600 mb-4" />
      <ul className="space-y-4">
        <li>
          <a href="#" className="block py-2 px-3 rounded hover:bg-gray-700">
            Profile
          </a>
        </li>
        <li>
          <a href="#" className="block py-2 px-3 rounded hover:bg-gray-700">
            Manage Problems
          </a>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
