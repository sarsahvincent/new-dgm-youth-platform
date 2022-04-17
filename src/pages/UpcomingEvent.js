import React from "react";
import Layout from "../layout/Layout";
import UpcomingEventpage from "../components/layouts/UpcomingEvent";

function UpcomingEvent() {
  return (
    <div >
      <Layout layout={<UpcomingEventpage />} />
    </div>
  );
}

export default UpcomingEvent;
