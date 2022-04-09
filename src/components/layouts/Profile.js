import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Img from "../../assets/images/avatar.png";
import Camera from "../../components/svg/Camera";
import Delete from "../../components/svg/Delete";
import { storage, db, auth } from "../../firebse";
import {
  ref,
  getDownloadURL,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import GroupIcon from "@mui/icons-material/Group";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
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
import Loading from "../Loading";
import { Spinner } from "react-bootstrap";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "none",
  boxShadow: 24,
  p: 4,
  borderRadius: "6px",
};
const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function Profile() {
  const [openDeleteModal, setOpendeleteModal] = React.useState(false);
  const handleOpendeleteModal = () => setOpendeleteModal(true);
  const handleCloseDeleteModal = () => setOpendeleteModal(false);
  const [loading, setLoading] = useState(false);
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
        setLoading(true);

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
          setLoading(false);
          setImg("");
        } catch (error) {}
      };
      uplaodImg();
    }
  }, [img]);
  const deleteImage = async () => {
    setLoading(true);
    try {
      deleteObject(ref(storage, user.avatarPath));

      await updateDoc(doc(db, "DGM_YOUTH_users", auth.currentUser.uid), {
        avatar: "",
        avatarPath: "",
      });
      setLoading(false);
      setOpendeleteModal(false);
      window.location.reload();
    } catch (err) {}
  };
  return user ? (
    <div className="layout_margin m-2 mt-3">
      <Modal
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <p style={{ color: "purple", textAlign: "center" }}>
            Are you sure you want to delete this image ?
          </p>
          <div className="delete-image-modal">
            <button onClick={deleteImage} className="delete-image-modal-yes">
              {loading ? <Spinner animation="border" /> : "Yes"}
            </button>
            <button
              onClick={handleCloseDeleteModal}
              className="delete-image-modal-no"
            >
              Cancel
            </button>
          </div>
        </Box>
      </Modal>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h3 className="page-heading" style={{ color: "purple" }}>
          Profile
        </h3>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <div>
            <Tooltip title=" Delete Profile">
              <span>
                <DeleteIcon
                  style={{
                    color: "red",
                    fontSize: 25,
                    marginRight: 30,
                    cursor: "pointer",
                  }}
                />
              </span>
            </Tooltip>
          </div>
          <div>
            <Tooltip title="Edit Profile">
              <Link to={`/edit-profile/${user.uid}`}>
                <span>
                  <EditIcon
                    style={{ color: "green", fontSize: 25, cursor: "pointer" }}
                  />
                </span>
              </Link>
            </Tooltip>
          </div>
        </div>
      </div>
      <Box
        sx={{ flexGrow: 1 }}
        className="login-profile-page main-profile-page"
      >
        <Grid sx={{ boxShadow: 0 }} container spacing={2}>
          <Grid sx={{ boxShadow: 0 }} item xs={12} sm={12} md={4} lg={3} xl={3}>
            <Item>
              <div className="profile_container">
                <div className="img_container">
                  <img src={user?.avatar || Img} alt="profle" />
                  <div className="overlay">
                    <div>
                      <label htmlFor="photo">
                        <Camera />
                      </label>
                      {user?.avatarPath ? (
                        <svg
                          onClick={handleOpendeleteModal}
                          xmlns="http://www.w3.org/2000/svg"
                          style={{
                            widt: "25px",
                            height: "25px",
                            cursor: "pointer",
                            color: "#f24957",
                          }}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      ) : null}
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        id="photo"
                        onChange={(e) => setImg(e.target.files[0])}
                      />
                    </div>
                  </div>
                </div>

                <div className="text_container">
                  <h3>
                    {user.firstName} <span>{user.lastName} </span>
                  </h3>
                  <p>{user.email}</p>
                  <hr />
                  <small>
                    Joined on : {user.createdAt?.toDate().toDateString()}
                  </small>
                </div>
              </div>
              <div>
                <div className="profile_subDetails">
                  Role :
                  <span style={{ color: "purple" }}>
                    {user.role === "1"
                      ? "President"
                      : user.role === "2"
                      ? "Vice President"
                      : user.role === "3"
                      ? "Tresurer"
                      : user.role === "4"
                      ? "Executive"
                      : user.role === "5"
                      ? "Member"
                      : null}
                  </span>
                </div>
                <div className="profile_subDetails">
                  Age :<span style={{ color: "purple" }}>{user.age}</span>
                </div>
                <div className="profile_subDetails">
                  Phone :<span style={{ color: "purple" }}>{user.phone}</span>
                </div>
                <div className="profile_subDetails">
                  Status :
                  <span
                    style={{
                      color:
                        user.status === "Very Active"
                          ? "green"
                          : user.status === "Active"
                          ? "blue"
                          : "red",
                    }}
                  >
                    {user.status}
                  </span>
                </div>
              </div>
            </Item>
          </Grid>
          <Grid item xs={12} sm={12} md={8} lg={9} xl={9}>
            <div className="profile_heading">
              <Card
                sx={{ boxShadow: 2, backgroundColor: "purple" }}
                className="profile_heading_subtitle"
              >
                <div>
                  {/* <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="profile_heading_subtitle_icon"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg> */}
                  <MonetizationOnIcon
                    fontSize="large"
                    className="profile_heading_subtitle_icon"
                  />
                </div>
                <div className="profileDetailsHeading">
                  <h6>Monthly Dues Paied</h6>

                  <div style={{ color: "white", fontSize: "25px" }}>
                    {user.dues ? user.dues : 0} / 12
                  </div>
                </div>
              </Card>
              <Card
                sx={{ boxShadow: 2, backgroundColor: "purple" }}
                className="profile_heading_subtitle group"
              >
                <div>
                  {/* <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="profile_heading_subtitle_icon"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg> */}

                  <GroupIcon
                    fontSize="large"
                    className="profile_heading_subtitle_icon"
                  />
                </div>
                <div className="profileDetailsHeading">
                  <h6> Group</h6>
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
                  <PersonAddIcon
                    fontSize="large"
                    className="profile_heading_subtitle_icon"
                  />
                </div>
                <div className="profileDetailsHeading">
                  <h6> Soules Won</h6>
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
                  <h4 className="full_profile_details">
                    {user?.salutation ? user.salutation : "Not available"}
                  </h4>
                </Item>
              </Grid>
              <Grid sx={{ marginTop: 1, boxShadow: 2 }} item>
                <Item className="full_profile_container">
                  <h4 className="full_profile">Gender :</h4>
                  <h4 className="full_profile_details">
                    {user?.sex ? user.sex : "Not available"}
                  </h4>
                </Item>
              </Grid>
              <Grid sx={{ marginTop: 1, boxShadow: 2 }} item>
                <Item className="full_profile_container">
                  <h4 className="full_profile">First Name :</h4>
                  <h4 className="full_profile_details">
                    {user?.firstName ? user?.firstName : "Not available"}
                  </h4>
                </Item>
              </Grid>

              <Grid sx={{ marginTop: 1, boxShadow: 2 }} item>
                <Item className="full_profile_container">
                  <h4 className="full_profile">Last Name :</h4>
                  <h4 className="full_profile_details">
                    {user?.lastName ? user?.lastName : "Not available"}
                  </h4>
                </Item>
              </Grid>

              {user.middleName && (
                <Grid sx={{ marginTop: 1, boxShadow: 2 }} item>
                  <Item className="full_profile_container">
                    <h4 className="full_profile">Middle Name :</h4>
                    <h4 className="full_profile_details">
                      {user?.middleName ? user.middleName : "Not available"}
                    </h4>
                  </Item>
                </Grid>
              )}
              <Grid sx={{ marginTop: 1, boxShadow: 2 }} item>
                <Item className="full_profile_container">
                  <h4 className="full_profile"> Membership Status :</h4>
                  <h4 className="full_profile_details">
                    {user?.membershipStatus
                      ? user.membershipStatus
                      : "Not available"}
                  </h4>
                </Item>
              </Grid>
              <Grid sx={{ marginTop: 1, boxShadow: 2 }} item>
                <Item className="full_profile_container">
                  <h4 className="full_profile"> Occupation :</h4>
                  <h4 className="full_profile_details">
                    {user?.occupation ? user.occupation : "Not available"}
                  </h4>
                </Item>
              </Grid>
              {/*  */}
              <Grid sx={{ marginTop: 1, boxShadow: 2 }} item>
                <Item className="full_profile_container">
                  <h4 className="full_profile">Address :</h4>
                  <h4 className="full_profile_details">
                    {user?.address ? user.address : "Not available"}
                  </h4>
                </Item>
              </Grid>
              <Grid sx={{ marginTop: 1, boxShadow: 2 }} item>
                <Item className="full_profile_container">
                  <h4 className="full_profile">City :</h4>
                  <h4 className="full_profile_details">
                    {user?.city ? user.city : "Not available"}
                  </h4>
                </Item>
              </Grid>
              <Grid sx={{ marginTop: 1, boxShadow: 2 }} item>
                <Item className="full_profile_container">
                  <h4 className="full_profile"> E. C. Name:</h4>
                  <h4 className="full_profile_details">
                    {user?.emergencyContactName
                      ? user.emergencyContactName
                      : "Not available"}
                  </h4>
                </Item>
              </Grid>
              <Grid sx={{ marginTop: 1, boxShadow: 2 }} item>
                <Item className="full_profile_container">
                  <h4 className="full_profile"> Emergency Contact :</h4>
                  <h4 className="full_profile_details">
                    {user?.emergencyContact
                      ? user.emergencyContact
                      : "Not available"}
                  </h4>
                </Item>
              </Grid>

              <Grid sx={{ marginTop: 1, boxShadow: 2 }} item>
                <Item className="full_profile_container">
                  <h4 className="full_profile">Baptize :</h4>
                  <h4 className="full_profile_details">
                    {user?.baptism ? user.baptism : "Not available"}
                  </h4>
                </Item>
              </Grid>
              <Grid sx={{ marginTop: 1 }} item>
                <Item className="full_profile_container">
                  <h4 className="full_profile"> Occupation :</h4>
                  <h4 className="full_profile_details">
                    {user?.occupation ? user.occupation : "Not available"}
                  </h4>
                </Item>
              </Grid>
            </div>
          </Grid>
        </Grid>
      </Box>

      {loading && <Loading />}
    </div>
  ) : (
    <Loading />
  );
}

export default Profile;
