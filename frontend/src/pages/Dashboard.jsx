import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar"; // Adjust the path as necessary
import PropTypes from "prop-types";

const Dashboard = ({ isDarkMode, toggleDarkMode }) => {
  const [folders, setFolders] = useState([]);
  const [expandedFolderId, setExpandedFolderId] = useState(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFolderId, setSelectedFolderId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({
    folders: [],
    files: [],
  });

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/folders", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setFolders(response.data);
    } catch (error) {
      console.error("Error fetching folders:", error);
    }
  };

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/folders",
        { name: newFolderName },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setFolders([...folders, response.data]);
      setNewFolderName("");
    } catch (error) {
      console.error("Error creating folder:", error);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("folderId", selectedFolderId);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/files/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const uploadedFile = response.data;

      setFolders((prevFolders) =>
        prevFolders.map((folder) =>
          folder.id === selectedFolderId
            ? { ...folder, files: [...folder.files, uploadedFile] }
            : folder
        )
      );
      setSelectedFile(null);
      setSelectedFolderId("");
      fetchFolders(); // Refetch folders after file upload
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleFolderClick = (folderId) => {
    setExpandedFolderId(expandedFolderId === folderId ? null : folderId);
  };

  const handleDeleteFolder = async (folderId) => {
    try {
      await axios.delete(`http://localhost:3000/api/user/folders/${folderId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchFolders(); // Refetch folders after deletion
    } catch (error) {
      console.error("Error deleting folder:", error);
    }
  };

  const handleDeleteFile = async (fileId) => {
    try {
      await axios.delete(`http://localhost:3000/api/user/files/${fileId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchFolders(); // Refetch folders after deletion
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        "http://localhost:3000/api/user/search",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: { search: searchQuery },
        }
      );
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error searching files and folders:", error);
    }
  };

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <div className="min-h-screen text-gray-900 dark:text-gray-100">
        <div className="container mx-auto px-4 py-8">
          <form onSubmit={handleSearch} className="mb-8">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search files and folders"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-indigo-400"
            />
            <button
              type="submit"
              className="mt-2 px-4 py-2 font-bold text-white bg-indigo-500 rounded hover:bg-indigo-700 transition duration-300"
            >
              Search
            </button>
          </form>
          {searchResults.folders.length > 0 ||
          searchResults.files.length > 0 ? (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">
                Search Results
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {searchResults.folders.map((folder) => (
                  <div key={folder.id} className="p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-400">
                      {folder.name}
                    </h3>
                    <ul className="ml-4 mt-2">
                      {folder.files.map((file) => (
                        <li key={file.id} className="text-sm">
                          <div className="flex justify-between items-center p-2 rounded-lg shadow-sm">
                            <span className="text-gray-500">{file.name}</span>
                            <span className="text-gray-500">
                              {file.size} bytes
                            </span>
                            <span className="text-gray-500">
                              {new Date(file.createdAt).toLocaleString()}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                {searchResults.files.map((file) => (
                  <div key={file.id} className="p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-green-700 dark:text-green-400">
                      {file.name}
                    </h3>
                    <div className="flex justify-between items-center p-2 rounded-lg shadow-sm">
                      <span className="text-gray-500">{file.size} bytes</span>
                      <span className="text-gray-500">
                        {new Date(file.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-400">
                Create Folder
              </h2>
              <form onSubmit={handleCreateFolder} className="space-y-4">
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Folder Name"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-400"
                  required
                />
                <button
                  type="submit"
                  className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 transition duration-300"
                >
                  Create Folder
                </button>
              </form>
            </div>
            <div className="p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4 text-green-600 dark:text-green-400">
                Upload File
              </h2>
              <form onSubmit={handleFileUpload} className="space-y-4">
                <input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-green-400"
                  required
                />
                <select
                  value={selectedFolderId}
                  onChange={(e) => setSelectedFolderId(e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-green-400"
                >
                  <option value="">Select Folder (Optional)</option>
                  {folders.map((folder) => (
                    <option key={folder.id} value={folder.id}>
                      {folder.name}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="w-full px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-700 transition duration-300"
                >
                  Upload File
                </button>
              </form>
            </div>
            <div className="p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4 text-purple-600 dark:text-purple-400">
                Folders
              </h2>
              <ul>
                {folders.map((folder) => (
                  <li key={folder.id} className="mb-4">
                    <div className="flex justify-between items-center p-3 rounded-lg shadow-sm">
                      <div
                        className="cursor-pointer text-lg font-semibold text-purple-700 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-600 transition duration-300"
                        onClick={() => handleFolderClick(folder.id)}
                      >
                        {folder.name}
                      </div>
                      <button
                        onClick={() => handleDeleteFolder(folder.id)}
                        className="text-red-500 hover:text-red-700 transition duration-300"
                      >
                        Delete
                      </button>
                    </div>
                    {expandedFolderId === folder.id && (
                      <ul className="ml-4 mt-2">
                        {folder.files.map((file) => (
                          <li key={file.id} className="text-sm">
                            <div className="flex justify-between items-center p-2 rounded-lg shadow-sm">
                              <span className="text-gray-500">{file.name}</span>
                              <span className="text-gray-500">
                                {file.size} bytes
                              </span>
                              <span className="text-gray-500">
                                {new Date(file.createdAt).toLocaleString()}
                              </span>
                              <button
                                onClick={() => handleDeleteFile(file.id)}
                                className="text-red-500 hover:text-red-700 transition duration-300"
                              >
                                Delete
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Dashboard.propTypes = {
  isDarkMode: PropTypes.bool.isRequired,
  toggleDarkMode: PropTypes.func.isRequired,
};

export default Dashboard;
