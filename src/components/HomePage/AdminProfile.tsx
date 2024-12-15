export default function AdminProfile({ isLoading, profile, error }: any) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
          role="alert"
        >
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Name
            </label>
            <p className="mt-1 text-gray-900">{profile?.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              User Name
            </label>
            <p className="mt-1 text-gray-900">{profile?.username}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <p className="mt-1 text-gray-900">{profile?.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Role
            </label>
            <p className="mt-1 text-gray-900">Administrator</p>
          </div>
        </div>
      </div>
    </div>
  );
}
