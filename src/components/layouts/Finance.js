import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Icon from "@mdi/react";
import { mdiCashMultiple, mdiHandCoinOutline, mdiCalendarMonth } from "@mdi/js";
import Img from "../../assets/images/avatar.png";
import Camera from "../../components/svg/Camera";
import Delete from "../../components/svg/Delete";
import { ToastContainer, toast } from "react-toastify";

import Fade from "@mui/material/Fade";
import Zoom from "@mui/material/Zoom";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { storage, db, auth } from "../../firebse";
import SendIcon from "@mui/icons-material/Send";
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
import ButtonLoader from "../ButtonLoader";

import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";
import {
  doc,
  setDoc,
  Timestamp,
  collection,
  getDocs,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import {
  ref,
  getDownloadURL,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import { styled } from "@mui/material/styles";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { getUserDetails } from "../../services/redux/reducers/userSlice";
import { useDispatch, useSelector } from "react-redux";
const id = Math.random().toString(36).slice(2);
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "none",
  boxShadow: 24,
  borderRadius: "6px",
  p: 4,
  pt: 1,
};

const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}));

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
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    profileDetails: { firstName, lastName, avatarPath },
  } = useSelector((state) => state.users);

  console.log("profileDetails", firstName, lastName, avatarPath);

  //HOOKS TO REQUEST FOR FUNDS
  const [openRequestFundsModal, setOpenRequestFundsModal] =
    React.useState(false);
  const handleOpenRequestFundsModal = () => setOpenRequestFundsModal(true);
  const handleCloseRequestFundsModal = () => setOpenRequestFundsModal(false);

  //HOOKS TO ADD FUNDS
  const [openAddFundsModal, setOpenAddFundsModal] = React.useState(false);
  const handleOpenAddFundsModal = () => setOpenAddFundsModal(true);
  const handleCloseAddFundsModal = () => setOpenAddFundsModal(false);

  const [sourceToAddfunds, setSourceToAddfunds] = React.useState("");
  const [amoutToAddfunds, setAmoutToAddfunds] = React.useState(null);
  const [status, setStatus] = React.useState("pending");

  const [totalDues, setTotalDues] = React.useState(0);
  const [totalDonCont, setTotalDonCon] = React.useState(0);
  const [currentBalance, setCurrentBalance] = React.useState(0);

  const [allMonthlyDues, setAllMonthlyDues] = React.useState([]);
  const [allDonationContributions, setAllDonationContributions] =
    React.useState([]);

  const dateConvertor = (timestamp) => {
    const milliseconds = timestamp * 1000;

    const dateObject = new Date(milliseconds);

    return dateObject.toLocaleString("en-US", { timeZoneName: "short" }); //2019-12-9 10:30:15
  };

  console.log("totalDues", totalDues);
  console.log("totalDonCont", totalDonCont);
  console.log("currentBalance", currentBalance);
  console.log("allDonationContributions", allDonationContributions);
  console.log("allMonthlyDues", allMonthlyDues);

  const handleSourceToAddFunds = (event) => {
    setSourceToAddfunds(event.target.value);
  };

  const totalDuesCollectiion = collection(
    db,
    "DGM_YOUTH_TotalTotalMonthlyDues"
  );
  const totalDonConCollectiion = collection(
    db,
    "DGM_YOUTH_TotaldonationsContributons"
  );
  const allMonths = collection(db, "DGM_YOUTH_Funds_monthlyDues");
  const allDonationAndContributions = collection(
    db,
    "DGM_YOUTH_Funds_donationsContributons"
  );

  const handleAddFunds = async (e) => {
    e.preventDefault();

    if (amoutToAddfunds === null || amoutToAddfunds <= 0) {
      setError(true);
      toast.error(`Invalid amout! Amount con not be empty or zero (0).`, {
        position: "top-right",
      });
      return;
    } else if (sourceToAddfunds === "") {
      setError(true);
      toast.error(`Please select source to add funds`, {
        position: "top-right",
      });
      return;
    }
    setLoading(true);
    try {
      await setDoc(
        doc(
          db,
          `${
            sourceToAddfunds === "donationsContributons"
              ? "DGM_YOUTH_Funds_donationsContributons"
              : "DGM_YOUTH_Funds_monthlyDues"
          }`,
          id + amoutToAddfunds
        ),
        {
          /* firstName, lastName, avatarPath */
          sourceToAddfunds,
          amoutToAddfunds,
          createdAt: Math.floor(Date.now() / 1000),
          status,
          addedBy: firstName + " " + lastName,
          picture: avatarPath,
        }
      );

      // ALWAYS CREATE THIS TABLE IN THE DATABSE

      if (sourceToAddfunds === "donationsContributons") {
        await updateDoc(
          doc(
            db,
            "DGM_YOUTH_TotaldonationsContributons",
            "donationsContributons"
          ),
          {
            total: totalDonCont + amoutToAddfunds * 1,
          }
        );
      } else {
        await updateDoc(
          doc(db, "DGM_YOUTH_TotalTotalMonthlyDues", "TotalMonltyDues"),
          {
            total: totalDues + amoutToAddfunds * 1,
          }
        );
      }

      setLoading(false);
      setAmoutToAddfunds("");
      setSourceToAddfunds("");

      setSuccess(true);
      toast.success(`Funds Successfully Added.`, {
        position: "top-right",
      });
      handleCloseAddFundsModal();
      setTimeout(function () {
        window.location.reload();
      }, 4000);
    } catch (e) {}
  };

  useEffect(() => {
    const getAllDonationAndContributions = async () => {
      const data = await getDocs(allDonationAndContributions);
      setAllDonationContributions(
        data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    };
    const getTotalMonthlyDues = async () => {
      const data = await getDocs(allMonths);
      setAllMonthlyDues(
        data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    };
    const getTotalDuesCollectiion = async () => {
      const data = await getDocs(totalDuesCollectiion);
      setTotalDues(
        data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))[0].total
      );
    };
    const getTotalDonCon = async () => {
      const data = await getDocs(totalDonConCollectiion);
      setTotalDonCon(
        data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))[0].total
      );
    };
    const getTotalFunds = async () => {
      const data1 = await getDocs(totalDonConCollectiion);
      const data2 = await getDocs(totalDuesCollectiion);

      let total =
        data1.docs.map((doc) => ({ ...doc.data(), id: doc.id }))[0].total +
        data2.docs.map((doc) => ({ ...doc.data(), id: doc.id }))[0].total;

      setCurrentBalance(total);
    };

    getTotalDuesCollectiion();
    getTotalDonCon();
    getTotalFunds();
    getTotalMonthlyDues();
    getAllDonationAndContributions();
  }, []);

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
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openRequestFundsModal}
        onClose={handleCloseRequestFundsModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openRequestFundsModal}>
          <Box sx={style}>
            <Typography
              id="transition-modal-title"
              color="purple"
              variant="h6"
              component="h2"
            >
              Request for funds
            </Typography>
            <form action="">
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  "& > :not(style)": { m: 1 },
                }}
              >
                <TextField
                  label="Enter Amount to request"
                  color="secondary"
                  fullWidth
                  type="number"
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  "& > :not(style)": { m: 1 },
                }}
              >
                <TextareaAutosize
                  aria-label="minimum height"
                  minRows={3}
                  placeholder="State purpose for fund request"
                  style={{ width: "100%", marginBottom: 20 }}
                />
              </Box>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Button
                  onClick={handleOpenRequestFundsModal}
                  size="large"
                  sx={{ width: "40%", background: "purple" }}
                  variant="contained"
                  endIcon={<SendIcon />}
                >
                  Submit
                </Button>
                <Button
                  onClick={handleCloseRequestFundsModal}
                  size="large"
                  sx={{ width: "40%", backgroundColor: "red" }}
                  variant="contained"
                  endIcon={<CancelIcon />}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Box>
        </Fade>
      </Modal>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openAddFundsModal}
        onClose={handleCloseAddFundsModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openAddFundsModal}>
          <Box sx={style}>
            <Typography
              color="purple"
              id="transition-modal-title"
              variant="h6"
              component="h2"
            >
              Add funds
            </Typography>
            <form action="" onSubmit={handleAddFunds}>
              <FormControl sx={{ mt: 2, mb: 2, minWidth: "100%" }}>
                <InputLabel id="demo-simple-select-helper-label">
                  Source
                </InputLabel>
                <Select
                  labelId="demo-simple-select-helper-label"
                  id="demo-simple-select-helper"
                  value={sourceToAddfunds}
                  label="Add funds"
                  onChange={handleSourceToAddFunds}
                >
                  <MenuItem value=""></MenuItem>
                  <MenuItem value={"monthlyDues"}>Monthly Dues</MenuItem>
                  <MenuItem value={"donationsContributons"}>
                    Donations / Contributons
                  </MenuItem>
                </Select>
                <FormHelperText>
                  {sourceToAddfunds === "" ? (
                    <p style={{ color: "purple", marginBottom: "-10px" }}>
                      Please select source to add funds
                    </p>
                  ) : null}
                </FormHelperText>
              </FormControl>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  "& > :not(style)": { mt: 1, mb: 2 },
                }}
              >
                <TextField
                  label="Enter Amount to add"
                  color="secondary"
                  fullWidth
                  step="0.01"
                  type="number"
                  value={amoutToAddfunds}
                  onChange={(e) => {
                    setAmoutToAddfunds(e.target.value);
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
                  <ButtonLoader />
                ) : (
                  <Button
                    type="submit"
                    size="large"
                    sx={{ width: "40%", background: "purple" }}
                    variant="contained"
                    endIcon={<SendIcon />}
                  >
                    Submit
                  </Button>
                )}

                <Button
                  onClick={handleCloseAddFundsModal}
                  size="large"
                  sx={{ width: "40%", backgroundColor: "red" }}
                  variant="contained"
                  endIcon={<CancelIcon />}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Box>
        </Fade>
      </Modal>
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
              onClick={handleOpenAddFundsModal}
              size="large"
              sx={{ width: "100%", marginBottom: 2 }}
              variant="contained"
              color="success"
              endIcon={<AddCircleIcon />}
            >
              Add Funds
            </Button>
            <Button
              onClick={handleOpenRequestFundsModal}
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

                  <div
                    style={{
                      color: "white",
                      fontSize: "25px",
                      textAlign: "right",
                    }}
                  >
                    {currentBalance ? currentBalance.toFixed(2) : 0}
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
                  <div
                    style={{
                      color: "white",
                      fontSize: "25px",
                      textAlign: "right",
                    }}
                  >
                    {totalDues ? totalDues : 0}
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
                  <h6>Donations / Contributons</h6>
                  <div
                    style={{
                      color: "white",
                      fontSize: "25px",
                      textAlign: "right",
                    }}
                  >
                    {" "}
                    {totalDonCont ? totalDonCont : 0}
                  </div>
                </div>
              </Card>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", width: "50%" }}
              >
                <div className="addToFundscontainer">
                  <Grid sx={{ marginTop: 1 }} item>
                    a
                    <Item className="full_profile_container">
                      <h4 className="full_profile"> Occupation :</h4>
                      <h4 className="full_profile_details">
                        {user.occupation}
                      </h4>
                    </Item>
                  </Grid>
                </div>
                <div className="addToFundscontainer">
                  b
                  <Grid sx={{ marginTop: 1, marginLeft: 1 }} item>
                    <Item className="full_profile_container">
                      <h4 className="full_profile"> Occupation :</h4>
                      <h4 className="full_profile_details">
                        {user.occupation}
                      </h4>
                    </Item>
                  </Grid>
                </div>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", width: "50%" }}
              >
                <div className="addToFundscontainer">
                  Monthly Dues History
                  {allMonthlyDues?.map((item, index) => (
                    <LightTooltip
                      title={
                        <div style={{ fontSize: "14PX", color: "purple" }}>
                          <div></div>
                          <div>
                            {" "}
                            <span style={{ color: "green" }}>
                              Added by :
                            </span>{" "}
                            {item?.addedBy}
                          </div>

                          <div>
                            <span style={{ color: "green" }}>Added at :</span>
                            {dateConvertor(item?.createdAt)}
                          </div>
                        </div>
                      }
                    >
                      <Grid
                        key={index}
                        sx={{ marginTop: 1, marginLeft: 1 }}
                        item
                      >
                        <Item className="full_profile_container">
                          <h6 className="full_profile"> Amount Added:</h6>
                          <h6 className="amoutToAddfunds">
                            + {item?.amoutToAddfunds}
                          </h6>
                        </Item>
                      </Grid>
                    </LightTooltip>
                  ))}
                </div>
                <div className="addToFundscontainer">
                  Donations / Contributons History
                  {allDonationContributions?.map((item, index) => (
                    <LightTooltip
                      title={
                        <div style={{ fontSize: "14PX", color: "purple" }}>
                          <div></div>
                          <div>
                            {" "}
                            <span style={{ color: "green" }}>
                              Added by :
                            </span>{" "}
                            {item?.addedBy}
                          </div>

                          <div>
                            <span style={{ color: "green" }}>Added at :</span>
                            {dateConvertor(item?.createdAt)}
                          </div>
                        </div>
                      }
                    >
                      <Grid
                        key={index}
                        sx={{ marginTop: 1, marginLeft: 1 }}
                        item
                      >
                        <Item className="full_profile_container">
                          <h6 className="full_profile"> Amount Added :</h6>
                          <h6 className="amoutToAddfunds">
                            + {item?.amoutToAddfunds}
                          </h6>
                        </Item>
                      </Grid>
                    </LightTooltip>
                  ))}
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
      </Box>
      {error && <ToastContainer />}
      {success && <ToastContainer />}
    </div>
  ) : (
    <Loading />
  );
}

export default Finance;
