import React, { useEffect, useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ButtonLoader from "./ButtonLoader";
import { ToastContainer, toast } from "react-toastify";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { db } from "../firebse";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

export default function ControlledAccordions() {
  const [expanded, setExpanded] = React.useState(false);
  const [reports, setReports] = React.useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const dateConvertor = (timestamp) => {
    const milliseconds = timestamp * 1000;
    const dateObject = new Date(milliseconds);
    return dateObject.toLocaleString("en-US", { timeZoneName: "short" }); //2019-12-9 10:30:15
  };
  const reportsCollectiion = collection(db, "DGM_YOUTH_Reports");

  console.log("reportsCollectiion", reports);

  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(reportsCollectiion);
      setReports(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getUsers();
  }, []);

  return (
    <div className="reportsTable">
      {success && <ToastContainer />}

      {reports?.length === 0 ? (
        <ButtonLoader />
      ) : (
        <div>
          {reports?.map((report, index) => (
            <Accordion
              key={index}
              sx={{ marginTop: 1, marginBottom: 1 }}
              expanded={expanded === report?.id}
              onChange={handleChange(report?.id)}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id={index}
                style={{ color: "purple" }}
              >
                <Typography sx={{ width: "100%", textAlign: "center" ,flexShrink: 0 }}>
                  <b> {report?.title}</b>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className="AccordionDetailsBreakdown">
                  <b>Content</b>
                  <div>
                    <p>{report?.content}</p>
                  </div>
                  <b>
                    Submitted by: <span>{report?.createdBy}</span>{" "}
                  </b>
                  <br />
                  <b>
                    Submitted at:{" "}
                    <span>{dateConvertor(report?.createdAt)}</span>{" "}
                  </b>

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
