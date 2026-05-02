import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { CButton, CFormInput, CSpinner } from "@coreui/react";
import "../../styles/Form.css";

function FormLocal({ type, local }) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const navigate = useNavigate();

  const handleCreateLocal = (e) => {
    setLoading(true);
    e.preventDefault();
    const formEl = e.currentTarget;
    const formData = new FormData(formEl);
    const nome = formData.get("nome");
    type === "Criar" ? createLocal(nome) : updateLocal(nome);
  };

  const updateLocal = (nome) => {
    api
      .patch("api/local/update/" + local.id + "/", { nome })
      .then((res) => navigate("/locais"))
      .catch((error) => {
        setErrors(error.response.data.nome);
      })
      .finally(() => setLoading(false));
  };

  const createLocal = (nome) => {
    api
      .post("/api/local/create/", { nome })
      .then((res) => navigate("/locais"))
      .catch((error) => {
        setErrors(error.response.data.nome);
      })
      .finally(() => setLoading(false));
  };

  const deleteLocal = (id) => {
    if (window.confirm("Tem certeza que deseja deletar este local?")) {
      setLoading(true);
      api
        .delete("api/local/delete/" + id + "/")
        .then((res) => navigate("/locais"))
        .catch((error) => {
          setErrors(error.response.data.msg);
        })
        .finally(() => setLoading(false));
    }
  };

  return (
    <form onSubmit={handleCreateLocal} className="form-container bg-darkgray">
      <h1>{type ? type : "Criar"} Local</h1>
      <CFormInput
        className="bg-secondary mt-2"
        type="text"
        name="nome"
        id="nome"
        placeholder="Nome do local"
        aria-label="Nome do local"
        defaultValue={local ? local.nome : ""}
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
        {type ? type : "Criar"} Local
      </CButton>
      {type === "Atualizar" && (
        <CButton
          color="danger"
          className="form-button fw-bold mt-2"
          type="button"
          onClick={() => deleteLocal(local.id)}
        >
          Deletar
        </CButton>
      )}
    </form>
  );
}

export default FormLocal;
