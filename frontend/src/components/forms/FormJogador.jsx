import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { CSpinner, CButton, CFormInput } from "@coreui/react";
import "../../styles/Form.css";

function FormJogador({ type, jogador }) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const navigate = useNavigate();

  const handleCreateJogador = (e) => {
    setLoading(true);
    e.preventDefault();
    const formEl = e.currentTarget;
    const formData = new FormData(formEl);
    const nome = formData.get("nome");
    type === "Criar" ? createJogador(nome) : updateJogador(nome);
  };

  const updateJogador = (nome) => {
    api
      .patch("api/jogador/update/" + jogador.id + "/", { nome })
      .then((res) => {
        navigate("/jogadores");
      })
      .catch((error) => setErrors(error.response.data.nome))
      .finally(() => setLoading(false));
  };

  const createJogador = (nome) => {
    api
      .post("api/jogador/create/", { nome })
      .then((res) => {
        navigate("/jogadores");
      })
      .catch((error) => setErrors(error.response.data.nome))
      .finally(() => setLoading(false));
  };

  const deleteJogador = (id) => {
    if (window.confirm("Tem certeza que deseja deletar este jogador?")) {
      setLoading(true);
      api
        .delete("api/jogador/delete/" + id + "/")
        .then((res) => navigate("/jogadores"))
        .catch((error) => setErrors(error.response.data.msg))
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  return (
    <form onSubmit={handleCreateJogador} className="form-container bg-darkgray">
      <h1>{type ? type : "Criar"} Jogador</h1>
      <CFormInput
        id="nome"
        name="nome"
        className="bg-secondary mt-2"
        type="text"
        placeholder="Nome do jogador"
        aria-label="Nome do jogador"
        defaultValue={jogador ? jogador.nome : ""}
        required
        {...(errors
          ? {
              invalid: true,
              feedback: errors,
            }
          : null)}
      />
      {loading && <CSpinner color="light" />}
      <CButton
        color="cornflowerblue"
        className="form-button fw-bold mt-3"
        type="submit"
      >
        {type ? type : "Criar"} Jogador
      </CButton>
      {type === "Atualizar" && (
        <CButton
          color="danger"
          className="form-button fw-bold mt-2"
          type="button"
          onClick={() => deleteJogador(jogador.id)}
        >
          Deletar
        </CButton>
      )}
    </form>
  );
}

export default FormJogador;
