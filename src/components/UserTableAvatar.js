import React from "react";
import Avatar from "../assets/images/avatar.png";

function UserTableAvatar({ url }) {
  return (
    <div>
      <img
        src={url || Avatar}
        alt="avatar"
        style={{ width: "30px", height: "30px", borderRadius: "50%" }}
      />
    </div>
  );
}

export default UserTableAvatar;
