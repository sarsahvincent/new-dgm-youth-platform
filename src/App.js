import "./App.css";
import React from "react";
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Profile from "./pages/Profile";
import PrivateRoute from "./components/PrivateRoute";
import AuthProvider from "./context/auth";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AddAccount from "./pages/AddAccount";
import Contacts from "./pages/Contacts";
import ProfileDetails from "./pages/ViewProfile";
import Events from "./pages/Events";


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route exact path="/dashboard" element={<PrivateRoute />}>
            <Route exact path="/dashboard" element={<Home />} />
          </Route>
          <Route exact path="/" element={<PrivateRoute />}>
            <Route exact path="/" element={<Profile />} />
          </Route>
          <Route exact path="/add-account" element={<PrivateRoute />}>
            <Route exact path="/add-account" element={<AddAccount />} />
          </Route>
          <Route exact path="/events" element={<PrivateRoute />}>
            <Route exact path="/events" element={<Events />} />
          </Route>
          <Route exact path="/contacts" element={<PrivateRoute />}>
            <Route exact path="/contacts" element={<Contacts />} />
          </Route>
          <Route exact path="/profile-details/:id" element={<PrivateRoute />}>
            <Route exact path="/profile-details/:id" element={<ProfileDetails />} />
          </Route>
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
