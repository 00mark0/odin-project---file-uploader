import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const errors = {};
    if (!emailOrUsername)
      errors.emailOrUsername = "Email or Username is required";
    if (!password) errors.password = "Password is required";
    return errors;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        {
          emailOrUsername,
          password,
        }
      );
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (error) {
      setErrors({ form: "Login failed. Please check your credentials." });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <form onSubmit={handleLogin} className="space-y-6">
          {errors.form && (
            <div className="text-red-500 text-sm mb-4">{errors.form}</div>
          )}
          <div className="form-group">
            <label
              htmlFor="emailOrUsername"
              className="block text-sm font-medium text-gray-700"
            >
              Email or Username
            </label>
            <input
              type="text"
              id="emailOrUsername"
              placeholder="Email or Username"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              required
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.emailOrUsername ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            />
            {errors.emailOrUsername && (
              <div className="text-red-500 text-sm mt-1">
                {errors.emailOrUsername}
              </div>
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
              placeholder="Password"
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
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-sm text-center">
          Don`t have an account?{" "}
          <a href="/register" className="text-indigo-500">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
