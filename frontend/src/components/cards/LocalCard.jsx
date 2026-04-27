import { CCard, CCardBody, CCardTitle } from "@coreui/react";

function LocalCard({ id, nome, handleClick }) {
  return (
    <CCard
      id={id}
      className={"border-granite flex-1"}
      textBgColor="dark"
      style={{
        minWidth: "15rem",
        maxWidth: "20rem",
        cursor: handleClick ? "pointer" : "default",
      }}
      onClick={handleClick}
    >
      <CCardBody>
        <CCardTitle>{nome}</CCardTitle>
      </CCardBody>
    </CCard>
  );
}

export default LocalCard;
