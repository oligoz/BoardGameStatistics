import { useEffect, useState } from "react";
import { useParams } from "react-router";
import api from "../../api";
import { centerContent } from "../../js/auxiliarFunctions";
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardText,
  CCardTitle,
} from "@coreui/react";
import { useNavigate } from "react-router-dom";

function DeleteJogo() {
  const { id } = useParams();
  const [jogo, setJogo] = useState(null);
  const [partidas, setPartidas] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    centerContent();
  }, []);

  useEffect(() => {
    api
      .get("/api/jogo/detail/" + id + "/")
      .then((res) => res.data)
      .then((data) => {
        setJogo(data);
      })
      .catch((error) => alert(error));

    api
      .get("/api/partidas/jogo/" + id + "/")
      .then((res) => res.data)
      .then((data) => {
        setPartidas(data);
      })
      .catch((error) => alert(error));
  }, [id]);

  const deleteJogo = (id) => {
    if (window.confirm("Tem certeza que deseja deletar este jogo?")) {
      setLoading(true);
      api
        .delete("api/jogo/delete/" + id + "/")
        .then((res) => navigate("/jogos"))
        .catch((error) => alert(error.response.data.msg))
        .finally(() => setLoading(false));
    }
  };

  return (
    <div id="center-content">
      <CCard
        className="bg-darkgray"
        style={{
          maxWidth: "400px",
          margin: "0px auto",
        }}
      >
        <CCardBody className="d-flex flex-column">
          <CCardTitle className="text-center">
            <h1>{jogo?.nome}</h1>
          </CCardTitle>
          <hr
            style={{
              marginLeft: "-16px",
              marginRight: "-16px",
              marginTop: "0px",
              marginBottom: "16px",
              width: "calc(100% + 32px)",
            }}
          />
          <CCardText>Ano de lançamento: {jogo?.anoLancamento}</CCardText>
          <CCardText>
            {partidas?.num_partidas}{" "}
            {partidas?.num_partidas === 1
              ? "partida jogada"
              : "partidas jogadas"}
          </CCardText>
          {partidas?.last_partida_date ? (
            <CCardText>
              Data ultima partida:{" "}
              {new Date(
                partidas?.last_partida_date + "T00:00:00",
              ).toLocaleDateString()}
            </CCardText>
          ) : null}
        </CCardBody>
        <CCardFooter className="fst-italic mt-auto">
          {jogo?.expansao ? "expansão" : "Jogo base"}
          <span className="fst-normal" style={{ float: "right" }}>
            BGG ID: {jogo?.bggId}
          </span>
          <CButton
            color="danger"
            className="form-button fw-bold"
            type="button"
            onClick={() => deleteJogo(jogo.id)}
          >
            Deletar
          </CButton>
        </CCardFooter>
      </CCard>
    </div>
  );
}

export default DeleteJogo;
