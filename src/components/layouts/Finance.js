import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Icon from "@mdi/react";
import { mdiCashMultiple, mdiHandCoinOutline, mdiCalendarMonth } from "@mdi/js";
import Img from "../../assets/images/avatar.png";
import Camera from "../../components/svg/Camera";
import Delete from "../../components/svg/Delete";
import { storage, db, auth } from "../../firebse";
import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Loading from "../Loading";
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";
import {
  ref,
  getDownloadURL,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Tooltip from "@mui/material/Tooltip";
import { getUserDetails } from "../../services/redux/reducers/userSlice";
import { useDispatch } from "react-redux";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function Finance() {
  const [img, setImg] = useState();
  const [user, setUser] = useState();
  const dispatch = useDispatch();
  useEffect(() => {
    getDoc(doc(db, "DGM_YOUTH_users", auth.currentUser.uid)).then((docSnap) => {
      if (docSnap.exists) {
        setUser(docSnap.data());
        dispatch(getUserDetails(docSnap.data()));
      }
    });
    if (img) {
      const uplaodImg = async () => {
        const imgRef = ref(
          storage,
          `chat-app/avatar/${new Date().getTime()} - ${img.name}`
        );
        try {
          if (user.avatarPath) {
            await deleteObject(ref(storage, user.avatarPath));
          }
          const snap = await uploadBytes(imgRef, img);
          const url = await getDownloadURL(ref(storage, snap.ref.fullPath));

          await updateDoc(doc(db, "DGM_YOUTH_users", auth.currentUser.uid), {
            avatar: url,
            avatarPath: snap.ref.fullPath,
          });
          setImg("");
        } catch (error) {}
      };
      uplaodImg();
    }
  }, [img]);
  const deleteImage = async () => {
    try {
      const confirm = window.confirm("Delete avatar");
      if (confirm) {
        deleteObject(ref(storage, user.avatarPath));
      }
      await updateDoc(doc(db, "DGM_YOUTH_users", auth.currentUser.uid), {
        avatar: "",
        avatarPath: "",
      });
      window.location.reload();
    } catch (err) {}
  };
  return user ? (
    <div className="layout_margin m-2 mt-3">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h3 style={{ color: "purple" }}>Finance</h3>
      </div>
      <Box sx={{ flexGrow: 1 }}>
        <Grid sx={{ boxShadow: 0 }} container spacing={2}>
          <Grid sx={{ boxShadow: 0 }} item xs={12} sm={12} md={4} lg={3} xl={3}>
            <Button
              size="large"
              sx={{ width: "100%", marginBottom: 2 }}
              variant="contained"
              color="success"
              endIcon={<AddCircleIcon />}
            >
              Add Funds
            </Button>
            <Button
              size="large"
              sx={{ width: "100%" }}
              variant="contained"
              color="warning"
              endIcon={<IndeterminateCheckBoxIcon />}
            >
              Request for Funds
            </Button>
          </Grid>
          <Grid item xs={12} sm={12} md={8} lg={9} xl={9}>
            <div className="profile_heading">
              <Card
                sx={{ boxShadow: 2, backgroundColor: "purple" }}
                className="profile_heading_subtitle"
              >
                <div>
                  <Icon
                    path={mdiCashMultiple}
                    title="User Profile"
                    size={2}
                    horizontal
                    vertical
                    rotate={180}
                    color="white"
                  />
                </div>
                <div className="profileDetailsHeading">
                  <h6>Current Balance</h6>

                  <div style={{ color: "white", fontSize: "25px" }}>
                    {user.dues ? user.dues : 0}
                  </div>
                </div>
              </Card>
              <Card
                sx={{ boxShadow: 2, backgroundColor: "purple" }}
                className="profile_heading_subtitle group"
              >
                <div>
                  <Icon
                    path={mdiCalendarMonth}
                    title="User Profile"
                    size={2}
                    horizontal
                    vertical
                    rotate={180}
                    color="white"
                  />
                </div>
                <div className="profileDetailsHeading">
                  <h6>Monthly Dues</h6>
                  <div style={{ color: "white", fontSize: "25px" }}>
                    {user.groupNumber ? user.groupNumber : 0}
                  </div>
                </div>
              </Card>
              <Card
                sx={{ boxShadow: 2, backgroundColor: "purple" }}
                className="profile_heading_subtitle"
              >
                <div>
                  <Icon
                    path={mdiHandCoinOutline}
                    title="User Profile"
                    size={2}
                    horizontal
                    vertical
                    rotate={180}
                    color="white"
                  />
                </div>
                <div className="profileDetailsHeading">
                  <h6>Donations</h6>
                  <div style={{ color: "white", fontSize: "25px" }}>
                    {" "}
                    {user?.soulsWon ? user?.soulsWon : 0}
                  </div>
                </div>
              </Card>
            </div>

            <div className="main_profile_container">
              <Grid sx={{ marginTop: 1, boxShadow: 2 }} item>
                <Item className="full_profile_container">
                  <h4 className="full_profile">Salutation :</h4>
                  <h4 className="full_profile_details">{user.salutation}</h4>
                </Item>
              </Grid>
              <Grid sx={{ marginTop: 1, boxShadow: 2 }} item>
                <Item className="full_profile_container">
                  <h4 className="full_profile">Gender :</h4>
                  <h4 className="full_profile_details">{user.sex}</h4>
                </Item>
              </Grid>
              <Grid sx={{ marginTop: 1, boxShadow: 2 }} item>
                <Item className="full_profile_container">
                  <h4 className="full_profile">First Name :</h4>
                  <h4 className="full_profile_details">{user.firstName}</h4>
                </Item>
              </Grid>

              <Grid sx={{ marginTop: 1, boxShadow: 2 }} item>
                <Item className="full_profile_container">
                  <h4 className="full_profile">Last Name :</h4>
                  <h4 className="full_profile_details">{user.lastName}</h4>
                </Item>
              </Grid>

              {user.middleName && (
                <Grid sx={{ marginTop: 1, boxShadow: 2 }} item>
                  <Item className="full_profile_container">
                    <h4 className="full_profile">Middle Name :</h4>
                    <h4 className="full_profile_details">{user.middleName}</h4>
                  </Item>
                </Grid>
              )}
              <Grid sx={{ marginTop: 1, boxShadow: 2 }} item>
                <Item className="full_profile_container">
                  <h4 className="full_profile"> Membership Status :</h4>
                  <h4 className="full_profile_details">
                    {user.membershipStatus}
                  </h4>
                </Item>
              </Grid>
              <Grid sx={{ marginTop: 1, boxShadow: 2 }} item>
                <Item className="full_profile_container">
                  <h4 className="full_profile"> Occupation :</h4>
                  <h4 className="full_profile_details">{user.occupation}</h4>
                </Item>
              </Grid>
              {/*  */}
              <Grid sx={{ marginTop: 1, boxShadow: 2 }} item>
                <Item className="full_profile_container">
                  <h4 className="full_profile">Address :</h4>
                  <h4 className="full_profile_details">{user.address}</h4>
                </Item>
              </Grid>
              <Grid sx={{ marginTop: 1, boxShadow: 2 }} item>
                <Item className="full_profile_container">
                  <h4 className="full_profile">City :</h4>
                  <h4 className="full_profile_details">{user.city}</h4>
                </Item>
              </Grid>
              <Grid sx={{ marginTop: 1, boxShadow: 2 }} item>
                <Item className="full_profile_container">
                  <h4 className="full_profile"> Emergency Contact Name:</h4>
                  <h4 className="full_profile_details">
                    {user.emergencyContactName}
                  </h4>
                </Item>
              </Grid>
              <Grid sx={{ marginTop: 1, boxShadow: 2 }} item>
                <Item className="full_profile_container">
                  <h4 className="full_profile"> Emergency Contact :</h4>
                  <h4 className="full_profile_details">
                    {user.emergencyContact}
                  </h4>
                </Item>
              </Grid>

              <Grid sx={{ marginTop: 1, boxShadow: 2 }} item>
                <Item className="full_profile_container">
                  <h4 className="full_profile">Baptize :</h4>
                  <h4 className="full_profile_details">{user.baptism}</h4>
                </Item>
              </Grid>
              <Grid sx={{ marginTop: 1 }} item>
                <Item className="full_profile_container">
                  <h4 className="full_profile"> Occupation :</h4>
                  <h4 className="full_profile_details">{user.occupation}</h4>
                </Item>
              </Grid>
            </div>
          </Grid>
        </Grid>
      </Box>
    </div>
  ) : (
    <Loading />
  );
}

export default Finance;
