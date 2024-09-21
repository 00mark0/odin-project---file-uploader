import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

const UserDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [folders, setFolders] = useState([]);
  const [filteredFolders, setFilteredFolders] = useState([]);
  const [search, setSearch] = useState("");
  const [expandedFolder, setExpandedFolder] = useState(null); // Define expandedFolder state

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await api.get(`/api/admin/users/${id}/folders`);
        setFolders(response.data);
        setFilteredFolders(response.data);
      } catch (error) {
        console.error("Error fetching folders:", error);
      }
    };

    fetchFolders();
  }, [id]);

  useEffect(() => {
    const lowercasedSearch = search.toLowerCase();
    const filtered = folders.filter((folder) => {
      const folderNameMatches = folder.name
        .toLowerCase()
        .includes(lowercasedSearch);
      const fileNameMatches = folder.files?.some((file) =>
        file.originalname?.toLowerCase().includes(lowercasedSearch)
      );
      return folderNameMatches || fileNameMatches;
    });
    setFilteredFolders(filtered);
  }, [search, folders]);

  const handleDeleteFolder = async (folderId) => {
    try {
      await api.delete(`/api/admin/folders/${folderId}`);
      setFolders(folders.filter((folder) => folder.id !== folderId));
    } catch (error) {
      console.error("Error deleting folder:", error);
    }
  };

  const handleDeleteFile = async (fileId) => {
    try {
      await api.delete(`/api/admin/files/${fileId}`);
      setFolders(
        folders.map((folder) =>
          folder.id === expandedFolder
            ? {
                ...folder,
                files: folder.files.filter((file) => file.id !== fileId),
              }
            : folder
        )
      );
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const handleToggleFiles = async (folderId) => {
    if (expandedFolder === folderId) {
      setExpandedFolder(null);
    } else {
      try {
        const response = await api.get(`/api/admin/folders/${folderId}/files`);
        setFolders(
          folders.map((folder) =>
            folder.id === folderId
              ? { ...folder, files: response.data }
              : folder
          )
        );
        setExpandedFolder(folderId);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    }
  };

  const handleBackToDashboard = () => {
    navigate("/users");
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Details</h1>
        <button
          onClick={handleBackToDashboard}
          className="px-4 py-2 bg-indigo-500 text-white rounded"
        >
          Back to Dashboard
        </button>
      </div>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search folders or files"
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
      <ul className="mt-4">
        {filteredFolders.length > 0 ? (
          filteredFolders.map((folder) => (
            <li key={folder.id} className="mb-4">
              <div className="flex justify-between items-center">
                <span>{folder.name}</span>
                <div>
                  <button
                    onClick={() => handleToggleFiles(folder.id)}
                    className="mr-2 px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    {expandedFolder === folder.id ? "Hide Files" : "View Files"}
                  </button>
                  <button
                    onClick={() => handleDeleteFolder(folder.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded"
                  >
                    Delete Folder
                  </button>
                </div>
              </div>
              {expandedFolder === folder.id && (
                <ul className="ml-4 mt-2">
                  {folder.files && folder.files.length > 0 ? (
                    folder.files.map((file) => (
                      <li
                        key={file.id}
                        className="flex justify-between items-center mb-2"
                      >
                        <div>
                          <p className="font-bold">{file.name}</p>
                          <p>Size: {file.size} bytes</p>
                          <p>
                            URL:{" "}
                            <a
                              href={file.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500"
                            >
                              {file.url}
                            </a>
                          </p>
                          <p>User ID: {file.userId}</p>
                          <p>Folder ID: {file.folderId}</p>
                        </div>
                        <div>
                          <button
                            onClick={() => handleDeleteFile(file.id)}
                            className="mr-2 px-4 py-2 bg-red-500 text-white rounded"
                          >
                            Delete File
                          </button>
                        </div>
                      </li>
                    ))
                  ) : (
                    <p>No files found in this folder</p>
                  )}
                </ul>
              )}
            </li>
          ))
        ) : (
          <p>No folders or files found</p>
        )}
      </ul>
    </div>
  );
};

export default UserDetailsPage;
