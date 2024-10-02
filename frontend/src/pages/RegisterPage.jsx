import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const errors = {};
    if (!email) errors.email = "Email is required";
    if (!username) errors.username = "Username is required";
    if (!password) errors.password = "Password is required";
    if (password !== confirmPassword)
      errors.confirmPassword = "Passwords do not match";
    return errors;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/register",
        { email, username, password, confirmPassword },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // Handle successful registration (e.g., redirect to login)
      if (response.status === 201) {
        navigate("/login");
      } else {
        setErrors({ form: "Registration failed. Please try again." });
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrors({ form: error.response.data.message });
      } else {
        setErrors({ form: "Registration failed. Please try again." });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
        <form onSubmit={handleRegister} className="space-y-6">
          {errors.form && (
            <div className="text-red-500 text-sm mb-4">{errors.form}</div>
          )}
          <div className="form-group">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            />
            {errors.email && (
              <div className="text-red-500 text-sm mt-1">{errors.email}</div>
            )}
          </div>
          <div className="form-group">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.username ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            />
            {errors.username && (
              <div className="text-red-500 text-sm mt-1">{errors.username}</div>
            )}
          </div>
          <div className="form-group">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            />
            {errors.password && (
              <div className="text-red-500 text-sm mt-1">{errors.password}</div>
            )}
          </div>
          <div className="form-group">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            />
            {errors.confirmPassword && (
              <div className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </div>
            )}
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-sm text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-500">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
