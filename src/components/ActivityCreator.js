import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { auth, db } from "../firebse";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import ButtonLoader from "./ButtonLoader";
import { SuccesAlert } from "./Alert";

const id = Math.random().toString(36).slice(2);

const ActivityCreator = () => {
  const [formValues, setFormValues] = useState([
    { name: "", qautity: "", unitCost: "", total: "" },
  ]);

  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("success" || "error");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  let handleChange = (i, e) => {
    let newFormValues = [...formValues];
    newFormValues[i][e.target.name] = e.target.value;
    setFormValues(newFormValues);
  };

  let addFormFields = () => {
    setFormValues([
      ...formValues,
      { name: "", qautity: "", unitCost: "", total: "" },
    ]);
  };

  let removeFormFields = (i) => {
    let newFormValues = [...formValues];
    newFormValues.splice(i, 1);
    setFormValues(newFormValues);
  };

  let handleSubmit = async (event) => {
    event.preventDefault();

    if (
      formValues[0].name === "" ||
      formValues[0].qautity === "" ||
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
        createdAt: Timestamp.fromDate(new Date()),
      });
      setLoading(false);
      setFormValues([{ name: "", qautity: "", unitCost: "", total: "" }]);
      setTitle("");
      setSuccess(true);
      toast.success(`Activity Successfully Submitted!.`, {
        position: "top-right",
      });
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <form className="activityFormContainer" onSubmit={handleSubmit}>
      <input
        placeholder="Enter Title"
        className="activityTitle"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      {formValues.map((element, index) => (
        <div className="form-inline" key={index}>
          <input
            className="itemName"
            placeholder="Name of item"
            type="text"
            name="name"
            value={element.name || ""}
            onChange={(e) => handleChange(index, e)}
          />

          <input
            placeholder="Quantiy"
            type="number"
            name="qautity"
            value={element.qautity || ""}
            onChange={(e) => handleChange(index, e)}
          />

          <input
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
            value={element.qautity * element.unitCost}
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
          className="buttonadd"
          type="button"
          onClick={() => addFormFields()}
        >
          Add
        </button>

        {loading ? (
          <ButtonLoader />
        ) : (
          <button className="buttonsubmit" type="submit">
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
