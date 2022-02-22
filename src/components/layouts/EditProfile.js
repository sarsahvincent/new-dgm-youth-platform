import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import { useParams, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import { ToastContainer, toast } from "react-toastify";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebse";
import { doc, setDoc, Timestamp, getDoc, updateDoc } from "firebase/firestore";
import ButtonLoader from "../ButtonLoader";
import Invitee from "./Invitee";
import { useSelector, useDispatch } from "react-redux";
import { getUserDetails } from "../../services/redux/reducers/userSlice";

function EditProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const test = user?.firstName;
  const { profileDetails } = useSelector((state) => state.users);
  const [data, setData] = useState({
    salutation: profileDetails?.salutation ? profileDetails.salutation : "",
    firstName: profileDetails?.lastName ? profileDetails.firstName : "",
    middleName: profileDetails?.middleName ? profileDetails.middleName : "",
    lastName: profileDetails?.lastName ? profileDetails.lastName : "",
    emergencyContactName: profileDetails?.emergencyContactName
      ? profileDetails.emergencyContactName
      : "",
    occupation: profileDetails?.occupation ? profileDetails.occupation : "",
    maritalStatus: profileDetails?.maritalStatus
      ? profileDetails.maritalStatus
      : "",
    age: profileDetails?.age ? profileDetails.age : "",
    sex: profileDetails?.sex ? profileDetails.sex : "",
    membershipStatus: profileDetails?.membershipStatus
      ? profileDetails.membershipStatus
      : "",
    role: profileDetails?.role ? profileDetails.role : "",
    status: profileDetails?.status ? profileDetails.status : "",
    baptism: profileDetails?.baptism ? profileDetails.baptism : "",
    city: profileDetails?.city ? profileDetails.city : "",
    address: profileDetails?.address ? profileDetails.address : "",
    email: profileDetails?.email ? profileDetails.email : "",
    phone: profileDetails?.phone ? profileDetails.phone : "",
    emergencyContact: profileDetails?.emergencyContact
      ? profileDetails.emergencyContact
      : "",
    dues: profileDetails?.dues ? profileDetails.dues : 0,
    groupNumber: profileDetails?.groupNumber ? profileDetails.groupNumber : "",
    groupRole: profileDetails?.groupRole ? profileDetails.groupRole : "",
    soulsWon: profileDetails?.soulsWon ? profileDetails.soulsWon : 0,
    loading: null,
    error: false,
  });

  const {
    salutation,
    firstName,
    middleName,
    lastName,
    emergencyContactName,
    occupation,
    maritalStatus,
    age,
    sex,
    status,
    baptism,
    membershipStatus,
    role,
    city,
    address,
    email,
    phone,
    emergencyContact,
    dues,
    groupNumber,
    groupRole,
    soulsWon,

    error,
  } = data;

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setData({ ...data, error: null, loading: true });
    if (
      !salutation ||
      !firstName ||
      !lastName ||
      !emergencyContactName ||
      !occupation ||
      !maritalStatus ||
      !age ||
      !sex ||
      !status ||
      !baptism ||
      !city ||
      !address ||
      !phone ||
      !email ||
      !emergencyContact ||
      !role
    ) {
      setData({ ...data, error: "Please fill all required * fields." });
      return;
    }
    setLoading(true);

    const updateDate = async () => {
      try {
        await updateDoc(doc(db, "DGM_YOUTH_users", id), {
          salutation,
          firstName,
          middleName,
          lastName,
          emergencyContactName,
          occupation,
          maritalStatus,
          age,
          sex,
          status,
          baptism,
          membershipStatus,
          role,
          city,
          address,
          email,
          phone,
          emergencyContact,
          dues,
          groupNumber,
          groupRole,
          soulsWon,
        });

        await getDoc(doc(db, "DGM_YOUTH_users", id)).then((docSnap) => {
          if (docSnap.exists) {
            const data = docSnap.data();
            setUser(data);
            dispatch(getUserDetails(data));
          }
        });
        setLoading(false);
        setSuccess(true);

        setData({
          salutation: "",
          firstName: "",
          middleName: "",
          lastName: "",
          emergencyContactName: "",
          occupation: "",
          maritalStatus: "",
          age: "",
          sex: "",
          status: "",
          baptism: "",
          city: "",
          address: "",
          email: "",
          phone: "",
          membershipStatus: "",
          role: "",
          emergencyContact: "",
          dues: "",
          groupNumber: "",
          groupRole: "",
          soulsWon: "",
          loading: false,
          error: null,
        });

        toast.success(`Profile Successfully Updated!.`, {
          position: "top-right",
        });
        setTimeout(function () {
          navigate(`/profile-details/${id}`);
        }, 4000);
      } catch (e) {}
    };
    updateDate();
  };

  /*  useEffect(() => {
    getDoc(doc(db, "DGM_YOUTH_users", id)).then((docSnap) => {
      if (docSnap.exists) {
        setUser(docSnap.data());
      }
    });
  }, []); */

  return (
    <div className="layout_margin">
      <h3 style={{ color: "purple" }}>Edit Account</h3>
      <form action="" className="new_member_form" onSubmit={handleSubmit}>
        <Paper elevation={1} sx={{ padding: 1, mt: 1 }}>
          <div>
            <div className="new_member_form_group">
              <div>
                <label htmlFor="salutation"></label>
                <Box sx={{ m: 0.5, width: "35ch" }}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Salutation *
                    </InputLabel>
                    <Select
                      name="salutation"
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={salutation}
                      label="Salutation"
                      onChange={handleChange}
                    >
                      <MenuItem value="Mr">Mr</MenuItem>
                      <MenuItem value="Mrs">Mrs</MenuItem>
                      <MenuItem value="Miss">Miss</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </div>
              <div>
                <label htmlFor="role"></label>
                <Box sx={{ m: 0.5, width: "35ch" }}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Role *
                    </InputLabel>
                    <Select
                      name="role"
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={role}
                      label="Role"
                      onChange={handleChange}
                    >
                      <MenuItem value="5">Member</MenuItem>
                      <MenuItem value="4">Exective</MenuItem>
                      <MenuItem value="1">President</MenuItem>
                      <MenuItem value="2">Vice President</MenuItem>
                      <MenuItem value="3">Treasurer</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </div>
            </div>
            <div className="new_member_form_group">
              <div>
                <label htmlFor="membershipStatus"></label>
                <Box sx={{ m: 0.5, width: "35ch" }}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Membership Status *
                    </InputLabel>
                    <Select
                      name="membershipStatus"
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={membershipStatus}
                      label="Membership Status"
                      onChange={handleChange}
                    >
                      <MenuItem value="New Convert">New Convert</MenuItem>
                      <MenuItem value="Member">Member</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </div>
              <div>
                <label htmlFor="status"></label>
                <Box sx={{ m: 0.5, width: "35ch" }}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Status *
                    </InputLabel>
                    <Select
                      name="status"
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={status}
                      label="Status"
                      onChange={handleChange}
                    >
                      <MenuItem value="Very Active">Very active</MenuItem>
                      <MenuItem value="Active">Active</MenuItem>
                      <MenuItem value="Inactive">Inactive</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </div>
            </div>
            <div className="new_member_form_group">
              <div>
                <div>
                  <label htmlFor="firstName"></label>
                  <Box
                    component="form"
                    sx={{
                      "& > :not(style)": { m: 0.5, width: "35ch" },
                    }}
                    noValidate
                    autoComplete="off"
                  >
                    <TextField
                      name="firstName"
                      id="outlined-basic"
                      label="First Name *"
                      variant="outlined"
                      defaultValue={firstName}
                      onChange={handleChange}
                    />
                  </Box>
                </div>
              </div>
              <div>
                <label htmlFor="middleName"></label>
                <Box
                  component="form"
                  sx={{
                    "& > :not(style)": { m: 0.5, width: "35ch" },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <TextField
                    name="middleName"
                    id="outlined-basic"
                    label="Middle Name"
                    variant="outlined"
                    defaultValue={middleName}
                    onChange={handleChange}
                  />
                </Box>
              </div>
            </div>
            <div className="new_member_form_group">
              <div>
                <label htmlFor="lastName"></label>
                <Box
                  component="form"
                  sx={{
                    "& > :not(style)": { m: 0.5, width: "35ch" },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <TextField
                    name="lastName"
                    id="outlined-basic"
                    label="Last Name *"
                    variant="outlined"
                    value={lastName}
                    onChange={handleChange}
                  />
                </Box>
              </div>
              <div>
                <label htmlFor="sex"></label>
                <Box sx={{ m: 0.5, width: "35ch" }}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Gender *
                    </InputLabel>
                    <Select
                      name="sex"
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={sex}
                      label="Gender"
                      onChange={handleChange}
                    >
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </div>
            </div>
            <div className="new_member_form_group">
              <div>
                <label htmlFor="maritalStatus"></label>
                <Box sx={{ m: 0.5, width: "35ch" }}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Marital Status *
                    </InputLabel>
                    <Select
                      name="maritalStatus"
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={maritalStatus}
                      label="Age"
                      onChange={handleChange}
                    >
                      <MenuItem value="Single">Single</MenuItem>
                      <MenuItem value="Married">Married</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </div>
              <div>
                <label htmlFor="age"></label>
                <Box
                  component="form"
                  sx={{
                    "& > :not(style)": { m: 0.5, width: "35ch" },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <TextField
                    name="age"
                    type="number"
                    id="outlined-basic"
                    label="Age *"
                    variant="outlined"
                    value={age}
                    onChange={handleChange}
                  />
                </Box>
              </div>
            </div>
            <div className="new_member_form_group">
              <div>
                <label htmlFor="occupation"></label>
                <Box
                  component="form"
                  sx={{
                    "& > :not(style)": { m: 0.5, width: "35ch" },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <TextField
                    name="occupation"
                    id="outlined-basic"
                    label="Occupation *"
                    variant="outlined"
                    value={occupation}
                    onChange={handleChange}
                  />
                </Box>
              </div>
              <div>
                <label htmlFor="phone"></label>
                <Box
                  component="form"
                  sx={{
                    "& > :not(style)": { m: 0.5, width: "35ch" },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <TextField
                    name="phone"
                    id="outlined-basic"
                    label="Phone Number"
                    type="number"
                    variant="outlined"
                    value={phone}
                    onChange={handleChange}
                  />
                </Box>
              </div>
            </div>
          </div>
        </Paper>
        <Paper elevation={1} sx={{ padding: 1, mt: 1 }}>
          <div>
            <div className="new_member_form_group">
              <div>
                <label htmlFor="baptism"></label>
                <Box sx={{ m: 0.5, width: "35ch" }}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Baptism *
                    </InputLabel>
                    <Select
                      name="baptism"
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={baptism}
                      label="baptism"
                      onChange={handleChange}
                    >
                      <MenuItem value="Yes">Yes</MenuItem>
                      <MenuItem value="No">No</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </div>
              <div>
                <label htmlFor="city"></label>
                <Box
                  component="form"
                  sx={{
                    "& > :not(style)": { m: 0.5, width: "35ch" },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <TextField
                    name="city"
                    id="outlined-basic"
                    label="City *"
                    variant="outlined"
                    value={city}
                    onChange={handleChange}
                  />
                </Box>
              </div>
            </div>
            <div className="new_member_form_group">
              <div>
                <label htmlFor="address"></label>
                <Box
                  component="form"
                  sx={{
                    "& > :not(style)": { m: 0.5, width: "35ch" },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <TextField
                    name="address"
                    id="outlined-basic"
                    label="Address *"
                    variant="outlined"
                    value={address}
                    onChange={handleChange}
                  />
                </Box>
              </div>
              <div>
                <label htmlFor="email"></label>
                <Box
                  component="form"
                  sx={{
                    "& > :not(style)": { m: 0.5, width: "35ch" },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <TextField
                    name="email"
                    id="outlined-basic"
                    label="Email *"
                    type="email"
                    variant="outlined"
                    value={email}
                    onChange={handleChange}
                  />
                </Box>
              </div>
            </div>
            <div className="new_member_form_group">
              <div>
                <label htmlFor="emergencyContactName"></label>
                <Box
                  component="form"
                  sx={{
                    "& > :not(style)": { m: 0.5, width: "35ch" },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <TextField
                    name="emergencyContactName"
                    id="outlined-basic"
                    label="Emergency Contact Name *"
                    type="text"
                    variant="outlined"
                    value={emergencyContactName}
                    onChange={handleChange}
                  />
                </Box>
              </div>
              <div>
                <label htmlFor="emergencyContact"></label>
                <Box
                  component="form"
                  sx={{
                    "& > :not(style)": { m: 0.5, width: "35ch" },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <TextField
                    name="emergencyContact"
                    id="outlined-basic"
                    label="Emergency Contact *"
                    type="number"
                    variant="outlined"
                    value={emergencyContact}
                    onChange={handleChange}
                  />
                </Box>
              </div>
            </div>
            <div className="new_member_form_group">
              <div>
                <label htmlFor="groupNumber"></label>
                <Box sx={{ m: 0.5, width: "35ch" }}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Group Number
                    </InputLabel>
                    <Select
                      name="groupNumber"
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={groupNumber}
                      label=" Group Number"
                      onChange={handleChange}
                    >
                      <MenuItem value="1">1</MenuItem>
                      <MenuItem value="2">2</MenuItem>
                      <MenuItem value="3">3</MenuItem>
                      <MenuItem value="4">4</MenuItem>
                      <MenuItem value="5">5</MenuItem>
                      <MenuItem value="6">6</MenuItem>
                      <MenuItem value="7">7</MenuItem>
                      <MenuItem value="8">8</MenuItem>
                      <MenuItem value="9">9</MenuItem>
                      <MenuItem value="10">10</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </div>
              <div>
                <label htmlFor="groupRole"></label>
                <Box sx={{ m: 0.5, width: "35ch" }}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Group Role
                    </InputLabel>
                    <Select
                      name="groupRole"
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={groupRole}
                      label=" Group Role"
                      onChange={handleChange}
                    >
                      <MenuItem value="Mr">Leader</MenuItem>
                      <MenuItem value="Mrs">Asistant Leader</MenuItem>
                      <MenuItem value="Miss">Member</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </div>
            </div>
            <div className="new_member_form_group">
              <div>
                <label htmlFor="soulsWon"></label>
                <Box
                  component="form"
                  sx={{
                    "& > :not(style)": { m: 0.5, width: "35ch" },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <TextField
                    name="soulsWon"
                    id="outlined-basic"
                    label="Souls Won"
                    type="number"
                    variant="outlined"
                    value={soulsWon}
                    onChange={handleChange}
                  />
                </Box>
              </div>
              <div>
                <label htmlFor="dues"></label>
                <Box
                  component="form"
                  sx={{
                    "& > :not(style)": { m: 0.5, width: "35ch" },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <TextField
                    name="dues"
                    id="outlined-basic"
                    label="Monthly Dues*"
                    type="number"
                    variant="outlined"
                    value={dues}
                    onChange={handleChange}
                  />
                </Box>
              </div>
            </div>

            {membershipStatus === "New Convert" && (
              <div className="new_member_form_group">
                <Invitee />
                {/* <div>
                  <label htmlFor="invitee"></label>
                  <Box
                    component="form"
                    sx={{
                      "& > :not(style)": { m: 0.5, width: "35ch" },
                    }}
                    noValidate
                    autoComplete="off"
                  >
                    <TextField
                      name="password"
                      id="outlined-basic"
                      label="Password *"
                      type="password"
                      variant="outlined"
                      value={password}
                      onChange={handleChange}
                    />
                  </Box>
                </div> */}
              </div>
            )}
          </div>
          {error ? <p className="error">{error}</p> : null}

          <Button
            type="submit"
            sx={{
              textAlign: "center",
              height: 50,
              width: "100%",
              mt: 4,
              backgroundColor: "purple",
              fontSize: 18,
              fontWeight: "bolder",
              letterSpacing: "5px",
            }}
            variant="contained"
            endIcon={loading ? null : <SendIcon />}
          >
            {loading ? <ButtonLoader /> : "Update Profile"}
          </Button>
        </Paper>
        {success && <ToastContainer />}
      </form>
    </div>
  );
}

export default EditProfile;