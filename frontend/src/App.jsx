import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ProfilePage from "./pages/ProfilePage.jsx"; // Import the new ProfilePage component
import "./App.css";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Retrieve the dark mode preference from local storage
    const savedMode = localStorage.getItem("isDarkMode");
    return savedMode ? JSON.parse(savedMode) : false;
  });

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      // Save the new dark mode preference to local storage
      localStorage.setItem("isDarkMode", JSON.stringify(newMode));
      return newMode;
    });
  };

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={
            <Dashboard
              isDarkMode={isDarkMode}
              toggleDarkMode={toggleDarkMode}
            />
          }
        />
        <Route
          path="/profile"
          element={
            <ProfilePage
              isDarkMode={isDarkMode}
              toggleDarkMode={toggleDarkMode}
            />
          }
        />
      </Routes>
    </>
  );
}

export default App;
