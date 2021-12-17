import React from "react";
import Paper from "@mui/material/Paper";
import ListItem from "@mui/material/ListItem";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import ManIcon from "@mui/icons-material/Man";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import WomanIcon from "@mui/icons-material/Woman";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import GroupsIcon from "@mui/icons-material/Groups";
import { Box } from "@mui/system";
import HomepageUserList from "../HomepageUserList";
import HomepageEventTablet from "../HomepageEventTable";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: "center",
  color: theme.palette.text.secondary,
  height: 40,
  lineHeight: "40px",
}));

function HomePageContent() {
  return (
    <div className="layout_margin">
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
        <Paper
          className="dashboard_headings"
          elevation={3}
          sx={{
            p: 2,
          }}
        >
          <GroupsIcon style={{ color: "purple", fontSize: 30 }} />
          <div style={{ color: "purple", textAlign: "center" }}>
            <h4>Total Youth</h4>
            <h2>250</h2>
          </div>
        </Paper>
        <Paper
          elevation={3}
          className="dashboard_headings"
          sx={{
            p: 2,
          }}
        >
          <ManIcon style={{ color: "purple", fontSize: 30 }} />
          <div style={{ color: "purple", textAlign: "center" }}>
            <h4>Men</h4>
            <h2>130</h2>
          </div>
        </Paper>
        <Paper
          elevation={4}
          className="dashboard_headings"
          sx={{
            p: 1,
          }}
        >
          <WomanIcon style={{ color: "purple", fontSize: 30 }} />
          <div style={{ color: "purple", textAlign: "center" }}>
            <h4>Women</h4>
            <h2>120</h2>
          </div>
        </Paper>
        <Paper className="dashboard_headings" elevation={3} sx={{ p: 1 }}>
          <EmojiPeopleIcon style={{ color: "purple", fontSize: 30 }} />
          <div style={{ color: "purple", textAlign: "center" }}>
            <h4>New Convert</h4>
            <h2>13</h2>
          </div>
        </Paper>
      </Box>
      <div className="hompage_table_items">
        <div>
          <h3
            style={{ textAlign: "center", color: "purple", marginTop: "15px" }}
          >
            Members
          </h3>
          <HomepageUserList />
        </div>
        <div>
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
