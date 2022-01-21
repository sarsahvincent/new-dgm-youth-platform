import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Paper } from "@mui/material";

const ActivityCreator = () => {
  const [formValues, setFormValues] = useState([
    { name: "", qautity: "", unitCost: "", total: null },
  ]);

  let handleChange = (i, e) => {
    let newFormValues = [...formValues];
    newFormValues[i][e.target.name] = e.target.value;
    setFormValues(newFormValues);
  };

  let addFormFields = () => {
    setFormValues([
      ...formValues,
      { name: "", qautity: "", unitCost: "", total: null },
    ]);
  };

  let removeFormFields = (i) => {
    let newFormValues = [...formValues];
    newFormValues.splice(i, 1);
    setFormValues(newFormValues);
  };

  let handleSubmit = (event) => {
    event.preventDefault();
    alert(JSON.stringify(formValues));
  };

  formValues.map(value => {
   
  })

  return (
    <form onSubmit={handleSubmit}>
      {formValues.map((element, index) => (
        <div className="form-inline" key={index}>
          <input
            type="text"
            name="name"
            value={element.name || ""}
            onChange={(e) => handleChange(index, e)}
          />

          <input
            type="number"
            name="qautity"
            value={element.qautity || ""}
            onChange={(e) => handleChange(index, e)}
          />

          <input
            type="number"
            name="unitCost"
            value={element.unitCost || ""}
            onChange={(e) => handleChange(index, e)}
          />

          <input
            disabled
            type="text"
            name="total"
            value={element.total || ""}
            onChange={(e) => handleChange(index, e)}
          />

          {index ? (
            <button
              type="button"
              className="button remove"
              onClick={() => removeFormFields(index)}
            >
              Remove
            </button>
          ) : null}
        </div>
      ))}
      <div className="button-section">
        <button
          className="button add"
          type="button"
          onClick={() => addFormFields()}
        >
          Add
        </button>
        <button className="button submit" type="submit">
          Submit
        </button>
      </div>
    </form>
  );
};

export default ActivityCreator;
