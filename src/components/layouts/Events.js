import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import EventNoteIcon from "@mui/icons-material/EventNote";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import { Box } from "@mui/system";
import ActivityCreator from "../ActivityCreator";
import HomepageEventTablet from "../HomepageEventTable";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ButtonLoader from "../ButtonLoader";
import { db } from "../../firebse";
import { collection, getDocs } from "firebase/firestore";

function HomePageContent() {
  const [loading, setLoading] = useState(false);
  const [activities, setActivities] = React.useState([]);
  const [allPending, setAllPending] = React.useState([]);
  const [allApproved, setAaaApproved] = React.useState([]);
  const [allexecuted, setAllExecuted] = React.useState([]);
  const activitiesCollectiion = collection(db, "DGM_YOUTH_Activities");

  let numberOfPending = [];
  let numberOfExecuted = [];
  let numberOfApproved = [];
  const pending = () => {
    const findPending = activities?.filter(
      (activity) => activity.status === "pending"
    );
    if (findPending) {
      numberOfPending.push(findPending);
    }
    return numberOfPending[0].length;
  };
  const executed = () => {
    const findExecuted = activities?.filter(
      (activity) => activity.status === "executed"
    );
    if (findExecuted) {
      numberOfExecuted.push(findExecuted);
    }
    return numberOfExecuted[0].length;
  };
  const approved = () => {
    const findApproved = activities?.filter(
      (activity) => activity.status === "approved"
    );
    if (findApproved) {
      numberOfApproved.push(findApproved);
    }
    return numberOfApproved[0].length;
  };

  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      const data = await getDocs(activitiesCollectiion);
      setActivities(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      setLoading(false);
    };
    getUsers();
  }, []);

  useEffect(() => {
    pending();
    setAllPending(pending);
    executed();
    setAllExecuted(executed);
    approved();
    setAaaApproved(approved);
  }, [activities]);

  return (
    <div className="layout_margin">
      <h3 style={{ color: "purple" }}>Events</h3>
      <Box
        component="div"
        display="inline"
        sx={{
          display: "flex",
          justifyContent: "space-around",
          flexWrap: "wrap",
          "& > :not(style)": {
            m: 1,
          },
        }}
      >
        <div className="dashboard_headings_main">
          <div>
            <Paper
              className="dashboard_headings"
              elevation={3}
              sx={{
                p: 2,
                backgroundColor: "purple",
              }}
            >
              <EventNoteIcon style={{ color: "white", fontSize: 24 }} />
              <div style={{ color: "white", textAlign: "center" }}>
                <h4>Total Event</h4>
                <h2>{activities?.length}</h2>
              </div>
            </Paper>
          </div>
          <div>
            <Paper
              elevation={3}
              className="dashboard_headings"
              sx={{
                p: 1,
                backgroundColor: "purple",
              }}
            >
              <AssignmentTurnedInIcon
                style={{ color: "white", fontSize: 24 }}
              />
              <div style={{ color: "white", textAlign: "center" }}>
                <h4>Approved</h4>
                <h2>{allApproved}</h2>
              </div>
            </Paper>
          </div>
          <div>
            <Paper
              elevation={3}
              className="dashboard_headings"
              sx={{
                p: 1,
                backgroundColor: "purple",
              }}
            >
              <PendingActionsIcon style={{ color: "white", fontSize: 24 }} />
              <div style={{ color: "white", textAlign: "center" }}>
                <h4>Pending</h4>
                <h2>{allPending}</h2>
              </div>
            </Paper>
          </div>
          <div>
            <Paper
              elevation={3}
              className="dashboard_headings"
              sx={{
                p: 2,
                backgroundColor: "purple",
              }}
            >
              <CheckCircleOutlineIcon
                style={{ color: "white", fontSize: 24 }}
              />
              <div style={{ color: "white", textAlign: "center" }}>
                <h4>Executed</h4>
                <h2>{allexecuted}</h2>
              </div>
            </Paper>
          </div>
        </div>
      </Box>
      <div className="hompage_table_items">
        <div className="homepageUserListTable">
          <h3
            style={{ textAlign: "center", color: "purple", marginTop: "15px" }}
          >
            Create Event
          </h3>
          <ActivityCreator />
        </div>
        <div className="homepageEventListTable">
          <h3
            style={{ textAlign: "center", color: "purple", marginTop: "15px" }}
          >
            Events
          </h3>
          {loading ? (
            <div>
              <b style={{ color: "purple" }}>Loading Events...</b>{" "}
              <span>
                {" "}
                <ButtonLoader />
              </span>
            </div>
          ) : activities.length === 0 || !activities ? (
            <div>
              <h4 style={{ color: "purple" }}>No Event found</h4>
            </div>
          ) : (
            <HomepageEventTablet />
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePageContent;
