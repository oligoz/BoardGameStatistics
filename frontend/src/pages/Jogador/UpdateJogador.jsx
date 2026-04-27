import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { centerContent } from "../../js/auxiliarFunctions";
import api from "../../api";
import FormJogador from "../../components/forms/FormJogador";

function UpdateJogador() {
  const [jogador, setJogador] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    centerContent();
  }, []);

  useEffect(() => {
    api
      .get("/api/jogador/detail/" + id + "/")
      .then((res) => res.data)
      .then((data) => {
        setJogador(data);
      })
      .catch((error) => alert(error));
  }, [id]);

  return (
    <div id="center-content">
      <FormJogador type={"Atualizar"} jogador={jogador} />
    </div>
  );
}

export default UpdateJogador;
