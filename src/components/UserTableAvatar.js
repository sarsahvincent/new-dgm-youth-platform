import React from "react";
import Avatar from "../assets/images/avatar.png";

function UserTableAvatar({ url }) {
  return (
    <div>
      <img
        src={url || Avatar}
        alt="avatar"
        style={{ width: "40px", height: "40px", borderRadius: "50%" }}
      />
    </div>
  );
}

export default UserTableAvatar;
