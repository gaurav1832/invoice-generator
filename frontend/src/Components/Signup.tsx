import React, { useState } from "react";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState({ name: "", email: "", password: "" });

  const API_BASE_URL = "https://invoice-generator-server-rv88.onrender.com";

  const handleValidation = () => {
    let isValid = true;

    // email validation using regex
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

    // Check if name is not empty
    if (name.trim() === "") {
      setError((prevError) => ({ ...prevError, name: "Name is required." }));
      isValid = false;
    } else {
      setError((prevError) => ({ ...prevError, name: "" }));
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    window.location.href = "/login";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!handleValidation()) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, name, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        // console.log("token-", data.token);
        handleLogout();
        window.location.href = "/login";
      } else {
        throw new Error("Something went wrong with the registration!");
      }
    } catch (error) {
      console.error("Signup Error:", error);
    }
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    setError((prevError) => ({ ...prevError, name: "" }));
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
    <div className="flex items-center justify-center mt-36">
      <section className="w-full max-w-md p-8 bg-gray-50 rounded shadow-lg">
        <hgroup className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Signup</h2>
          <h3 className="text-lg text-gray-600">Create your Account</h3>
        </hgroup>

        <div>
          <label
            htmlFor="name"
            className="flex text-sm font-medium text-gray-700"
          >
            Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={handleNameChange}
            required
            className="mt-1 flex w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 leading-tight focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {error.name && <p className="text-red-500 mt-1">{error.name}</p>}
        </div>
        <div>
          <label
            htmlFor="email"
            className="flex text-sm font-medium text-gray-700 mt-4"
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
            className="flex text-sm font-medium text-gray-700 mt-4"
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
          type="submit"
          onClick={handleSubmit}
          className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-400 hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-600"
        >
          Sign up
        </button>
        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-orange-400 hover:text-orange-500">
            Login
          </a>
        </p>
      </section>
    </div>
  );
};

export default Signup;
