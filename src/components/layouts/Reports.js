import React, { useEffect, useState } from "react";
import ReportTable from "../ReportsTable";
import ButtonLoader from "../ButtonLoader";
import { ToastContainer, toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { auth, db } from "../../firebse";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { getUserDetails } from "../../services/redux/reducers/userSlice";

function Reports() {
  const time = new Date().getTime();

  const [loggedinUser, setLoggedinUser] = useState(
    localStorage.getItem("loggedinUser")
      ? JSON.parse(localStorage.getItem("loggedinUser"))
      : []
  );
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const id = Math.random().toString(36).slice(2);
  const {
    profileDetails: { firstName, lastName,  role },
  } = useSelector((state) => state.users);

  const dispatch = useDispatch();

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
          createdAt: time,
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

  useEffect(() => {
    getDoc(doc(db, "DGM_YOUTH_users", auth.currentUser.uid)).then((docSnap) => {
      if (docSnap.exists) {
        setLoggedinUser(docSnap.data());
        dispatch(getUserDetails(docSnap.data()));
        localStorage.setItem("loggedinUser", JSON.stringify(docSnap.data()));
      }
    });
  }, []);
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
            disabled={role * 1 === 5 || role * 1 === 7}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label htmlFor="">Report Content</label>
          <textarea
            disabled={role * 1 === 5 || role * 1 === 7}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            name=""
            id=""
            cols="30"
            rows="10"
          ></textarea>
          <button
            type="submit"
            disabled={role * 1 === 5 || role * 1 === 7 || loading}
          >
            {loading ? <ButtonLoader /> : " Submit Report"}
          </button>
        </form>
      </div>

      <div className="reportsTable d-flex flex-column">
        <label htmlFor="">Submitted Reports</label>
        <ReportTable />
      </div>
      {error && <ToastContainer />}
      {success && <ToastContainer />}
    </div>
  );
}

export default Reports;
