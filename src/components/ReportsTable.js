import React, { useEffect, useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ButtonLoader from "./ButtonLoader";
import DeleteIcon from "@mui/icons-material/Delete";
import Tooltip from "@mui/material/Tooltip";
import { ToastContainer } from "react-toastify";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { db } from "../firebse";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import Moment from "react-moment";

import { Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";

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

export default function ControlledAccordions() {
  const [expanded, setExpanded] = React.useState(false);
  const [reports, setReports] = React.useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteReportloading, setDeleteReportLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [deleteEventId, setDeleteEventId] = useState(null);

  const [openDeleteModal, setOpendeleteModal] = React.useState(false);
  const handleOpendeleteModal = () => {
    setOpendeleteModal(true);
  };
  const handleCloseDeleteModal = () => setOpendeleteModal(false);
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const dateConvertor = (timestamp) => {
    const milliseconds = timestamp * 1000;
    const dateObject = new Date(milliseconds);
    return dateObject.toLocaleString("en-US", { timeZoneName: "short" }); //2019-12-9 10:30:15
  };
  const reportsCollectiion = collection(db, "DGM_YOUTH_Reports");
  const {
    profileDetails: { role },
  } = useSelector((state) => state.users);

  const deleteReport = async () => {
    setDeleteReportLoading(true);
    try {
      await deleteDoc(doc(db, "DGM_YOUTH_Reports", deleteEventId));

      setDeleteReportLoading(false);
      setOpendeleteModal(false);
      window.location.reload();
    } catch (err) {}
  };

  useEffect(() => {
    setLoading(true);
    const getUsers = async () => {
      const data = await getDocs(reportsCollectiion);
      setReports(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      setLoading(false);
    };

    getUsers();
  }, []);

  return (
    <div className="reportsTable">
      {success && <ToastContainer />}

      {loading ? (
        <ButtonLoader />
      ) : (
        <div>
          {/* DELETE REPORT MODAL */}
          <Modal
            open={openDeleteModal}
            onClose={handleCloseDeleteModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <p style={{ color: "purple", textAlign: "center" }}>
                Are you sure you want to delete this report ?
              </p>
              <div className="delete-image-modal">
                <button
                  onClick={deleteReport}
                  className="delete-image-modal-yes"
                >
                  {deleteReportloading ? <Spinner animation="border" /> : "Yes"}
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
                <Typography
                  sx={{ width: "100%", textAlign: "center", flexShrink: 0 }}
                >
                  <b> {report?.title}</b>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className="AccordionDetailsBreakdown">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <b>Content</b>
                    </div>
                    {role * 1 === 0 || role * 1 === 1 || role * 1 === 2 ? (
                      <div
                        className="edit-icon-backround"
                        onClick={() => {
                          handleOpendeleteModal();
                          setDeleteEventId(report?.id);
                        }}
                      >
                        <Tooltip title=" Delete report">
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
                    <p>{report?.content}</p>
                  </div>
                  <b>
                    Submitted by: <span>{report?.createdBy}</span>{" "}
                  </b>
                  <br />
                  <b>
                    Submitted at:{" "}
                    <span>
                      {" "}
                      <Moment fromNow>{report?.createdAt}</Moment>
                    </span>{" "}
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
