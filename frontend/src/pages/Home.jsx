import { useState, useEffect } from "react";
import api from "../api";

function Home() {
  const [jogadores, setJogadores] = useState([]);
  const [locais, setLocais] = useState([]);
  const [jogos, setJogos] = useState([]);
  const [partidas, setPartidas] = useState([]);

  useEffect(() => {
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

    api
      .get("/api/jogos/")
      .then((res) => res.data)
      .then((data) => {
        setJogos(data);
      })
      .catch((error) => alert(error));

    api
      .get("/api/partidas/")
      .then((res) => res.data)
      .then((data) => {
        setPartidas(data);
      })
      .catch((error) => alert(error));
  }, []);

  return (
    <div className="p-4">
      <h1>Bem-vindo ao Board Game Statistics App!</h1>
      <p>
        {jogadores.length}{" "}
        {jogadores.length === 1
          ? "jogador cadastrado"
          : "jogadores cadastrados"}
      </p>
      <p>
        {locais.length}{" "}
        {locais.length === 1 ? "local cadastrado" : "locais cadastrados"}
      </p>
      <p>
        {jogos.length}{" "}
        {jogos.length === 1 ? "jogo cadastrado" : "jogos cadastrados"}
      </p>
      <p>
        {partidas.length}{" "}
        {partidas.length === 1 ? "partida cadastrada" : "partidas cadastradas"}
      </p>
    </div>
  );
}

export default Home;
