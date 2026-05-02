import { useState, useEffect, use } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import { CButton, CSpinner } from "@coreui/react";
import Select from "react-select";
import "../../styles/Form.css";

function FormPartida() {
  const [jogos, setJogos] = useState([]);
  const [jogadores, setJogadores] = useState([]);
  const [locais, setLocais] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreatePartida = (e) => {
    setLoading(true);
    e.preventDefault();
    const formEl = e.currentTarget;
    const formData = new FormData(formEl);
    const jogadores = formData.getAll("jogadores");
    const jogos = formData.getAll("jogos");
    const local = formData.get("local");
    const dataPartida = formData.get("data");
    const observacoes = formData.get("observacoes");

    api
      .post("/api/partida/create/", {
        jogadores,
        jogos,
        local,
        dataPartida,
        observacoes,
      })
      .then((res) => res.data)
      .then((data) => {
        navigate("/partida/update/" + data.id);
      })
      .catch((error) => alert(error))
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    api
      .get("/api/jogos/")
      .then((res) => res.data)
      .then((data) => {
        setJogos(data);
      })
      .catch((error) => alert(error));

    api
      .get("/api/jogadores/")
      .then((res) => res.data)
      .then((data) => {
        setJogadores(data);
      })
      .catch((error) => alert(error));

    api
      .get("/api/locais/")
      .then((res) => res.data)
      .then((data) => {
        setLocais(data);
      })
      .catch((error) => alert(error));
  }, []);

  return (
    <form onSubmit={handleCreatePartida} className="form-container bg-darkgray">
      <h1>Criar Partida</h1>
      <label htmlFor="jogo" className="align-self-start">
        Jogos
      </label>
      <Select
        id="jogos"
        name="jogos"
        className="form-input text-black"
        placeholder="Selecione os jogos..."
        styles={{
          control: (base) => ({
            ...base,
            backgroundColor: "#6b7785",
          }),
          container: (base) => ({
            ...base,
            borderStyle: "none",
            padding: "0px",
          }),
          input: (base) => ({
            ...base,
            color: "white",
          }),
          menu: (base) => ({
            ...base,
            backgroundColor: "#6b7785",
            color: "white",
          }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused ? "#5a6670" : "#6b7785",
          }),
          multiValue: (base) => ({
            ...base,
            borderRadius: "50rem",
          }),
          placeholder: (base) => ({
            ...base,
            color: "white",
          }),
          clearIndicator: (base) => ({
            ...base,
            color: "white",
          }),
          dropdownIndicator: (base) => ({
            ...base,
            color: "white",
          }),
        }}
        isMulti
        options={jogos}
        getOptionLabel={(option) => option.nome}
        getOptionValue={(option) => option.id}
        required
      />
      <label className="align-self-start">Jogadores</label>
      <Select
        id="jogadores"
        name="jogadores"
        className="form-input text-black"
        placeholder="Selecione os jogadores..."
        styles={{
          control: (base) => ({
            ...base,
            backgroundColor: "#6b7785",
          }),
          container: (base) => ({
            ...base,
            borderStyle: "none",
            padding: "0px",
          }),
          input: (base) => ({
            ...base,
            color: "white",
          }),
          menu: (base) => ({
            ...base,
            backgroundColor: "#6b7785",
            color: "white",
          }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused ? "#5a6670" : "#6b7785",
          }),
          multiValue: (base) => ({
            ...base,
            borderRadius: "50rem",
          }),
          placeholder: (base) => ({
            ...base,
            color: "white",
          }),
          clearIndicator: (base) => ({
            ...base,
            color: "white",
          }),
          dropdownIndicator: (base) => ({
            ...base,
            color: "white",
          }),
        }}
        isMulti
        options={jogadores}
        getOptionLabel={(option) => option.nome}
        getOptionValue={(option) => option.id}
        required
      />
      <label htmlFor="local" className="align-self-start">
        Local
      </label>
      <select
        id="local"
        name="local"
        className="form-input bg-secondary text-white"
      >
        {locais.map((local) => (
          <option key={local.id} value={local.id}>
            {local.nome}
          </option>
        ))}
      </select>
      <label htmlFor="data" className="align-self-start">
        Data
      </label>
      <input
        type="date"
        id="data"
        name="data"
        className="form-input bg-secondary text-white"
        defaultValue={new Date().toISOString().split("T")[0]}
      />
      <label htmlFor="observacoes" className="align-self-start">
        Observações
      </label>
      <textarea
        id="observacoes"
        name="observacoes"
        className="form-input bg-secondary text-white"
      ></textarea>
      {loading ? (
        <CSpinner color="light" />
      ) : (
        <>
          <CButton
            color="cornflowerblue"
            className="form-button fw-bold"
            type="submit"
          >
            Criar Partida
          </CButton>
        </>
      )}
    </form>
  );
}

export default FormPartida;
