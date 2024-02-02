import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Components/Login.tsx";
import Navbar from "./Components/Navbar.tsx";
import CreateInvoices from "./Components/CreateInvoices.tsx";
import Signup from "./Components/Signup.tsx";
import { UserProvider, useUserContext } from "./Context/UserContext.js";
import GeneratePdf from "./Components/GeneratePdf.tsx";

function App() {
  const { isLoggedIn } = useUserContext();

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route
            path="/"
            element={isLoggedIn ? <CreateInvoices /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={isLoggedIn ? <Navigate to="/" /> : <Login />}
          />

          <Route
            path="/signup"
            element={isLoggedIn ? <Navigate to="/" /> : <Signup />}
          />
          <Route
            path="/create-invoice"
            element={isLoggedIn ? <CreateInvoices /> : <Navigate to="/login" />}
          />
          <Route
            path="/generate-pdf"
            element={isLoggedIn ? <GeneratePdf /> : <Navigate to="/login" />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

function AppWithContext() {
  return (
    <UserProvider>
      <App />
    </UserProvider>
  );
}

export default AppWithContext;
