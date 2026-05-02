import { useState, useEffect } from "react";
import { useParams } from "react-router";
import api from "../../api";
import {
  CButton,
  CFormInput,
  CFormTextarea,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilCasino, cilLocationPin, cilCalendar } from "@coreui/icons";
import { useNavigate } from "react-router-dom";
import useUserStore from "../../store/userStore";

function UpdatePartida() {
  const { id } = useParams();
  const user = useUserStore((state) => state.user);
  const [partida, setPartida] = useState(null);
  const [order, setOrder] = useState(1);
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/api/partida/get/" + id + "/")
      .then((res) => res.data)
      .then((data) => {
        setPartida(data);
        if (data.jogadores.some((jogador) => jogador.pontos === null)) {
          setEdit(true);
        }
      })
      .catch((error) => alert(error.response.data.error));
  }, [id]);

  const changeOrder = (e) => {
    const newOrder = order === 1 ? -1 : 1;
    setOrder(newOrder);
  };

  const orderClassificacao = (e) => {
    const pontos = partida.jogadores.reduce((acc, jogador) => {
      const pontosInput = document.getElementById("pontos-" + jogador.id);
      const pontosValue = isNaN(parseInt(pontosInput.value))
        ? 0
        : parseInt(pontosInput.value);
      acc.push({ id: jogador.id, pontos: pontosValue });
      return acc;
    }, []);
    pontos.sort((a, b) => order * (b.pontos - a.pontos));
    pontos.map((p, index) => {
      const posicaoInput = document.getElementById("posicao-" + p.id);
      if (p.pontos === pontos[index - 1]?.pontos) {
        const posicaoTie = document.getElementById(
          "posicao-" + pontos[index - 1].id,
        );
        posicaoInput.value = posicaoTie.value;
      } else {
        posicaoInput.value = index + 1;
      }
    });
  };

  useEffect(() => {
    if (partida !== null) {
      orderClassificacao();
    }
  }, [order]);

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    const formEl = e.currentTarget;
    const formData = new FormData(formEl);

    const jogadoresData = formData.entries().reduce((acc, entry) => {
      const jogadorId = document.getElementById(entry[0]).dataset.id;
      const field = entry[0].split("-")[0];
      const value = entry[1];
      if (!acc[jogadorId]) {
        acc[jogadorId] = { id: jogadorId };
      }
      acc[jogadorId][field] = value;
      return acc;
    }, {});

    api
      .put("/api/partida/update/" + id + "/", {
        classificacao: Object.values(jogadoresData),
      })
      .then(() => navigate("/partidas"))
      .catch((error) => alert(error))
      .finally(() => setLoading(false));
    return;
  };

  const deletePartida = () => {
    api
      .delete("/api/partida/delete/" + id + "/")
      .then(() => navigate("/partidas"))
      .catch((error) => alert(error))
      .finally(() => setLoading(false));
  };

  return (
    <div className="p-4">
      {partida !== null ? (
        <div className="p-3 bg-darkgray rounded shadow">
          <h1>Partida</h1>
          <hr />
          <div className="d-flex align-items-center gap-3">
            <div className="d-flex align-items-center gap-2">
              <CIcon size="xxl" icon={cilCasino} />
              <span className="fs-2 fw-semibold">
                {partida.jogos.map((jogo) => jogo.nome).join(", ")}
              </span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <CIcon size="xxl" icon={cilLocationPin} />
              <span className="fs-4 fw-semibold">{partida.local.nome}</span>
            </div>
          </div>
          <div className="d-flex align-items-center gap-2 text-secondary">
            <CIcon size="xl" icon={cilCalendar} />
            <span className="fs-5 fst-italic">
              {new Date(partida.dataPartida + "T00:00:00").toLocaleDateString()}
            </span>
          </div>
          <hr />
          <div className="d-flex align-items-center justify-content-between gap-3">
            <span className="fs-5">Classificação</span>
            {edit && (
              <CButton color="secondary" onClick={changeOrder}>
                {order === 1 ? "Mais pontos vence" : "Menos pontos vence"}
              </CButton>
            )}
          </div>
          <form onSubmit={handleSubmit}>
            <CTable
              color="dark"
              align="middle"
              className="text-white bg-darkgray"
              hover
              responsive
            >
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col" style={{ width: "5rem" }}>
                    Posição
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    scope="col"
                    style={{ width: "fit-content" }}
                  >
                    Nome
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" style={{ width: "20rem" }}>
                    Pontos
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {partida.jogadores
                  .sort(edit ? () => 0 : (a, b) => a.posicao - b.posicao)
                  .map((jogador) => (
                    <CTableRow key={"jogador-" + jogador.id}>
                      <CTableDataCell>
                        <CFormInput
                          id={"posicao-" + jogador.id}
                          name={"posicao-" + jogador.id}
                          type="number"
                          min={0}
                          defaultValue={jogador.posicao}
                          data-id={jogador.id}
                          onClick={(e) => e.target.select()}
                          required
                          className={edit ? "bg-secondary" : ""}
                          readOnly={edit ? false : true}
                          plainText={edit ? false : true}
                        />
                      </CTableDataCell>
                      <CTableDataCell>
                        <span className="fw-bold">{jogador.nome}</span>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput
                          id={"pontos-" + jogador.id}
                          name={"pontos-" + jogador.id}
                          type="number"
                          defaultValue={jogador.pontos}
                          data-id={jogador.id}
                          onChange={orderClassificacao}
                          onClick={(e) => e.target.select()}
                          required
                          className={edit ? "bg-secondary" : ""}
                          readOnly={edit ? false : true}
                          plainText={edit ? false : true}
                        />
                      </CTableDataCell>
                    </CTableRow>
                  ))}
              </CTableBody>
            </CTable>
            {/* <label htmlFor="observacoes">Observações</label>
            <CFormTextarea
              id="observacoes"
              name="observacoes"
              defaultValue={partida.observacoes}
              className="form-input bg-white text-black"
            /> */}
            {edit ? (
              <div className="d-flex gap-2">
                <CButton type="submit" color="primary" className="mt-3">
                  Salvar
                </CButton>
                {partida.jogadores.some(
                  (jogador) => jogador.pontos !== null,
                ) && (
                  <CButton
                    type="button"
                    color="secondary"
                    className="mt-3"
                    onClick={() => setEdit(false)}
                  >
                    Cancelar
                  </CButton>
                )}
              </div>
            ) : null}
          </form>
          {edit || user === null || user.id === null ? null : (
            <div className="d-flex gap-2">
              <CButton
                color="primary"
                className="mt-3"
                onClick={() => setEdit(true)}
              >
                Editar
              </CButton>
              <CButton
                color="danger"
                className="mt-3"
                onClick={() => {
                  if (
                    window.confirm(
                      "Tem certeza que deseja deletar esta partida?",
                    )
                  ) {
                    setLoading(true);
                    deletePartida();
                  }
                }}
              >
                Deletar
              </CButton>
            </div>
          )}
        </div>
      ) : (
        <h1>Partida não existe</h1>
      )}
    </div>
  );
}

export default UpdatePartida;
