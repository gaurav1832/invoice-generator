import React, { useContext, useState } from "react";

const API_BASE_URL = "https://invoice-generator-server-rv88.onrender.com";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({ email: "", password: "" });

  const handleValidation = () => {
    let isValid = true;

    // Email validation using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError((prevError) => ({
        ...prevError,
        email: "Please enter a valid email address.",
      }));
      isValid = false;
    } else {
      setError((prevError) => ({ ...prevError, email: "" }));
    }

    // Check if password is not empty
    if (password.trim() === "") {
      setError((prevError) => ({
        ...prevError,
        password: "Password is required.",
      }));
      isValid = false;
    } else {
      setError((prevError) => ({ ...prevError, password: "" }));
    }

    return isValid;
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    if (!handleValidation()) {
      return;
    }

    // Retrieve values using state instead of directly from the event target
    try {
      const response = await fetch(`${API_BASE_URL}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      // console.log("data-", data);
      localStorage.setItem("token", data.token);
      localStorage.setItem("userEmail", email);
      window.location.href = "/create-invoice";
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setError((prevError) => ({ ...prevError, email: "" }));
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError((prevError) => ({ ...prevError, password: "" }));
  };

  return (
    <div className="flex items-center justify-center mt-40">
      <section className="w-full max-w-md p-8 bg-gray-50 rounded shadow-lg">
        <hgroup className="flex flex-col items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Login</h2>
          <h3 className="text-lg text-gray-600">to create the invoices</h3>
        </hgroup>
        <form action="#" method="post" className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="flex text-sm font-medium text-gray-700"
            >
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleEmailChange}
              required
              className="mt-1 flex w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 leading-tight focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {error.email && <p className="text-red-500 mt-1">{error.email}</p>}
          </div>
          <div>
            <label
              htmlFor="password"
              className="flex text-sm font-medium text-gray-700"
            >
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handlePasswordChange}
              required
              className="mt-1 flex w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 leading-tight focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {error.password && (
              <p className="text-red-500 mt-1">{error.password}</p>
            )}
          </div>
          <button
            onClick={handleLogin}
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-400 hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-600"
          >
            Login
          </button>
          <p className="text-center text-sm text-gray-700">
            New here?{" "}
            <a href="/signup" className="text-orange-400 hover:text-orange-500">
              Sign up
            </a>
          </p>
        </form>
      </section>
    </div>
  );
};

export default Login;
