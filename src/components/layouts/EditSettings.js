import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Img from "../../assets/images/avatar.png";
import Camera from "../svg/Camera";
import Delete from "../svg/Delete";
import { storage, db, auth } from "../../firebse";
import { useNavigate } from "react-router-dom";

import {
  ref,
  getDownloadURL,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import SendIcon from "@mui/icons-material/Send";

import GroupIcon from "@mui/icons-material/Group";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Loading from "../Loading";
import TextField from "@mui/material/TextField";
import CancelIcon from "@mui/icons-material/Cancel";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
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

function EditSetting() {
  const [openDeleteModal, setOpendeleteModal] = React.useState(false);
  const handleOpendeleteModal = () => setOpendeleteModal(true);
  const navigate = useNavigate();
  const handleCloseDeleteModal = () => setOpendeleteModal(false);
  const [loading, setLoading] = useState(false);
  const [img, setImg] = useState();
  const [user, setUser] = useState();
  const [users, setUsers] = useState([]);
  const [departments, setDeparments] = useState([]);
  const [edit, setEdit] = useState(false);
  const [getEditDepartment, setEditDepartment] = useState(
    JSON.parse(localStorage.getItem("editDepartment"))
      ? JSON.parse(localStorage.getItem("editDepartment"))
      : null
  );

  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [departmentName, setDepartmentName] = useState(
    getEditDepartment?.departmentName || ""
  );
  const [groupLeaderName, setGroupLeaderName] = useState(
    getEditDepartment?.groupLeaderName ? getEditDepartment?.groupLeaderName : ""
  );
  const [gropAssitant, setGroupAssistant] = useState(
    getEditDepartment?.gropAssitant ? getEditDepartment?.gropAssitant : ""
  );
  const dispatch = useDispatch();
  const id = getEditDepartment?.id;
  const {
    profileDetails: { firstName, lastName, avatarPath },
  } = useSelector((state) => state.users);
  const { allDepartment } = useSelector((state) => state.departments);

  const usersCollectiion = collection(db, "DGM_YOUTH_users");
  const deparmentCollectiion = collection(db, "DGM_YOUTH_Departments");

  const handleUpadateDepartment = async (e) => {
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
        await updateDoc(doc(db, "DGM_YOUTH_Departments", id), {
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
        toast.success(`Department Update Success.`, {
          position: "top-right",
        });

        setTimeout(function () {
          navigate(`/settings`);
        }, 4000);
      } catch (error) {
        console.log(error);
      }
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
          System Management
        </h3>
      </div>
      <Box
        sx={{ flexGrow: 1 }}
        className="login-profile-page main-profile-page"
      >
        <Grid sx={{ boxShadow: 0 }} container spacing={2}>
          <Grid sx={{ boxShadow: 0 }} item xs={12} sm={12} md={4} lg={3} xl={3}>
            <Item>
              <div>
                <Box>
                  <Typography
                    color="purple"
                    id="transition-modal-title"
                    variant="h6"
                    component="h2"
                  >
                    Edit Department
                  </Typography>
                  <form action="" onSubmit={handleUpadateDepartment}>
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
                        Update
                      </Button>
                    </div>
                  </form>
                </Box>
              </div>
            </Item>
          </Grid>

          <Grid item xs={12} sm={12} md={8} lg={9} xl={9}>
            <h3 style={{ color: "purple", fontWeight: "bold" }}>
              List of Departments
            </h3>

            <div className="all-department-container">
              {allDepartment?.map((department) => (
                <div
                  key={department?.id}
                  className="main_profile_container department-list-container"
                >
                  <Grid sx={{ marginTop: 1, boxShadow: 2 }} item>
                    <Item className="full_profile_container">
                      <h4 className="full_profile">Name of Department :</h4>
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
                      <h4 className="full_profile">Asistant Leader :</h4>
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
      {loading && <Loading />}
    </div>
  ) : (
    <Loading />
  );
}

export default EditSetting;
