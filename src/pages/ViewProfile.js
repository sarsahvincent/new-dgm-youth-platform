import React from "react";
import { useParams } from "react-router-dom";
import Layout from "../layout/Layout";
import ProfileDetails from "../components/layouts/ProfileDetails";

function ViewProfile() {
  const { id } = useParams();

 
  return <Layout layout={<ProfileDetails />} />;
}
export default ViewProfile;
