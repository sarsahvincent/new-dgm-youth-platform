import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import ManIcon from "@mui/icons-material/Man";
import WomanIcon from "@mui/icons-material/Woman";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import GroupsIcon from "@mui/icons-material/Groups";
import { Box } from "@mui/system";
import NewConvertList from "../NewConvertList";
import HomepageEventTablet from "../HomepageEventTable";
import { useSelector, useDispatch } from "react-redux";
import { db } from "../../firebse";
import ButtonLoader from "../ButtonLoader";
import { getAllUsers } from "../../services/redux/reducers/userSlice";
import {
  ref,
  getDownloadURL,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import { collection, getDocs } from "firebase/firestore";
import { doc, getDoc, updateDoc } from "firebase/firestore";

function HomePageContent() {
  const { allUsers } = useSelector((state) => state?.users);
  const [users, setUsers] = useState([]);
  const usersCollectiion = collection(db, "DGM_YOUTH_users");
  const [men, setMen] = useState([]);
  const [womem, setWomen] = useState([]);
  const [newConvert, setNewConvert] = useState([]);
  const [allNewConvert, setAllNewConvert] = useState([]);
  const dispatch = useDispatch();
  console.log("all converts", allNewConvert);

  let numberOfMen = [];
  let numberOfWomen = [];
  let numberOfNewConvert = [];
  let allConverts = [];

  const getAllMen = () => {
    const findMan = allUsers?.filter(
      (user) => user?.sex === "Male" && user?.membershipStatus === "New Convert"
    );
    if (findMan) {
      numberOfMen?.push(findMan);
    }
  };
  const getAllWomen = () => {
    const findWoman = allUsers?.filter(
      (user) =>
        user?.sex === "Female" && user?.membershipStatus === "New Convert"
    );

    if (findWoman) {
      numberOfWomen?.push(findWoman);
    }
  };

  const getAllNewConvert = () => {
    const findNewConvert = allUsers?.filter(
      (user) => user?.membershipStatus === "New Convert"
    );
    localStorage?.setItem("allNewConvert", JSON.stringify(findNewConvert));
    setAllNewConvert(findNewConvert);
    if (findNewConvert) {
      numberOfNewConvert?.push(findNewConvert);
    }
  };

  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(usersCollectiion);
      setUsers(data?.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    dispatch(getAllUsers(users));

    getUsers();
  }, []);

  setTimeout(() => {
    dispatch(getAllUsers(users));
  }, 1000);

  useEffect(() => {
    getAllWomen();
    setWomen(numberOfWomen[0]?.length);
    getAllMen();
    setMen(numberOfMen[0]?.length);
    getAllNewConvert();
    setNewConvert(numberOfNewConvert[0]?.length);
  }, [allUsers]);

  return (
    <div className="layout_margin">
      <h3 style={{ color: "purple" }}>Converts Management</h3>

      {!users ? (
        <ButtonLoader />
      ) : (
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
                <GroupsIcon style={{ color: "white", fontSize: 40 }} />
                <div style={{ color: "white", textAlign: "right" }}>
                  <h4>Total Convert</h4>
                  <h2>{newConvert ? newConvert : 0}</h2>
                </div>
              </Paper>
            </div>

            {/* ---------------------------- */}
            <div>
              <Paper
                elevation={3}
                className="dashboard_headings"
                sx={{
                  p: 2,
                  backgroundColor: "purple",
                }}
              >
                <ManIcon style={{ color: "white", fontSize: 40 }} />
                <div style={{ color: "white", textAlign: "right" }}>
                  <h4>Men</h4>
                  <h2>{men ? men : 0}</h2>
                </div>
              </Paper>
            </div>

            {/* ---------------------------- */}
            <div>
              <Paper
                elevation={3}
                className="dashboard_headings"
                sx={{
                  p: 1,
                  backgroundColor: "purple",
                }}
              >
                <WomanIcon style={{ color: "white", fontSize: 40 }} />
                <div style={{ color: "white", textAlign: "right" }}>
                  <h4>Women</h4>
                  <h2>{womem ? womem : 0}</h2>
                </div>
              </Paper>
            </div>

            {/* ---------------------------- */}
            <div>
              <Paper
                className="dashboard_headings"
                col-md={4}
                elevation={3}
                sx={{ p: 1, backgroundColor: "purple" }}
              >
                <EmojiPeopleIcon style={{ color: "white", fontSize: 40 }} />
                <div style={{ color: "white", textAlign: "right" }}>
                  <h4>New Convert</h4>
                  <h2>{newConvert}</h2>
                </div>
              </Paper>
            </div>
          </div>
        </Box>
      )}

      <div className="hompage_table_items">
        <div className="homepageUserListTable">
          <h3
            style={{ textAlign: "center", color: "purple", marginTop: "15px" }}
          >
            All New Converts
          </h3>
          <NewConvertList />
        </div>  
        {/* <div className="homepageEventListTable">
          <h3
            style={{ textAlign: "center", color: "purple", marginTop: "15px" }}
          >
            Activities
          </h3>
          <HomepageEventTablet />
        </div> */}
      </div>
    </div>
  );
}

export default HomePageContent;
