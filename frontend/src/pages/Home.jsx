import { useState, useEffect } from "react";
import api from "../api";
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";

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
      <section>
        <h1>Bem-vindo ao Board Game Statistics App!</h1>
        <p>
          O Board Game Statistics App é uma ferramenta para gerenciar e
          acompanhar estatísticas de jogos de tabuleiro, incluindo jogadores,
          locais, jogos e partidas.
        </p>
        <p>
          Com este aplicativo, você pode visualizar informações detalhadas sobre
          cada partida, acompanhar o desempenho dos jogadores e analisar
          tendências ao longo do tempo.
        </p>
        <h4>Sistema de Pontuação</h4>
        <div>
          <p>
            O sistema de pontuação funciona com base na colocação final de cada
            jogador em cada partida. Em vez de contar apenas vitórias, ele
            distribui pontos positivos para quem termina nas primeiras posições
            e pontos negativos para quem termina nas últimas.{" "}
          </p>
          <p className="m-0">
            Quando a partida tem um número ímpar de posições, a posição central
            vale 0. Quem fica acima dela ganha pontos, e quem fica abaixo perde
            pontos. Por exemplo, em uma partida com 5 posições, a pontuação fica
            assim:
          </p>
          <CTable className="w-auto" color="dark" align="middle">
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Posição</CTableHeaderCell>
                <CTableHeaderCell>Pontos</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow>
                <CTableDataCell>1º lugar</CTableDataCell>
                <CTableDataCell>+2</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell>2º lugar</CTableDataCell>
                <CTableDataCell>+1</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell>3º lugar</CTableDataCell>
                <CTableDataCell>0</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell>4º lugar</CTableDataCell>
                <CTableDataCell>-1</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell>5º lugar</CTableDataCell>
                <CTableDataCell>-2</CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
          <p className="m-0">
            Quando a partida tem um número par de posições, não existe posição
            neutra. As posições da metade superior recebem pontos positivos e as
            da metade inferior recebem pontos negativos. Por exemplo, em uma
            partida com 4 posições, a pontuação fica: 1º lugar = +2, 2º lugar =
            +1, 3º lugar = -1 e 4º lugar = -2.{" "}
          </p>
          <CTable className="w-auto" color="dark" align="middle">
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Posição</CTableHeaderCell>
                <CTableHeaderCell>Pontos</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow>
                <CTableDataCell>1º lugar</CTableDataCell>
                <CTableDataCell>+2</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell>2º lugar</CTableDataCell>
                <CTableDataCell>+1</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell>3º lugar</CTableDataCell>
                <CTableDataCell>-1</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell>4º lugar</CTableDataCell>
                <CTableDataCell>-2</CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
          <p>
            A classificação final de cada jogador é a soma de todos esses pontos
            nas partidas consideradas pelos filtros selecionados.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Home;
