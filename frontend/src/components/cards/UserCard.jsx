import React from "react";
import {
  CCard,
  CCardBody,
  CCardFooter,
  CCardText,
  CCardTitle,
} from "@coreui/react";

function UserCard({ user }) {
  return (
    <CCard
      id={user.id}
      className={"border-granite flex-1"}
      textBgColor="dark"
      style={{
        minWidth: "15rem",
        maxWidth: "20rem",
      }}
    >
      <CCardBody>
        <CCardTitle>{user.username}</CCardTitle>
        <CCardText>
          Name: {user.first_name} {user.last_name} <br />
          Email: {user.email}
        </CCardText>
      </CCardBody>
      <CCardFooter className="fst-italic mt-auto">
        {user.is_staff ? "Admin" : "User"}
      </CCardFooter>
    </CCard>
  );
}

export default UserCard;
