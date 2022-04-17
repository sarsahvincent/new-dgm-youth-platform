import React from "react";
import Layout from "../layout/Layout";
import Login from "../components/layouts/Login";
import Footer from "../layout/Footer.jsx";

function LoginPage() {
  return (
    <div>
      <Layout layout={<Login />} />
    </div>
  );
}

export default LoginPage;
