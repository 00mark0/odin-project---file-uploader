import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar"; // Adjust the path as necessary
import PropTypes from "prop-types";

const ProfilePage = ({ isDarkMode, toggleDarkMode }) => {
  const [profile, setProfile] = useState({
    email: "",
    username: "",
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  useEffect(() => {
    // Fetch the user's profile information
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/user/profile",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setProfile((prevProfile) => ({
          ...prevProfile,
          email: response.data.email,
          username: response.data.username,
        }));
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        "http://localhost:3000/api/user/profile",
        {
          email: profile.email,
          username: profile.username,
          oldPassword: profile.oldPassword,
          newPassword: profile.newPassword,
          confirmNewPassword: profile.confirmNewPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile");
    }
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      try {
        await axios.delete("http://localhost:3000/api/user/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        alert("Account deleted successfully");
        localStorage.removeItem("token");
        window.location.href = "/";
      } catch (error) {
        console.error("Error deleting account:", error);
        alert("Error deleting account");
      }
    }
  };

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <div className="min-h-screen text-gray-900 dark:text-gray-100 flex items-center justify-center">
        <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center">Profile Page</h1>
          <Link
            to="/dashboard"
            className="block w-full px-4 py-2 mb-4 font-bold text-center text-white bg-blue-500 rounded hover:bg-blue-700 transition duration-300"
          >
            Back to Dashboard
          </Link>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-indigo-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={profile.username}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-indigo-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Old Password
              </label>
              <input
                type="password"
                name="oldPassword"
                value={profile.oldPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                value={profile.newPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmNewPassword"
                value={profile.confirmNewPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-indigo-400"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 font-bold text-white bg-indigo-500 rounded hover:bg-indigo-700 transition duration-300"
            >
              Update Profile
            </button>
          </form>
          <button
            onClick={handleDeleteAccount}
            className="w-full px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-700 transition duration-300"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

ProfilePage.propTypes = {
  isDarkMode: PropTypes.bool.isRequired,
  toggleDarkMode: PropTypes.func.isRequired,
};

export default ProfilePage;
