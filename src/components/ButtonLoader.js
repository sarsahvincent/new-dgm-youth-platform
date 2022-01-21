import React from "react";
import { Spinner } from "react-bootstrap";

function Loading() {
  return (
    <div>
      <h2
        style={{
          color: "purple",
        }}
      >
        <Spinner animation="border" />
      </h2>
    </div>
  );
}

export default Loading;
