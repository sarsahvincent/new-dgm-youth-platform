import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Img from "../../assets/images/avatar.png";
import Camera from "../../components/svg/Camera";
import Delete from "../../components/svg/Delete";
import { storage, db, auth } from "../../firebse";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  ref,
  getDownloadURL,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { styled } from "@mui/material/styles";
import GroupIcon from "@mui/icons-material/Group";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Loading from "../Loading";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Tooltip from "@mui/material/Tooltip";
import Modal from "@mui/material/Modal";
import { getUserDetails } from "../../services/redux/reducers/userSlice";
import { Spinner } from "react-bootstrap";

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

function ProfileDetails() {
  //HOOKS FOR CONTROLLING DELETE IMAGE MODAL
  const [openDeleteModal, setOpendeleteModal] = React.useState(false);
  const handleOpendeleteModal = () => setOpendeleteModal(true);
  const handleCloseDeleteModal = () => setOpendeleteModal(false);

  //HOOKS FOR CONTROLLING DELETE USER MODAL
  const [openDeleteUserModal, setOpendeletUsereModal] = React.useState(false);
  const handleOpendeleteUserModal = () => setOpendeletUsereModal(true);
  const handleCloseDeleteUserModal = () => setOpendeletUsereModal(false);

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { id } = useParams();
  const [img, setImg] = useState();
  const [user, setUser] = useState();

  const [deleteUserId, setDeleteUserId] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    const getUsers = async () => {
      await getDoc(doc(db, "DGM_YOUTH_users", id)).then((docSnap) => {
        if (docSnap.exists) {
          const data = docSnap.data();
          setUser(data);
          dispatch(getUserDetails(data));
        }
      });
    };
    getUsers();
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
          await updateDoc(doc(db, "DGM_YOUTH_users", id), {
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

  const deletUser = async () => {
    setLoading(true);
    try {
      if (user.avatarPath) {
        deleteObject(ref(storage, user.avatarPath));
        await deleteDoc(doc(db, "DGM_YOUTH_users", user?.uid));
      } else {
        await deleteDoc(doc(db, "DGM_YOUTH_users", user?.uid));
      }
      setLoading(false);
      setOpendeleteModal(false);
      navigate("/");
    } catch (err) {}
  };

  const deleteImage = async () => {
    setLoading(true);
    try {
      deleteObject(ref(storage, user.avatarPath));

      await updateDoc(doc(db, "DGM_YOUTH_users", user?.uid), {
        avatar: "",
        avatarPath: "",
      });
      setLoading(false);
      setOpendeleteModal(false);
      navigate("/");
      window.location.reload();
    } catch (err) {}
  };

  return user ? (
    <div className="layout_margin profile-detial-main-layout m-2 mt-3">
      {/* DELETE USER MODAL */}
      <Modal
        open={openDeleteUserModal}
        onClose={handleCloseDeleteUserModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <p style={{ color: "purple", textAlign: "center" }}>
            Are you sure you want to delete this user ?
          </p>
          <div className="delete-image-modal">
            <button onClick={deletUser} className="delete-image-modal-yes">
              {loading ? <Spinner animation="border" /> : "Yes"}
            </button>
            <button
              onClick={handleCloseDeleteUserModal}
              className="delete-image-modal-no"
            >
              Cancel
            </button>
          </div>
        </Box>
      </Modal>

      {/* DELTE IMAGE MODAL */}
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
        <h3 style={{ color: "purple" }}>Profile Details</h3>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <div className="edit-icon-backround">
            <Link to={`/edit-profile/${user.uid}`}>
              <Tooltip title="Edit Profile">
                <span>
                  <EditIcon
                    style={{
                      color: "white",
                      fontSize: 18,
                      cursor: "pointer",
                    }}
                  />
                </span>
              </Tooltip>
            </Link>
          </div>
          {auth?.currentUser?.uid !== user.uid && (
            <div
              onClick={handleOpendeleteUserModal}
              className="edit-icon-backround"
            >
              <Tooltip title=" Delete Profile">
                <span>
                  <DeleteIcon
                    style={{
                      color: "white",
                      fontSize: 18,

                      cursor: "pointer",
                    }}
                  />
                </span>
              </Tooltip>
            </div>
          )}
        </div>
      </div>
      <Box sx={{ flexGrow: 1 }}>
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
                  <MonetizationOnIcon
                    fontSize="large"
                    className="profile_heading_subtitle_icon"
                  />
                </div>
                <div className="profileDetailsHeading">
                  <h6>Monthly Dues Paied</h6>
                  <div style={{ color: "white", fontSize: "18px" }}>
                    {user.dues ? user.dues : 0} / 12
                  </div>
                </div>
              </Card>
              <Card
                sx={{ boxShadow: 2, backgroundColor: "purple" }}
                className="profile_heading_subtitle group"
              >
                <div>
                  <GroupIcon
                    fontSize="large"
                    className="profile_heading_subtitle_icon"
                  />
                </div>
                <div className="profileDetailsHeading">
                  <h6>Department</h6>
                  <div style={{ color: "white", fontSize: "18px" }}>
                    {user?.department ? user?.department : "Not assigned"}
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
                  <div style={{ color: "white", fontSize: "18px" }}>
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
                  <h4 className="full_profile"> E. C. Name:</h4>
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
      {loading && <Loading />}
    </div>
  ) : (
    <Loading />
  );
}

export default ProfileDetails;
