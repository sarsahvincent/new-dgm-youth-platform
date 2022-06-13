import React from "react";
import Layout from "../layout/Layout";
import ContactsPage from "../components/layouts/Contacts";

function Contacts() {
  return <Layout layout={<ContactsPage />} />;
}

export default Contacts;
