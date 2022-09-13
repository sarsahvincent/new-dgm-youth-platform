import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { updateDoc, doc } from "firebase/firestore";
import { auth, db } from "../../firebse";
import { useDispatch } from "react-redux";
import { getCurrentUserId } from "../../services/redux/reducers/userSlice";
import { Spinner } from "react-bootstrap";
import LoginIcon from "@mui/icons-material/Login";
import LoingImage from "../../assets/images/login-icon-3058.png";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    password: "",
    error: null,
    loading: false,
  });

  const { email, password, error, loading } = data;
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setData({ ...data, error: null, loading: true });
    if (!email || !password) {
      setData({ ...data, error: "All fields are required." });
    } else {
      try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        await updateDoc(doc(db, "DGM_YOUTH_users", result.user.uid), {
          isOnline: true,
        });
        dispatch(getCurrentUserId(result.user.uid));
        setData({
          email: "",
          password: "",
          loading: false,
          error: null,
        });
        setData({ ...data, loading: true });
        navigate("/");
      } catch (error) {
        console.log("erro", error);
        setData({
          ...data,
          error: error.message,
          loading: false,
        });
      }
    }
  };

  return (
    <section className="login_container">
      <h3 className="">
        Login{" "}
        <span>
          <img src={LoingImage} width="80px" height="80px" alt="" />
        </span>
      </h3>
      <form className="form mt-0" onSubmit={handleSubmit}>
        <div className="input_container">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
          />
        </div>
        <div className="input_container">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
          />
        </div>
        {error ? (
          <p className="error">
            {error === "Firebase: Error (auth/user-not-found)." || error ==="Firebase: Error (auth/wrong-password)."
              ? "Invalid Email or Password"
              : error === "Firebase: Error (auth/timeout)."
              ? "Network  error! Please try again"
              : error === "Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests)." ? 'Your Account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later': error}
          </p>
        ) : null}
        <div className="btn_container">
          <button disabled={loading} className="btn">
            {loading ? (
              <Spinner animation="border" />
            ) : (
              <>
                <span>Login</span> <LoginIcon />
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}

export default Login;
