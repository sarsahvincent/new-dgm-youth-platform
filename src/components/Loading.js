import React from "react";
import { Spinner } from "react-bootstrap";


function Loading() {
  return (
    <div style={{ position: "relative" }}>
      <h2
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50, -50)",
          color: 'purple'
        }}
      >
      <Spinner animation="border" />
      </h2>
    </div>
  );
}

export default Loading;
