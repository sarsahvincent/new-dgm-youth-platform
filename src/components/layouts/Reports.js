import React, { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import tinymce from "tinymce/tinymce";
import ReportTable from "../ReportsTable";
import Loading from "../Loading";
import ButtonLoader from "../ButtonLoader";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { storage, db, auth } from "../../firebse";
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

function Reports() {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [limit, setLimit] = useState();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loadEditor, setLoadEditor] = useState(true);
  const id = Math.random().toString(36).slice(2);
  const {
    profileDetails: { firstName, lastName, avatarPath },
  } = useSelector((state) => state.users);

  const handleReportContent = (value) => {
    setContent(value);
    setLimit(false);
  };

  const totalDuesCollectiion = collection(db, "DGM_YOUTH_Reports");
  const handleSubmitReport = async (e) => {
    e.preventDefault();
    if (content === "" || title === "") {
      setError(true);
      toast.error(`All fields required`, {
        position: "top-right",
      });
    } else {
      setLoading(true);
      try {
        await setDoc(doc(db, "DGM_YOUTH_Reports", id), {
          title,
          content,
          createdAt: Math.floor(Date.now() / 1000),
          createdBy: firstName + " " + lastName,
        });

        setLoading(false);
        setTitle("");
        setContent("");
        setSuccess(true);
        toast.success(`Report Submission Success.`, {
          position: "top-right",
        });

        setTimeout(function () {
          window.location.reload();
        }, 4000);
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <div className="reportSubmitContainer-main  layout_margin d-flex justify-content-between m-2 mt-3">
      <div>
        <form
          className="reportSubmitContainer"
          action=""
          onSubmit={handleSubmitReport}
        >
          <label htmlFor="">Report Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label htmlFor="">Report Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            name=""
            id=""
            cols="30"
            rows="10"
          ></textarea>
          <button disabled={loading} type="submit">
            {" "}
            {loading ? <ButtonLoader /> : " Submit Report"}
          </button>
        </form>
      </div>

      <div className="reportsTable d-flex flex-column">
        <label htmlFor="">Reports History</label>
        <ReportTable />
      </div>
      {error && <ToastContainer />}
      {success && <ToastContainer />}
    </div>
  );
}

export default Reports;
