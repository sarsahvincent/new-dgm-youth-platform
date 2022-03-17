import React, { useState } from "react";

function Forms({ getName }) {
  const [name, setName] = useState(getName === undefined ? "" : getName);
  return (
    <div>
      <input
        placeholder="this is the input form"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </div>
  );
}

export default Forms;
