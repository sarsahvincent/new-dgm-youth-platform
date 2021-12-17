import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Img from "../../assets/images/avatar.png";
import Camera from "../../components/svg/Camera";
import Delete from "../../components/svg/Delete";
import { storage, db, auth } from "../../firebse";
import {
  ref,
  getDownloadURL,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function Profile() {
  const [img, setImg] = useState();
  const [user, setUser] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    getDoc(doc(db, "users", auth.currentUser.uid)).then((docSnap) => {
      if (docSnap.exists) {
        setUser(docSnap.data());
      }
    });
    if (img) {
      const uplaodImg = async () => {
        const imgRef = ref(
          storage,
          `chat-app/avatar/${new Date().getTime()} - ${img.name}`
        );

        try {
          if (user.avatarPath) {
            await deleteObject(ref(storage, user.avatarPath));
          }
          const snap = await uploadBytes(imgRef, img);
          const url = await getDownloadURL(ref(storage, snap.ref.fullPath));

          await updateDoc(doc(db, "users", auth.currentUser.uid), {
            avatar: url,
            avatarPath: snap.ref.fullPath,
          });
          setImg("");
        } catch (error) {
          console.log(error.message);
        }
      };
      uplaodImg();
    }
  }, [img]);

  const deleteImage = async () => {
    try {
      const confirm = window.confirm("Delete avatar");
      if (confirm) {
        deleteObject(ref(storage, user.avatarPath));
      }
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        avatar: "",
        avatarPath: "",
      });
      window.location.reload();
    } catch (err) {
      console.log(err.message);
    }
  };

  return user ? (
    <div className="layout_margin m-2 mt-3">
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={4} lg={3} xl={3}>
            <Item>
              <div className="profile_container">
                <div className="img_container">
                  <img src={user?.avatar || Img} alt="profle" />
                  <div className="overlay">
                    <div>
                      <label htmlFor="photo">
                        <Camera />
                      </label>
                      {user.avatarPath ? (
                        <Delete deleteImage={deleteImage} />
                      ) : null}
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        id="photo"
                        onChange={(e) => setImg(e.target.files[0])}
                      />
                    </div>
                  </div>
                </div>
                <div className="text_container">
                  <h3>{user.name}</h3>
                  <p>{user.email}</p>
                  <hr />
                  <small>
                    Joined on : {user.createdAt?.toDate().toDateString()}
                  </small>
                </div>
              </div>

              <div >
                <div className="profile_subDetails">
                  Role :<span style={{ color: "purple" }}>{user.role}</span>
                </div>
                <div className="profile_subDetails">
                  Address :
                  <span style={{ color: "purple" }}>{user.houseAddress}</span>
                </div>
                <div className="profile_subDetails">
                  Department :
                  <span style={{ color: "purple" }}>
                    {user.firstDepartment}
                  </span>
                </div>
                <div className="profile_subDetails">
                  Phone :<span style={{ color: "purple" }}>{user.phone}</span>
                </div>
                  <div className="profile_subDetails">
                  Age :<span style={{ color: "purple" }}>{user.role}</span>
                </div>
                <div className="profile_subDetails">
                  Marital Status :
                  <span style={{ color: "purple" }}>{user.houseAddress}</span>
                </div>
                <div className="profile_subDetails">
                  Active :
                  <span style={{ color: "purple" }}>
                    {user.firstDepartment}
                  </span>
                </div>
                <div className="profile_subDetails">
                  Phone :<span style={{ color: "purple" }}>{user.phone}</span>
                </div>
              </div>
            </Item>
          </Grid>
          <Grid item xs={12} sm={12} md={8} lg={9} xl={9}>
            {/*  <Grid item xs={12} sm={12} md={6} lg={3} xl={3}> */}
            <div className="profile_heading">
              <Card sx={{ boxShadow: 3 }} className="profile_heading_subtitle">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="profile_heading_subtitle_icon"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h6>Monthly Dues Paied</h6>
                <div style={{ color: "purple", fontSize: "25px" }}> 5 / 12</div>
              </Card>
              <Card sx={{ boxShadow: 3 }} className="profile_heading_subtitle group">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="profile_heading_subtitle_icon"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h6> Group</h6>
                <div style={{ color: "purple", fontSize: "25px" }}>4</div>
              </Card>
              <Card sx={{ boxShadow: 3 }} className="profile_heading_subtitle">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="profile_heading_subtitle_icon"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                </div>
                <h6> Soules Won</h6>
                <div style={{ color: "purple", fontSize: "25px" }}> 6</div>
              </Card>
            </div>
            <Grid sx={{ marginTop: 2 }} item>
              <Item>
                In publishing and graphic design, Lorem ipsum is a placeholder
                text commonly used to demonstrate the visual form of a document
                or a typeface without relying on meaningful content. Lorem ipsum
                may be used as a placeholder before the final copy is In
                publishing and graphic design, Lorem ipsum is a placeholder text
                commonly used to demonstrate the visual form of a document or a
                typeface without relying on meaningful content. Lorem ipsum may
                be used as a placeholder before the final copy is In publishing
                and graphic design, Lorem ipsum is a placeholder text commonly
                used to demonstrate the visual form of a document or a typeface
                without relying on meaningful content. Lorem ipsum may be used
                as a placeholder before the final copy is In publishing and
                graphic design, Lorem ipsum is a placeholder text commonly used
                to demonstrate the visual form of a document or a typeface
                without relying on meaningful content. Lorem ipsum may be used
                as a placeholder before the final copy is
                In publishing and graphic design, Lorem ipsum is a placeholder
                text commonly used to demonstrate the visual form of a document
                or a typeface without relying on meaningful content. Lorem ipsum
                may be used as a placeholder before the final copy is In
                publishing and graphic design, Lorem ipsum is a placeholder text
                commonly used to demonstrate the visual form of a document or a
                typeface without relying on meaningful content. Lorem ipsum may
                be used as a placeholder before the final copy is In publishing
                and graphic design, Lorem ipsum is a placeholder text commonly
                used to demonstrate the visual form of a document or a typeface
                without relying on meaningful content. Lorem ipsum may be used
                as a placeholder before the final copy is In publishing and
                graphic design, Lorem ipsum is a placeholder text commonly used
                to demonstrate the visual form of a document or a typeface
                without relying on meaningful content. Lorem ipsum may be used
                as a placeholder before the final copy is
              </Item>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </div>
  ) : null;
}

export default Profile;
