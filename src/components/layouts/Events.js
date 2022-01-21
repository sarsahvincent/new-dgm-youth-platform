import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import EventNoteIcon from '@mui/icons-material/EventNote';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import { Box } from "@mui/system";
import ActivityCreator from "../ActivityCreator";
import HomepageEventTablet from "../HomepageEventTable";
import { useSelector } from "react-redux";


function HomePageContent() {
  const { allUsers } = useSelector((state) => state.users);
  const [men, setMen] = useState([]);
  const [womem, setWomen] = useState([]);
  const [newConvert, setNewConvert] = useState([]);

  let numberOfMen = [];
  let numberOfWomen = [];
  let numberOfNewConvert = [];

  const getAllMen = () => {
    const findMan = allUsers.filter((user) => user.sex === "Male");
    if (findMan) {
      numberOfMen.push(findMan);
    }
  };
  const getAllWomen = () => {
    const findWoman = allUsers.filter((user) => user.sex === "Female");
    if (findWoman) {
      numberOfWomen.push(findWoman);
    }
  };

  const getAllNewConvert = () => {
    const findNewConvert = allUsers.filter(
      (user) => user.membershipStatus === "New Convert"
    );
    if (findNewConvert) {
      numberOfNewConvert.push(findNewConvert);
    }
  };

  useEffect(() => {
    getAllWomen();
    setWomen(numberOfWomen[0].length);
    getAllMen();
    setMen(numberOfMen[0].length);
    getAllNewConvert();
    setNewConvert(numberOfNewConvert[0].length);
  }, [allUsers]);

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
              }}
            >
              <EventNoteIcon style={{ color: "purple", fontSize: 30 }} />
              <div style={{ color: "purple", textAlign: "center" }}>
                <h4>Total Event</h4>
                <h2>{allUsers?.length}</h2>
              </div>
            </Paper>
          </div>
          <div>
            <Paper
              elevation={3}
              className="dashboard_headings"
              sx={{
                p: 2,
              }}
            >
              <AssignmentTurnedInIcon style={{ color: "green", fontSize: 30 }} />
              <div style={{ color: "purple", textAlign: "center" }}>
                <h4>Executed</h4>
                <h2>{men}</h2>
              </div>
            </Paper>
          </div>
          <div>
            <Paper
              elevation={3}
              className="dashboard_headings"
              sx={{
                p: 1,
              }}
            >
              <PendingActionsIcon style={{ color: "blue", fontSize: 30 }} />
              <div style={{ color: "purple", textAlign: "center" }}>
                <h4>Pending</h4>
                <h2>{womem}</h2>
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
            Create Activity
          </h3>
          <ActivityCreator />
        </div>
        <div className="homepageEventListTable">
          <h3
            style={{ textAlign: "center", color: "purple", marginTop: "15px" }}
          >
            Activities
          </h3>
          <HomepageEventTablet />
        </div>
      </div>
    </div>
  );
}

export default HomePageContent;
