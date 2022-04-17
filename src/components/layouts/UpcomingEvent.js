import React, { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../firebse";
import ButtonLoader from "../ButtonLoader";
import Register from "./Register";

function UpcomingEvent() {
  const [image, setImage] = useState([]);
  const [loading, setLoaingi] = useState(false);

  const activitiesCollectiion = collection(db, "DGM_YOUTH_program_image");

  useEffect(() => {
    setLoaingi(true);
    const getProgramImage = async () => {
      const data = await getDocs(activitiesCollectiion);
      setImage(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    setLoaingi(false);
    getProgramImage();
  }, []);

  return (
    <div className="event-page-container">
      <div className="program-image">
        <img src={`${image[0]?.image ? image[0]?.image : ""}`} alt="image" />
      </div>
      <Register />
      {loading && <ButtonLoader />}
    </div>
  );
}

export default UpcomingEvent;
