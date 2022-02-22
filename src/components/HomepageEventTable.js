import React, { useEffect } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import { db } from "../firebse";
import { collection, getDocs } from "firebase/firestore";
import { useSelector } from "react-redux";

export default function ControlledAccordions() {
  const { allUsers } = useSelector((state) => state.users);
  const [expanded, setExpanded] = React.useState(false);
  const [activities, setActivities] = React.useState([]);
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const activitiesCollectiion = collection(db, "DGM_YOUTH_Activities");

  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(activitiesCollectiion);
      setActivities(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getUsers();
  }, []);

  return (
    <div className="activitiesTable">
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
                  <PendingActionsIcon style={{ color: "red", fontSize: 20 }} />
                </span>
              </Typography>
            )}
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Nulla facilisi. Phasellus sollicitudin nulla et quam mattis
              feugiat. Aliquam eget maximus est, id dignissim quam.
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}
