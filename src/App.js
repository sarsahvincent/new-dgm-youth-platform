import "./App.css";
import React from "react";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Profile from "./pages/Profile";
import PrivateRoute from "./components/PrivateRoute";
import AuthProvider from "./context/auth";
import Home from "./pages/Home";
import Reports from "./pages/Reports";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AddAccount from "./pages/AddAccount";
import Contacts from "./pages/Contacts";
import ProfileDetails from "./pages/ViewProfile";
import Events from "./pages/Events";
import Converts from "./pages/Converts";
import EditProfile from "./pages/EditProfile";
import Finance from "./pages/FinancePage";
import Settings from "./pages/Settings";
import EditSettings from "./pages/EditSettings";
import UpcomingEvent from "./pages/UpcomingEvent";
import ProgramsAndContacts from "./pages/ProgramsAndContacts";


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<PrivateRoute />}>
            <Route exact path="/" element={<Home />} />
          </Route>
          <Route exact path="/profile" element={<PrivateRoute />}>
            <Route exact path="/profile" element={<Profile />} />
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
          <Route exact path="/finance" element={<PrivateRoute />}>
            <Route exact path="/finance" element={<Finance />} />
          </Route>
          <Route exact path="/settings" element={<PrivateRoute />}>
            <Route exact path="/settings" element={<Settings />} />
          </Route>
          <Route exact path="/reports" element={<PrivateRoute />}>
            <Route exact path="/reports" element={<Reports />} />
          </Route>
          <Route exact path="/program-contact" element={<PrivateRoute />}>
            <Route exact path="/program-contact" element={<ProgramsAndContacts />} />
          </Route>
          <Route exact path="/profile-details/:id" element={<PrivateRoute />}>
            <Route
              exact
              path="/profile-details/:id"
              element={<ProfileDetails />}
            />
          </Route>
          <Route exact path="/edit-department/:id" element={<PrivateRoute />}>
            <Route
              exact
              path="/edit-department/:id"
              element={<EditSettings />}
            />
          </Route>
          <Route
            exact
            path="/new-converts-management"
            element={<PrivateRoute />}
          >
            <Route
              exact
              path="/new-converts-management"
              element={<Converts />}
            />
          </Route>
          <Route exact path="/edit-profile/:id" element={<PrivateRoute />}>
            <Route exact path="/edit-profile/:id" element={<EditProfile />} />
          </Route>
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/upcoming-event" element={<UpcomingEvent />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
