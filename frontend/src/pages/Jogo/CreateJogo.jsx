import { useEffect, useState } from "react";
import { CButton } from "@coreui/react";
import FormJogo from "../../components/forms/FormJogo";
import JogoCard from "../../components/cards/JogoCard";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import JogoPaginatedList from "../../components/lists/JogoPaginatedList";

function CreateJogo() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    setLoading(true);
    e.preventDefault();

    const formEl = e.currentTarget;
    const formData = new FormData(formEl);
    const name = formData.get("nome");

    try {
      const res = await api.get("api/bgg-jogos/?search=" + name);
      setResults(res.data);
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    let jogosToAdd = [];
    const inputs = e.currentTarget.querySelectorAll("input");
    inputs.forEach((input) => {
      if (input.type === "checkbox" && input.checked) {
        jogosToAdd.push(JSON.parse(input.dataset.values));
      }
    });

    try {
      const res = await api.post("api/jogo/create/", jogosToAdd);
      navigate("/jogos");
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1>Adicionar jogo</h1>
      <hr />
      <FormJogo handleSearch={handleSearch} loading={loading} />
      {results ? (
        <form onSubmit={handleSubmit}>
          <JogoPaginatedList items={results} />
          <CButton className="mt-3" color="dark" type="submit">
            Adicionar
          </CButton>
        </form>
      ) : null}
    </div>
  );
}

export default CreateJogo;
