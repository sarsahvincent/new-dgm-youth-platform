import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { doc, setDoc } from "firebase/firestore";
import SendIcon from "@mui/icons-material/Send";
import { db } from "../../firebse";

const id = Math.random().toString(36).slice(2);

function Register() {
  const [success, setSuccess] = useState(false);
  const [content, setContent] = useState("");

  const [data, setData] = useState({
    name: "",
    phone: "",
    location: "",

    error: null,
    loading: false,
  });

  const { name, phone, location, error, loading } = data;

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setData({ ...data, error: null, loading: true });
    if (!name || !phone || !location) {
      setData({ ...data, error: "All fields are required except message" });
    } else if (content.length > 200) {
      setData({ ...data, error: "Message cannot be more than 200 characters" });
    } else {
      try {
        await setDoc(doc(db, "DGM_YOUTH_contacts", id), {
          uid: id,
          name,
          phone,
          location,
          content,
          sentAt: Math.floor(Date.now() / 1000),
        });

        setData({
          name: "",
          phone: "",
          location: "",

          loading: false,
          error: null,
        });
        setContent("");
        setSuccess(true);
        toast.success(`Thank you. We will get in touch with you soon.`, {
          position: "top-right",
        });
      } catch (err) {
        setData({ ...data, error: err.message, loading: false });
      }
    }
  };

  return (
    <section className="login_container mt-3">
      <h3>Contact Us</h3>
      <form className="form" onSubmit={handleSubmit}>
        <div className="input_container">
          <label htmlFor="name">Name *</label>
          <input type="text" name="name" value={name} onChange={handleChange} />
        </div>
        <div className="input_container">
          <label htmlFor="phone">Phone *</label>
          <input
            type="number"
            name="phone"
            value={phone}
            onChange={handleChange}
          />
        </div>
        <div className="input_container mb-3">
          <label htmlFor="location">Location *</label>
          <input
            type="text"
            name="location"
            value={location}
            onChange={handleChange}
          />
        </div>
        <label htmlFor="location">Message/Question</label>
        <div className="input_container">
          <textarea
            className="contact-message"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            name=""
            id=""
            cols="30"
            rows="5"
          ></textarea>
        </div>
        {error ? <p className="error">{error}</p> : null}
        <div className="btn_container">
          <button disabled={loading} className="btn">
            {loading ? (
              "Sending..."
            ) : (
              <div>
                Send{" "}
                <span>
                  <SendIcon />
                </span>{" "}
              </div>
            )}
          </button>
        </div>
      </form>
      {success && <ToastContainer />}
    </section>
  );
}

export default Register;
