import React, { useEffect, useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import Typography from "@mui/material/Typography";
import ButtonLoader from "./ButtonLoader";
import Menu from "@mui/material/Menu";
import { ToastContainer, toast } from "react-toastify";
import MenuItem from "@mui/material/MenuItem";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { db } from "../firebse";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { Spinner } from "react-bootstrap";

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
export default function ControlledAccordions({ loggedinUser }) {
  console.log("loggedinUser", loggedinUser);
  const [openDeleteModal, setOpendeleteModal] = React.useState(false);
  const handleOpendeleteModal = () => {
    setOpendeleteModal(true);
  };
  const handleCloseDeleteModal = () => setOpendeleteModal(false);
  const [expanded, setExpanded] = React.useState(false);
  const [activities, setActivities] = React.useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [deleteEventId, setDeleteEventId] = useState(null);
  const [user, setUser] = useState(
    localStorage.getItem("loggedinUser")
      ? JSON.parse(localStorage.getItem("loggedinUser"))
      : []
  );

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const activitiesCollectiion = collection(db, "DGM_YOUTH_Activities");
  const updateStatus = async (id, status) => {
    setLoading(true);

    const updateDate = async () => {
      try {
        await updateDoc(doc(db, "DGM_YOUTH_Activities", id), {
          status,
        });

        setLoading(false);
        setSuccess(true);

        toast.success(`Status Successfully Updated!.`, {
          position: "top-right",
        });

        setTimeout(function () {
          window.location.reload();
        }, 4000);
      } catch (err) {}
    };

    updateDate();
  };

  const deleteEvent = async () => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, "DGM_YOUTH_Activities", deleteEventId));

      setLoading(false);
      setOpendeleteModal(false);
      window.location.reload();
    } catch (err) {}
  };

  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(activitiesCollectiion);
      setActivities(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getUsers();
  }, []);

  return (
    <div className="activitiesTable">
      {success && <ToastContainer />}

      {activities.length === 0 ? (
        <ButtonLoader />
      ) : (
        <div>
          {/* DELETE DEPARTMENT MODAL */}
          <Modal
            open={openDeleteModal}
            onClose={handleCloseDeleteModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <p style={{ color: "purple", textAlign: "center" }}>
                Are you sure you want to delete this activity ?
              </p>
              <div className="delete-image-modal">
                <button
                  onClick={deleteEvent}
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
          {activities.map((activity, index) => (
            <Accordion
              key={index}
              sx={{ marginTop: 1, marginBottom: 1 }}
              expanded={expanded === activity.id}
              onChange={handleChange(activity.id)}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id={index}
                style={{ color: activity?.executed === true ? "purple" : null }}
              >
                <Typography sx={{ width: "33%", flexShrink: 0 }}>
                  {activity.title}
                </Typography>
                {activity?.status === "executed" ? (
                  <Typography sx={{ color: "green" }}>
                    Executed
                    <span>
                      <CheckCircleOutlineIcon
                        style={{ color: "green", fontSize: 20 }}
                      />
                    </span>
                  </Typography>
                ) : activity?.status === "approved" ? (
                  <Typography sx={{ color: "blue" }}>
                    Approved{" "}
                    <span>
                      <AssignmentTurnedInIcon
                        style={{ color: "blue", fontSize: 20 }}
                      />
                    </span>
                  </Typography>
                ) : (
                  <Typography sx={{ color: "red" }}>
                    Pending{" "}
                    <span>
                      <PendingActionsIcon
                        style={{ color: "red", fontSize: 20 }}
                      />
                    </span>
                  </Typography>
                )}
              </AccordionSummary>
              <AccordionDetails>
                <div className="AccordionDetailsBreakdown">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <b>BREAKDOWN</b>
                    </div>

                    {user?.role * 1 === 1 || user?.role * 1 === 2 ? (
                      <div
                        className="edit-icon-backround"
                        onClick={() => {
                          handleOpendeleteModal();
                          setDeleteEventId(activity?.id);
                        }}
                      >
                        <Tooltip title=" Delete event">
                          <span>
                            <DeleteIcon
                              style={{
                                color: "white",
                                fontSize: 25,

                                cursor: "pointer",
                              }}
                            />
                          </span>
                        </Tooltip>
                      </div>
                    ) : null}
                  </div>

                  <div>
                    {activity?.formValues.map((activity, index) => (
                      <div key={index}>
                        <span className="AccordionDetailsBreakdownName">
                          {activity?.name}
                        </span>{" "}
                        {""}
                        <span>Quantiy: {activity?.quantity}</span> / Unit Cost:{" "}
                        <span> ${activity?.unitCost}</span> / Total ={" "}
                        <span>
                          {" "}
                          ${activity?.quantity * 1 * (activity?.unitCost * 1)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <b>
                    Totol: <span>{activity?.total}</span>{" "}
                  </b>

                  {user?.role * 1 === 1 || user?.role * 1 === 2 ? (
                    <PopupState variant="popover" popupId="demo-popup-menu">
                      {(popupState) => (
                        <React.Fragment>
                          <MoreVertIcon
                            sx={{ cursor: "pointer", color: "green" }}
                            {...bindTrigger(popupState)}
                          />

                          <Menu {...bindMenu(popupState)}>
                            <div
                              onClick={() => {
                                updateStatus(activity?.id, "approved");
                              }}
                            >
                              <MenuItem onClick={popupState.close}>
                                Approve
                              </MenuItem>
                            </div>

                            <div
                              onClick={() => {
                                updateStatus(activity?.id, "pending");
                              }}
                            >
                              <MenuItem onClick={popupState.close}>
                                Pending
                              </MenuItem>
                            </div>

                            <div
                              onClick={() => {
                                updateStatus(activity?.id, "executed");
                              }}
                            >
                              <MenuItem onClick={popupState.close}>
                                Executed
                              </MenuItem>
                            </div>
                          </Menu>
                        </React.Fragment>
                      )}
                    </PopupState>
                  ) : null}

                  {loading && <ButtonLoader />}
                </div>
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      )}
    </div>
  );
}
