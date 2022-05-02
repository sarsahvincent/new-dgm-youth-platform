import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { storage, db } from "../../firebse";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import SendIcon from "@mui/icons-material/Send";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import LockResetIcon from "@mui/icons-material/LockReset";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Loading from "../Loading";
import TextField from "@mui/material/TextField";
import CancelIcon from "@mui/icons-material/Cancel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import {
  getAllUsers,
  getUserDetails,
} from "../../services/redux/reducers/userSlice";
import {
  getDepartments,
  getCureentEditDepartment,
} from "../../services/redux/reducers/departmentSlice";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "react-bootstrap";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { ToastContainer, toast } from "react-toastify";
import UserTableAvatar from "../UserTableAvatar";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 380,
  bgcolor: "background.paper",
  border: "none",
  boxShadow: 24,
  p: 4,
  borderRadius: "6px",
  margin: "0 auto",
};
const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function Settings() {
  const [loggedinUser, setLoggedinUser] = useState(
    localStorage.getItem("loggedinUser")
      ? JSON.parse(localStorage.getItem("loggedinUser"))
      : []
  );
  const auth = getAuth();

  // HOOKS FOR RESETTING PASSWORD
  const [openResetPasswordModal, setOpenResetPasswordModal] =
    React.useState(false);
  const handleOpenresetPasswordModal = () => {
    setOpenResetPasswordModal(true);
  };
  const handleCloseResetPasswordModal = () => setOpenResetPasswordModal(false);

  // HOOKS FOR DELETING DEPARTMENT
  const [openDeleteModal, setOpendeleteModal] = React.useState(false);
  const handleOpendeleteModal = () => {
    setOpendeleteModal(true);
  };
  const handleCloseDeleteModal = () => setOpendeleteModal(false);

  // HOOKS FOR ADDING DEPARTMENT
  const [openDepartmentModal, setOpenDepartmentModal] = React.useState(false);
  const handleOpenDepartmentModal = () => {
    setOpenDepartmentModal(true);
  };
  const handleCloseDepartmentModal = () => setOpenDepartmentModal(false);

  // HOOKS FOR ADDING IMAGE
  const [openImagetModal, setOpenImagetModal] = React.useState(false);
  const handleOpenImagetModal = () => {
    setOpenImagetModal(true);
  };
  const handleCloseImageModal = () => setOpenImagetModal(false);

  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [loading, setLoading] = useState(false);
  const [img, setImg] = useState();
  const [user, setUser] = useState();
  const [users, setUsers] = useState([]);
  const [departments, setDeparments] = useState([]);
  const [editDepartmentId, setEditDepartmentId] = useState(null);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [departmentName, setDepartmentName] = useState("");
  const [groupLeaderName, setGroupLeaderName] = useState("");
  const [gropAssitant, setGroupAssistant] = useState("");
  const dispatch = useDispatch();
  const id = Math.random().toString(36).slice(2);
  const [loadingImage, setLoadingImage] = useState(false);
  const [email, setEmail] = useState("");
  const {
    profileDetails: { firstName, lastName, avatarPath },
  } = useSelector((state) => state.users);
  const { allDepartment } = useSelector((state) => state.departments);

  const usersCollectiion = collection(db, "DGM_YOUTH_users");
  const deparmentCollectiion = collection(db, "DGM_YOUTH_Departments");

  const handleUpdateDepartment = async (e) => {
    e.preventDefault();
    if (
      departmentName === "" ||
      groupLeaderName === "" ||
      gropAssitant === ""
    ) {
      setError(true);
      toast.error(`All fields required`, {
        position: "top-right",
      });
    } else if (departmentName.length > 25) {
      setError(true);
      toast.error(`Department Name should be at least 25 characters`, {
        position: "top-right",
      });
    } else {
      setLoading(true);
      try {
        await setDoc(doc(db, "DGM_YOUTH_Departments", id), {
          departmentName,
          groupLeaderName,
          gropAssitant,
          createdAt: Math.floor(Date.now() / 1000),
          createdBy: firstName + " " + lastName,
        });

        setLoading(false);
        setDepartmentName("");
        setGroupLeaderName("");
        setGroupAssistant("");
        setSuccess(true);
        toast.success(`Department Creation Success.`, {
          position: "top-right",
        });

        setTimeout(function () {
          window.location.reload();
        }, 4000);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (email === "") {
      setError(true);
      toast.error(`Email connot be empty`, {
        position: "top-right",
      });
    } else {
      setLoading(true);
      sendPasswordResetEmail(auth, email)
        .then(() => {
          setOpenResetPasswordModal(false);
          setEmail("");
          setLoading(false);
          setSuccess(true);
          toast.success(`A password reset link has beem sent to ${email}.`, {
            position: "top-right",
          });
        })
        .catch((error) => {
          setOpenResetPasswordModal(false);
          setLoading(false);

          const errorCode = error.code;
          const errorMessage = error.message;
          // ..
        });
    }
  };

  const deleteDepartment = async () => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, "DGM_YOUTH_Departments", editDepartmentId));

      setLoading(false);
      setOpendeleteModal(false);
      window.location.reload();
    } catch (err) {}
  };

  useEffect(() => {
    setLoadingDepartments(true);
    const getAllDepartment = async () => {
      const data = await getDocs(deparmentCollectiion);
      setDeparments(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    dispatch(getDepartments(departments));

    getAllDepartment();
    setLoadingDepartments(false);
  }, []);

  setTimeout(() => {
    dispatch(getDepartments(departments));
  }, 1000);

  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(usersCollectiion);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    dispatch(getAllUsers(users));

    getUsers();
  }, []);

  setTimeout(() => {
    dispatch(getAllUsers(users));
  }, 1000);
  useEffect(() => {
    getDoc(doc(db, "DGM_YOUTH_users", auth.currentUser.uid)).then((docSnap) => {
      if (docSnap.exists) {
        setUser(docSnap.data());
        dispatch(getUserDetails(docSnap.data()));
      }
    });
  }, [img]);

  useEffect(() => {
    if (img) {
      const uplaodImg = async () => {
        setLoadingImage(true);

        const imgRef = ref(
          storage,
          `dgm-program/avatar/${new Date().getTime()} - ${img.name}`
        );
        try {
          const snap = await uploadBytes(imgRef, img);
          const url = await getDownloadURL(ref(storage, snap.ref.fullPath));

          await updateDoc(
            doc(db, "DGM_YOUTH_program_image", "DGM_YOUTH_program_image"),
            {
              image: url,
              imagePath: snap.ref.fullPath,
            }
          );
          setLoadingImage(false);
          setOpenImagetModal(false);
          setImg("");
          setSuccess(true);
          toast.success(`Image Upload Success.`, {
            position: "top-right",
          });
        } catch (error) {}
      };
      uplaodImg();
    }
  }, [img]);

  return allDepartment ? (
    <div className="layout_margin m-2 mt-3">
      {/*RESET PASSWORD MODAL*/}
      <Modal
        open={openResetPasswordModal}
        onClose={handleCloseResetPasswordModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="pro-image-uplaod-input">
          <p style={{ color: "purple", textAlign: "center" }}>
            A reset password link will be sent to the email below.
          </p>
          <form action="" onSubmit={handleResetPassword}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                "& > :not(style)": { mt: 1, mb: 2 },
              }}
            >
              <TextField
                label="Enter Email"
                color="secondary"
                fullWidth
                step="0.01"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </Box>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {loading ? (
                <Loading />
              ) : (
                <Button
                  disabled={loading}
                  type="submit"
                  size="large"
                  sx={{ width: "40%", background: "purple" }}
                  variant="contained"
                  endIcon={<SendIcon />}
                >
                  Reset
                </Button>
              )}
              <Button
                disabled={loading}
                onClick={handleCloseResetPasswordModal}
                size="large"
                sx={{ width: "40%", background: "red" }}
                variant="contained"
                endIcon={<CancelIcon />}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Box>
      </Modal>
      {/* AA PROGRAM MODAL */}
      <Modal
        open={openImagetModal}
        onClose={handleCloseImageModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="pro-image-uplaod-input">
          {loadingImage ? (
            <p style={{ color: "purple", textAlign: "center" }}>
              Uploading image . Please wait
            </p>
          ) : (
            <p style={{ color: "purple", textAlign: "center" }}>
              Please select and image to upload
            </p>
          )}

          {loadingImage ? (
            <Loading />
          ) : (
            <input
              type="file"
              accept="image/*"
              id="photo"
              onChange={(e) => setImg(e.target.files[0])}
            />
          )}
        </Box>
      </Modal>
      {/* DELETE DEPARTMENT MODAL */}
      <Modal
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <p style={{ color: "purple", textAlign: "center" }}>
            Are you sure you want to delete this Department ?
          </p>
          <div className="delete-image-modal">
            <button
              onClick={deleteDepartment}
              className="delete-image-modal-yes"
            >
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
      {/* CREATE DEPARTMENT MODAL*/}
      <Modal
        open={openDepartmentModal}
        onClose={handleCloseDepartmentModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div>
            <Box>
              <Typography
                color="purple"
                id="transition-modal-title"
                variant="h6"
                component="h2"
              >
                Create Department
              </Typography>
              <form action="" onSubmit={handleUpdateDepartment}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    "& > :not(style)": { mt: 1, mb: 2 },
                  }}
                >
                  <TextField
                    label="Department Name"
                    color="secondary"
                    fullWidth
                    step="0.01"
                    type="text"
                    value={departmentName}
                    onChange={(e) => {
                      setDepartmentName(e.target.value);
                    }}
                  />
                </Box>
                <FormControl sx={{ mt: 2, mb: 2, minWidth: "100%" }}>
                  <InputLabel id="demo-simple-select-helper-label">
                    Select a leader
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={groupLeaderName}
                    label="Select a leader"
                    onChange={(e) => setGroupLeaderName(e.target.value)}
                  >
                    {users?.map((member, index) => (
                      <MenuItem
                        className="d-flex align-items-center justify-content-between"
                        key={index}
                        value={
                          member.firstName +
                          "  " +
                          member.lastName +
                          ":" +
                          member.phone +
                          ":" +
                          member.avatar
                        }
                      >
                        {member.firstName + " " + member.lastName}{" "}
                        <UserTableAvatar url={member.avatar} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl sx={{ mt: 2, mb: 2, minWidth: "100%" }}>
                  <InputLabel id="demo-simple-select-helper-label">
                    Select Asistant Leader
                  </InputLabel>
                  <Select
                    className="d-flex align-items-center justify-content-between"
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={gropAssitant}
                    label="Select Assistant Leader"
                    onChange={(e) => setGroupAssistant(e.target.value)}
                  >
                    <MenuItem value=""></MenuItem>
                    {users?.map((member, index) => (
                      <MenuItem
                        className="d-flex align-items-center justify-content-between"
                        key={index}
                        value={
                          member.firstName +
                          "  " +
                          member.lastName +
                          ":" +
                          member.phone +
                          ":" +
                          member.avatar
                        }
                      >
                        {member.firstName + " " + member.lastName}
                        <UserTableAvatar url={member.avatar} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Button
                    disabled={loading}
                    type="submit"
                    size="large"
                    sx={{ width: "40%", background: "purple" }}
                    variant="contained"
                    endIcon={<SendIcon />}
                  >
                    Create
                  </Button>
                  <Button
                    onClick={handleCloseDepartmentModal}
                    size="large"
                    sx={{ width: "40%", background: "red" }}
                    variant="contained"
                    endIcon={<CancelIcon />}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Box>
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
          System Management
        </h3>
      </div>
      <Box
        sx={{ flexGrow: 1 }}
        className="login-profile-page main-profile-page"
      >
        <Grid sx={{ boxShadow: 0 }} container spacing={2}>
          <Grid sx={{ boxShadow: 0 }} item xs={12} sm={12} md={4} lg={3} xl={3}>
            {/* CREATE DEPARTMENT BUTTON */}
            <Button
              disabled={
                loggedinUser?.role * 1 === 3 ||
                loggedinUser?.role * 1 === 4 ||
                loggedinUser?.role * 1 === 5 ||
                loggedinUser?.role * 1 === 6 ||
                loggedinUser?.role * 1 === 7
              }
              style={{ marginLeft: "55px" }}
              onClick={handleOpenDepartmentModal}
              size="large"
              sx={{ width: "80%", marginBottom: 2 }}
              variant="contained"
              color="secondary"
              endIcon={<AddCircleIcon />}
            >
              ADD DEPARTMENT
            </Button>
          </Grid>
          <Grid sx={{ boxShadow: 0 }} item xs={12} sm={12} md={4} lg={3} xl={3}>
            {/* ADD PROGRAM IMAGE BUTTON */}
            <Button
              disabled={
                loggedinUser?.role * 1 === 5 || loggedinUser?.role * 1 === 7
              }
              style={{ marginLeft: "55px" }}
              onClick={handleOpenImagetModal}
              size="large"
              sx={{ width: "80%", marginBottom: 2 }}
              variant="contained"
              color="secondary"
              endIcon={<AddCircleIcon />}
            >
              Add PROGRAM IMAGE
            </Button>
          </Grid>
          <Grid sx={{ boxShadow: 0 }} item xs={12} sm={12} md={4} lg={3} xl={3}>
            {/*RESET PASSWORD  BUTTON */}
            <Button
              disabled={
                loggedinUser?.role * 1 === 2 ||
                loggedinUser?.role * 1 === 3 ||
                loggedinUser?.role * 1 === 4 ||
                loggedinUser?.role * 1 === 5 ||
                loggedinUser?.role * 1 === 6 ||
                loggedinUser?.role * 1 === 7
              }
              style={{ marginLeft: "55px" }}
              onClick={handleOpenresetPasswordModal}
              size="large"
              sx={{ width: "80%", marginBottom: 2 }}
              variant="contained"
              color="secondary"
              endIcon={<LockResetIcon />}
            >
              RESET PASSWORD
            </Button>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={8}
            lg={9}
            xl={9}
            className="prog-department-container"
          >
            <h3 style={{ color: "purple", fontWeight: "bold" }}>
              List of Departments
            </h3>
            <div className="all-department-container">
              {allDepartment?.map((department) => (
                <div
                  key={department?.id}
                  className="main_profile_container department-list-container"
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {loggedinUser?.role * 1 === 1 && (
                      <div
                        className="edit-icon-backround"
                        onClick={() => {
                          dispatch(getCureentEditDepartment(department));
                        }}
                      >
                        <Link to={`/edit-department/${department?.id}`}>
                          <Tooltip title="Edit Profile">
                            <span
                              onClick={() => {
                                localStorage.setItem(
                                  "editDepartment",
                                  JSON.stringify(department)
                                );
                              }}
                            >
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
                    )}
                    {loggedinUser?.role * 1 === 2 && (
                      <div
                        className="edit-icon-backround"
                        onClick={() => {
                          dispatch(getCureentEditDepartment(department));
                        }}
                      >
                        <Link to={`/edit-department/${department?.id}`}>
                          <Tooltip title="Edit Profile">
                            <span
                              onClick={() => {
                                localStorage.setItem(
                                  "editDepartment",
                                  JSON.stringify(department)
                                );
                              }}
                            >
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
                    )}

                    {loggedinUser?.role * 1 === 1 && (
                      <div
                        className="edit-icon-backround"
                        onClick={() => {
                          setEditDepartmentId(department?.id);
                        }}
                      >
                        <Tooltip title=" Delete Department">
                          <span onClick={handleOpendeleteModal}>
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
                  <Grid sx={{ marginTop: 1, boxShadow: 2 }} item>
                    <Item className="full_profile_container">
                      <h4 className="full_profile">Name :</h4>
                      <h4 className="full_profile_details">
                        {department?.departmentName
                          ? department.departmentName
                          : "Not available"}
                      </h4>
                    </Item>
                  </Grid>
                  <Grid sx={{ marginTop: 1, boxShadow: 2 }} item>
                    <Item className="full_profile_container">
                      <h4 className="full_profile">Leader :</h4>
                      <h4 className="full_profile_details">
                        {department?.groupLeaderName
                          ? department.groupLeaderName.split(":", 1)
                          : "Not available"}
                      </h4>
                    </Item>
                  </Grid>
                  <Grid sx={{ marginTop: 1, boxShadow: 2 }} item>
                    <Item className="full_profile_container">
                      <h4 className="full_profile">Phone :</h4>
                      <h4 className="full_profile_details">
                        {department?.groupLeaderName
                          ? department.groupLeaderName.split(":")[1]
                          : "Not available"}
                      </h4>
                    </Item>
                  </Grid>
                  <Grid sx={{ marginTop: 1, boxShadow: 2 }} item>
                    <Item className="full_profile_container">
                      <h4 className="full_profile">Asistant:</h4>
                      <h4 className="full_profile_details">
                        {department?.gropAssitant
                          ? department.gropAssitant.split(":", 1)
                          : "Not available"}
                      </h4>
                    </Item>
                  </Grid>
                  <Grid sx={{ marginTop: 1, boxShadow: 2 }} item>
                    <Item className="full_profile_container">
                      <h4 className="full_profile">Phone :</h4>
                      <h4 className="full_profile_details">
                        {department?.gropAssitant
                          ? department.gropAssitant.split(":")[1]
                          : "Not available"}
                      </h4>
                    </Item>
                  </Grid>
                </div>
              ))}
            </div>
          </Grid>
        </Grid>
      </Box>
      {error && <ToastContainer />}
      {success && <ToastContainer />}
      {(loading || loadingImage) && <Loading />}
    </div>
  ) : (
    <Loading />
  );
}

export default Settings;
