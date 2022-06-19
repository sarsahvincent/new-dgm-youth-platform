import React, { useState, useEffect } from "react";
import { db } from "../../firebse";
import { collection, doc, getDocs, deleteDoc } from "firebase/firestore";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import DeleteIcon from "@mui/icons-material/Delete";
import Tooltip from "@mui/material/Tooltip";
import Loading from "../Loading";
import { getProgramContacts } from "../../services/redux/reducers/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "react-bootstrap";
import Modal from "@mui/material/Modal";
import { ToastContainer, toast } from "react-toastify";

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

function ProgramsAndContacts() {
  // HOOKS FOR DELETING DEPARTMENT
  const [openDeleteModal, setOpendeleteModal] = React.useState(false);
  const handleOpendeleteModal = () => {
    setOpendeleteModal(true);
  };
  const handleCloseDeleteModal = () => setOpendeleteModal(false);

  const dateConvertor = (timestamp) => {
    const milliseconds = timestamp * 1000;
    const dateObject = new Date(milliseconds);
    return dateObject.toLocaleString("en-US", { timeZoneName: "short" }); //2019-12-9 10:30:15
  };
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [deleteContactId, setDeleteContactId] = useState(null);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loggedinUser, setLoggedinUser] = useState(
    localStorage.getItem("loggedinUser")
      ? JSON.parse(localStorage.getItem("loggedinUser"))
      : []
  );
  const dispatch = useDispatch();
  const id = Math.random().toString(36).slice(2);
  const {
    profileDetails: { firstName, lastName, avatarPath },
  } = useSelector((state) => state.users);
  const { programContacts } = useSelector((state) => state.departments);

  const contactCollection = collection(db, "DGM_YOUTH_contacts");

  const deleteContact = async () => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, "DGM_YOUTH_contacts", deleteContactId));

      setLoading(false);
      setOpendeleteModal(false);
      window.location.reload();
    } catch (err) {}
  };

  useEffect(() => {
    setLoading(true);
    const getAllContacts = async () => {
      const data = await getDocs(contactCollection);
      setContacts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    dispatch(getProgramContacts(contacts));

    getAllContacts();
    setLoading(false);
  }, []);

  setTimeout(() => {
    dispatch(getProgramContacts(contacts));
  }, 1000);

  return contacts ? (
    <div className="layout_margin m-2 mt-3">
      {/* DELETE DEPARTMENT MODAL */}
      <Modal
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <p style={{ color: "purple", textAlign: "center" }}>
            Are you sure you want to delete this Contact ?
          </p>
          <div className="delete-image-modal">
            <button onClick={deleteContact} className="delete-image-modal-yes">
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
          Program Contacts
        </h3>
      </div>

      <Box
        sx={{ flexGrow: 1 }}
        className="login-profile-page main-profile-page"
      >
        <Grid sx={{ boxShadow: 0 }} container spacing={2}>
          <Grid
            item
            xs={12}
            sm={12}
            md={8}
            lg={9}
            xl={9}
            className="prog-department-container"
          >
            <div className="all-department-container">
              {!contacts ||
                (contacts.length === 0 && (
                  <h4 style={{ color: "purple" }}>No data found</h4>
                ))}
              {contacts?.map((contact) => (
                <div
                  key={contact?.id}
                  className="main_profile_container prog-contact-list-container"
                >
                  {loggedinUser?.role * 1 === 1 ||
                  loggedinUser?.role * 1 === 0 ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <div
                        className="edit-icon-backround"
                        onClick={() => {
                          setDeleteContactId(contact?.id);
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
                    </div>
                  ) : null}
                  <Grid sx={{ marginTop: 1, boxShadow: 2 }} item>
                    <Item className="full_profile_container">
                      <h4 className="full_profile">Name :</h4>
                      <h4 className="full_profile_details">
                        {contact?.name ? contact.name : "Not available"}
                      </h4>
                    </Item>
                  </Grid>
                  <Grid sx={{ marginTop: 1, boxShadow: 2 }} item>
                    <Item className="full_profile_container">
                      <h4 className="full_profile">Phone :</h4>
                      <h4 className="full_profile_details">
                        {contact?.phone ? contact.phone : "Not available"}
                      </h4>
                    </Item>
                  </Grid>
                  <Grid sx={{ marginTop: 1, boxShadow: 2 }} item>
                    <Item className="full_profile_container">
                      <h4 className="full_profile">Location :</h4>
                      <h4 className="full_profile_details">
                        {contact?.location ? contact.location : "Not available"}
                      </h4>
                    </Item>
                  </Grid>

                  <Grid sx={{ marginTop: 1, boxShadow: 2 }} item>
                    <Item className="full_profile_container">
                      <h4 className="full_profile">Sent :</h4>
                      <h6 className="full_profile_details">
                        {contact?.sentAt
                          ? dateConvertor(contact.sentAt)
                          : "Not available"}
                      </h6>
                    </Item>
                  </Grid>
                  <Grid sx={{ marginTop: 1, boxShadow: 2 }} item>
                    <Item className="full_profile_container">
                      <h4 className="full_profile">Message:</h4>
                      <p className="full_profile_details">
                        {contact?.content ? contact.content : "Not available"}
                      </p>
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

export default ProgramsAndContacts;
