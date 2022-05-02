import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { db } from "../firebse";
import { doc, setDoc, collection, getDocs } from "firebase/firestore";
import ButtonLoader from "./ButtonLoader";
import { useDispatch } from "react-redux";
import { getAllActivities } from "../services/redux/reducers/activitiesSlice";
import _ from "lodash";

const id = Math.random().toString(36).slice(2);

const ActivityCreator = () => {
  const [formValues, setFormValues] = useState([
    { name: "", quantity: "", unitCost: "", total: "" },
  ]);
  const [activites, setActivites] = React.useState([]);
  const activitiesCollectiion = collection(db, "DGM_YOUTH_Activities");
  const [status, setStatus] = React.useState("pending");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activityTotal, setActivityTotal] = React.useState(0);
  const dispatch = useDispatch();
  let handleChange = (i, e) => {
    let newFormValues = [...formValues];
    newFormValues[i][e.target.name] = e.target.value;
    setFormValues(newFormValues);
  };
  const [loggedinUser, setLoggedinUser] = useState(
    localStorage.getItem("loggedinUser")
      ? JSON.parse(localStorage.getItem("loggedinUser"))
      : []
  );

  let addFormFields = () => {
    setFormValues([
      ...formValues,
      { name: "", quantity: "", unitCost: "", total: "" },
    ]);
  };

  let removeFormFields = (i) => {
    let newFormValues = [...formValues];
    newFormValues.splice(i, 1);
    setFormValues(newFormValues);
  };

  let activityTotals = [];

  const getToalUnitCosts = () => {
    formValues.map((value) =>
      activityTotals.push(value?.unitCost * 1 * (value?.quantity * 1))
    );
  };

  const activityTotalsSum = () => {
    return _.sum(activityTotals);
  };

  const getAllActivityTotals = () => {
    setActivityTotal(activityTotalsSum());
  };
  let handleSubmit = async (event) => {
    event.preventDefault();

    if (
      formValues[0].name === "" ||
      formValues[0].quantity === "" ||
      formValues[0].unitCost === "" ||
      title === ""
    ) {
      setError(true);
      toast.error(`Please fill all input fields.`, {
        position: "top-right",
      });

      return;
    }
    setLoading(true);
    try {
      await setDoc(doc(db, "DGM_YOUTH_Activities", id + title), {
        formValues,
        title,
        createdAt: Math.floor(Date.now() / 1000),
        status,
        total: activityTotal,
      });
      const data = await getDocs(activitiesCollectiion);
      setActivites(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      dispatch(getAllActivities(activites));

      setLoading(false);
      setFormValues([{ name: "", quantity: "", unitCost: "", total: "" }]);
      setTitle("");
      setSuccess(true);
      toast.success(`Activity Successfully Submitted!.`, {
        position: "top-right",
      });
      setTimeout(function () {
        window.location.reload();
      }, 4000);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getToalUnitCosts();
    getAllActivityTotals();
  }, [formValues]);

  return (
    <form className="activityFormContainer" onSubmit={handleSubmit}>
      <div className="activity-container-heading">
        <input
          disabled={
            loggedinUser?.role * 1 === 5 || loggedinUser?.role * 1 === 7
          }
          placeholder="Enter Title"
          className="activityTitle"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          disabled={true}
          placeholder={`Total: ${activityTotal}`}
          className="activityTitle"
          type="text"
        />
      </div>
      {formValues.map((element, index) => (
        <div className="form-inline" key={index}>
          <input
            disabled={
              loggedinUser?.role * 1 === 5 || loggedinUser?.role * 1 === 7
            }
            className="itemName"
            placeholder="Name of item"
            type="text"
            name="name"
            value={element.name || ""}
            onChange={(e) => handleChange(index, e)}
          />

          <input
            disabled={
              loggedinUser?.role * 1 === 5 || loggedinUser?.role * 1 === 7
            }
            placeholder="Quantity"
            type="number"
            name="quantity"
            value={element.quantity || ""}
            onChange={(e) => handleChange(index, e)}
          />

          <input
            disabled={
              loggedinUser?.role * 1 === 5 || loggedinUser?.role * 1 === 7
            }
            placeholder="Unit Cost GH"
            type="number"
            name="unitCost"
            value={element.unitCost || ""}
            onChange={(e) => handleChange(index, e)}
          />

          <input
            className="total"
            placeholder="Total"
            disabled
            type="number"
            name="total"
            value={element.quantity * element.unitCost}
            onChange={(e) => handleChange(index, e)}
          />

          {index ? (
            <button
              type="button"
              className="button-remove"
              onClick={() => removeFormFields(index)}
            >
              Remove
            </button>
          ) : null}
        </div>
      ))}
      <div className="button-section">
        <button
          disabled={
            loggedinUser?.role * 1 === 5 || loggedinUser?.role * 1 === 7
          }
          className="buttonadd"
          type="button"
          onClick={() => addFormFields()}
        >
          Add
        </button>

        {loading ? (
          <ButtonLoader />
        ) : (
          <button
            disabled={
              loggedinUser?.role * 1 === 5 || loggedinUser?.role * 1 === 7
            }
            className="buttonsubmit"
            type="submit"
          >
            Submit
          </button>
        )}
      </div>
      {error && <ToastContainer />}
      {success && <ToastContainer />}
    </form>
  );
};

export default ActivityCreator;
