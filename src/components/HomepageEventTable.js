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
import { db } from "../firebse";
import { collection, getDocs } from "firebase/firestore";
import { useSelector } from "react-redux";
import { doc, updateDoc } from "firebase/firestore";

export default function ControlledAccordions() {
  const { allUsers } = useSelector((state) => state.users);
  const [expanded, setExpanded] = React.useState(false);
  const [activities, setActivities] = React.useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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
                  <b>BREAKDOWN</b>
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
