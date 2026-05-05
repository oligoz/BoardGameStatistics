import { useState, useEffect } from "react";
import api from "../api";
import { CSpinner } from "@coreui/react";
import "../styles/Form.css";
import { centerContent } from "../js/auxiliarFunctions";
import { useNavigate } from "react-router-dom";

function BggPlays() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const formEl = e.currentTarget;
    const formData = new FormData(formEl);
    const file = formData.get("file");

    try {
      const res = await api.post(
        "api/bgg-plays/",
        {
          file,
        },
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      //   window.location.replace("/");
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    centerContent();
  }, []);

  return (
    <div id="center-content">
      <form onSubmit={handleSubmit} className="form-container bg-darkgray">
        <h1>Adicionar jogo</h1>
        <input id="file" name="file" className="form-input" type="file" />

        {loading ? (
          <CSpinner color="light" />
        ) : (
          <>
            <button className="form-button" type="submit">
              Enviar arquivo
            </button>
          </>
        )}
      </form>
    </div>
  );
}

export default BggPlays;
