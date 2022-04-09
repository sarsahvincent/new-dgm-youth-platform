import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebse";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import ButtonLoader from "../ButtonLoader";

const id = Math.random().toString(36).slice(2);
function AddAccount() {
  const [data, setData] = useState({
    salutation: "",
    firstName: "",
    middleName: "",
    lastName: "",
    emergencyContactName: "",
    occupation: "",
    maritalStatus: "",
    age: "",
    sex: "",
    membershipStatus: "",
    role: "",
    status: "",
    baptism: "",
    city: "",
    address: "",
    email: "",
    phone: "",
    emergencyContact: "",
    password: "",
    confirmPassword: "",
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
    password,
    confirmPassword,
    loading,
    error,
  } = data;

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setData({ ...data, error: null, loading: true });

    if (role * 1 === 5) {
      if (
        !salutation ||
        !firstName ||
        !lastName ||
        !occupation ||
        !maritalStatus ||
        !age ||
        !sex ||
        !status ||
        !baptism ||
        !city ||
        !address ||
        !phone ||
        !membershipStatus ||
        !role
      ) {
        setData({
          ...data,
          error: "Please fill all required * fields.",
        });
        return;
      }
    } else if (role * 1 !== 5) {
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
        !password ||
        !membershipStatus ||
        !role
      ) {
        setData({ ...data, error: "Please fill all required * fields." });
        return;
      }
    } else if (role !== 5 && password !== confirmPassword) {
      setData({ ...data, error: "Password do not match" });
      return;
    }

    try {
      if (role * 1 === 5) {
        await setDoc(doc(db, "DGM_YOUTH_users", id + firstName + lastName), {
          uid: id + firstName + lastName,
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
          city,
          address,
          email,
          phone,
          fullName: `${firstName} ${middleName} ${lastName} `,
          membershipStatus,
          role,
          emergencyContact,
          createdAt: Timestamp.fromDate(new Date()),
          isOnline: true,
        });
      } else {
        const result = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        await setDoc(doc(db, "DGM_YOUTH_users", result.user.uid), {
          uid: result.user.uid,
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
          city,
          address,
          email,
          phone,
          fullName: `${firstName} ${middleName} ${lastName} `,
          membershipStatus,
          role,
          emergencyContact,
          createdAt: Timestamp.fromDate(new Date()),
          isOnline: true,
        });
      }

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
        loading: false,
        error: null,
      });
      window.location.reload();
    } catch (err) {
      setData({ ...data, error: err.message, loading: false });
    }
  };

  return (
    <div className="layout_margin">
      <h3 style={{ color: "purple" }}>New Account</h3>
      <form action="" className="new_member_form" onSubmit={handleSubmit}>
        <Paper
          className="firstSectionForm"
          elevation={1}
          sx={{ padding: 1, mt: 1 }}
        >
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
                      <MenuItem value="1">President</MenuItem>
                      <MenuItem value="2">Vice President</MenuItem>
                      <MenuItem value="6">Financial Secretary</MenuItem>
                      <MenuItem value="3">Treasurer</MenuItem>
                      <MenuItem value="4">Exective</MenuItem>
                      <MenuItem value="5">Member</MenuItem>
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
                      value={firstName}
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
                    value={middleName}
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
                <label htmlFor="password"></label>
                <Box
                  component="form"
                  sx={{
                    "& > :not(style)": { m: 0.5, width: "35ch" },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <TextField
                    disabled={role === "5"}
                    name="password"
                    id="outlined-basic"
                    label="Password *"
                    type="password"
                    variant="outlined"
                    value={password}
                    onChange={handleChange}
                  />
                </Box>
              </div>
              <div>
                <label htmlFor="confirmPassword"></label>
                <Box
                  component="form"
                  sx={{
                    "& > :not(style)": { m: 0.5, width: "35ch" },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <TextField
                    disabled={role === "5"}
                    name="confirmPassword"
                    id="outlined-basic"
                    label="Confirm Password *"
                    type="password"
                    variant="outlined"
                    value={confirmPassword}
                    onChange={handleChange}
                  />
                </Box>
              </div>
            </div>
            {membershipStatus === "New Convert" && (
              <div className="new_member_form_group">
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
            style={{
              textAlign: "center",
              height: 50,
              width: "100%",
              marginTop: 20,
              backgroundColor: "purple",
              fontSize: 18,
              fontWeight: "bolder",
              letterSpacing: "5px",
              borderRadius: 2,
              marginBottom: 10,
            }}
            variant="contained"
            endIcon={loading ? null : <SendIcon />}
          >
            {loading ? <ButtonLoader /> : "Register"}
          </Button>
        </Paper>
      </form>
    </div>
  );
}

export default AddAccount;
