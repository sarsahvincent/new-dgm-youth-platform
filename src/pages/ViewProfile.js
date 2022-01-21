import React from "react";
import { useParams } from "react-router-dom";
import Layout from "../layout/Layout";
import ProfileDetails from "../components/layouts/ProfileDetails";

function ViewProfile() {
  const { id } = useParams();

  console.log("parmas id ", id)
  return <Layout layout={<ProfileDetails />} />;
}
export default ViewProfile;
