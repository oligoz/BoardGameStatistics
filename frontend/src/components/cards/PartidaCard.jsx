import {
  CCard,
  CCardBody,
  CCardFooter,
  CCardText,
  CCardTitle,
} from "@coreui/react";

function PartidaCard({
  id,
  jogos,
  local,
  dataPartida,
  jogadores,
  handleClick,
}) {
  return (
    <CCard
      id={id}
      className={"border-granite flex-1"}
      textBgColor="dark"
      onClick={handleClick}
      style={{
        minWidth: "15rem",
        maxWidth: "20rem",
        cursor: "pointer",
      }}
    >
      <CCardBody>
        <CCardTitle>{jogos.join(", ")}</CCardTitle>
        <CCardText>{jogadores.join(", ")}</CCardText>
      </CCardBody>
      <CCardFooter className="fst-italic mt-auto d-flex">
        <span>{local}</span>
        <span className="ms-auto">
          {new Date(dataPartida + "T00:00:00").toLocaleDateString()}
        </span>
      </CCardFooter>
    </CCard>
  );
}

export default PartidaCard;
