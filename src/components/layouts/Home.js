import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import ManIcon from "@mui/icons-material/Man";
import WomanIcon from "@mui/icons-material/Woman";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import GroupsIcon from "@mui/icons-material/Groups";
import { Box } from "@mui/system";
import HomepageUserList from "../HomepageUserList";
import HomepageEventTablet from "../HomepageEventTable";
import { useDispatch, useSelector } from "react-redux";
import { getDocs, collection, doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebse";
import ButtonLoader from "../ButtonLoader";

import { getDepartments } from "../../services/redux/reducers/departmentSlice";
import { getUserDetails } from "../../services/redux/reducers/userSlice";

function HomePageContent() {
  const { allUsers } = useSelector((state) => state.users);
  const [men, setMen] = useState([]);
  const [womem, setWomen] = useState([]);
  const [newConvert, setNewConvert] = useState([]);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  let numberOfMen = [];
  let numberOfWomen = [];
  let numberOfNewConvert = [];
  const [activities, setActivities] = React.useState([]);

  const activitiesCollectiion = collection(db, "DGM_YOUTH_Activities");

  const { allDepartment } = useSelector((state) => state.departments);
  const [departments, setDeparments] = useState([]);
  const [loggedinUser, setLoggedinUser] = useState();

  const deparmentCollectiion = collection(db, "DGM_YOUTH_Departments");

  const getAllMen = () => {
    const findMan = allUsers?.filter((user) => user.sex === "Male");
    if (findMan) {
      numberOfMen.push(findMan);
    }
  };
  const getAllWomen = () => {
    const findWoman = allUsers?.filter((user) => user.sex === "Female");
    if (findWoman) {
      numberOfWomen.push(findWoman);
    }
  };

  const getAllNewConvert = () => {
    const findNewConvert = allUsers?.filter(
      (user) => user.membershipStatus === "New Convert"
    );
    if (findNewConvert) {
      numberOfNewConvert.push(findNewConvert);
    }
  };

  useEffect(() => {
    const getAllDepartment = async () => {
      const data = await getDocs(deparmentCollectiion);
      setDeparments(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    dispatch(getDepartments(departments));

    getAllDepartment();
  }, []);

  useEffect(() => {
    getDoc(doc(db, "DGM_YOUTH_users", auth.currentUser.uid)).then((docSnap) => {
      if (docSnap.exists) {
        setLoggedinUser(docSnap.data());
        dispatch(getUserDetails(docSnap.data()));
        localStorage.setItem("loggedinUser", JSON.stringify(docSnap.data()));
      }
    });
  }, []);

  setTimeout(() => {
    dispatch(getDepartments(departments));
  }, 1000);
  useEffect(() => {
    getAllWomen();
    setWomen(numberOfWomen[0].length);
    getAllMen();
    setMen(numberOfMen[0].length);
    getAllNewConvert();
    setNewConvert(numberOfNewConvert[0].length);
  }, [allUsers]);

  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      const data = await getDocs(activitiesCollectiion);
      setActivities(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      setLoading(false);
    };

    getUsers();
  }, []);

  return (
    <div className="layout_margin">
      <h3 style={{ color: "purple" }}>Dashboard</h3>
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
              <GroupsIcon style={{ color: "white", fontSize: 24 }} />
              <div style={{ color: "white", textAlign: "right" }}>
                <h4>Total Youth</h4>
                {!allUsers?.length ? (
                  <h2>0</h2>
                ) : (
                  <>
                    <h2>{allUsers?.length - 1}</h2>
                  </>
                )}
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
              <ManIcon style={{ color: "white", fontSize: 24 }} />
              <div style={{ color: "white", textAlign: "right" }}>
                <h4>Men</h4>
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
                backgroundColor: "purple",
              }}
            >
              <WomanIcon style={{ color: "white", fontSize: 24 }} />
              <div style={{ color: "white", textAlign: "right" }}>
                <h4>Women</h4>
                <h2>{womem}</h2>
              </div>
            </Paper>
          </div>
          <div>
            <Paper
              className="dashboard_headings"
              col-md={4}
              elevation={3}
              sx={{ p: 1, backgroundColor: "purple" }}
            >
              <EmojiPeopleIcon style={{ color: "white", fontSize: 24 }} />
              <div style={{ color: "white", textAlign: "right" }}>
                <h4>New Convert</h4>
                <h2>{newConvert}</h2>
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
            Members
          </h3>
          <HomepageUserList allDepartment={allDepartment} />
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
          ) : activities?.length === 0 ? (
            <h4 style={{ color: "purple" }}>No activities found</h4>
          ) : (
            <HomepageEventTablet />
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePageContent;
