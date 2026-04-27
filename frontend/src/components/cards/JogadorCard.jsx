import { useState, useEffect } from "react";
import {
  CCard,
  CCardBody,
  CCardText,
  CCardTitle,
  CCardFooter,
  CBadge,
  CRow,
  CCol,
} from "@coreui/react";
import api from "../../api";

function JogadorCard({ id, nome, handleClick }) {
  const [partidas, setPartidas] = useState([]);

  useEffect(() => {
    api
      .get("/api/partidas/jogador/" + id + "/")
      .then((res) => setPartidas(res.data));
  }, []);

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
        <CRow className="fst-italic fs-6 text-secondary">
          <CCol xs>
            <CCardText>
              {partidas.last_partida_date
                ? new Date(
                    partidas.last_partida_date + "T00:00:00",
                  ).toLocaleDateString()
                : null}
            </CCardText>
          </CCol>
          <CCol xs className="text-end">
            <CCardText>
              {partidas.num_partidas}{" "}
              {partidas.num_partidas === 1 ? "partida" : "partidas"}
            </CCardText>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
  );
}

export default JogadorCard;
