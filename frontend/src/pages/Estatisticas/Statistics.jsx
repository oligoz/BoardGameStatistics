import { useState, useEffect, use } from "react";
import Select from "react-select";
import api from "../../api";
import {
  CButton,
  CCol,
  CRow,
  CTab,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";

function Statistics() {
  const [partidas, setPartidas] = useState([]);
  const [jogadores, setJogadores] = useState([]);
  const [jogos, setJogos] = useState([]);
  const [locais, setLocais] = useState([]);
  const [jogadoresOptions, setJogadoresOptions] = useState([]);
  const [jogosOptions, setJogosOptions] = useState([]);
  const [locaisOptions, setLocaisOptions] = useState([]);
  const [filteredPartidas, setFilteredPartidas] = useState([]);
  const [selectedJogadores, setSelectedJogadores] = useState([]);
  const [selectedJogos, setSelectedJogos] = useState([]);
  const [selectedLocais, setSelectedLocais] = useState([]);
  const [classificacao, setClassificacao] = useState([]);
  const [showGames, setShowGames] = useState(false);

  useEffect(() => {
    api
      .get("api/partidas/")
      .then((res) => res.data)
      .then((data) => {
        setPartidas(data);
        setFilteredPartidas(data);
      });
  }, []);

  useEffect(() => {
    let allJogadores = [];
    let allJogos = [];
    let allLocais = [];
    partidas.forEach((partida) => {
      partida.jogadores.forEach((jogador) => {
        let jogadorAux = { jogador: jogador };
        if (!allJogadores.some((j) => j.jogador === jogadorAux.jogador)) {
          allJogadores.push(jogadorAux);
        }
      });

      partida.jogos.forEach((jogo) => {
        let jogoAux = { jogo: jogo };
        if (!allJogos.some((j) => j.jogo === jogoAux.jogo)) {
          allJogos.push(jogoAux);
        }
      });

      let localAux = { local: partida.local };
      if (!allLocais.some((l) => l.local === localAux.local)) {
        allLocais.push(localAux);
      }
    });
    setJogadores(allJogadores);
    setJogadoresOptions(allJogadores);

    setJogos(allJogos);
    setJogosOptions(allJogos);

    setLocais(allLocais);
    setLocaisOptions(allLocais);
  }, [partidas]);

  const filterJogadoresOptions = () => {
    const newJogadoresOptions = jogadores.filter((jogador) => {
      return partidas.some((partida) => {
        return (
          partida.jogadores.includes(jogador.jogador) &&
          (selectedJogos.length === 0 ||
            selectedJogos.every((jogo) => partida.jogos.includes(jogo))) &&
          (selectedLocais.length === 0 ||
            selectedLocais.includes(partida.local))
        );
      });
    });
    setJogadoresOptions(newJogadoresOptions);
  };

  const filterJogoOptions = () => {
    const newJogosOptions = jogos.filter((jogo) => {
      return partidas.some((partida) => {
        return (
          partida.jogos.includes(jogo.jogo) &&
          (selectedJogadores.length === 0 ||
            selectedJogadores.every((jogador) =>
              partida.jogadores.includes(jogador),
            )) &&
          (selectedLocais.length === 0 ||
            selectedLocais.includes(partida.local))
        );
      });
    });
    setJogosOptions(newJogosOptions);
  };

  const filterLocaisOptions = () => {
    const newLocaisOptions = locais.filter((local) => {
      return partidas.some((partida) => {
        return (
          partida.local === local.local &&
          (selectedJogadores.length === 0 ||
            selectedJogadores.every((jogador) =>
              partida.jogadores.includes(jogador),
            )) &&
          (selectedJogos.length === 0 ||
            selectedJogos.every((jogo) => partida.jogos.includes(jogo)))
        );
      });
    });
    setLocaisOptions(newLocaisOptions);
  };

  const filterJogadores = (e) => {
    let auxJogadores = [];
    e.forEach((option) => {
      auxJogadores.push(option.jogador);
    });
    setSelectedJogadores(auxJogadores);
  };

  const filterJogos = (e) => {
    let auxJogos = [];
    e.forEach((option) => {
      auxJogos.push(option.jogo);
    });
    setSelectedJogos(auxJogos);
  };

  const filterLocais = (e) => {
    let auxLocais = [];
    e.forEach((option) => {
      auxLocais.push(option.local);
    });
    setSelectedLocais(auxLocais);
  };

  useEffect(() => {
    const filtered = partidas
      .filter((partida) => {
        if (selectedJogadores.length !== 0) {
          return selectedJogadores.every((jogador) =>
            partida.jogadores.includes(jogador),
          );
        } else {
          return true;
        }
      })
      .filter((partida) => {
        if (selectedJogos.length !== 0) {
          return selectedJogos.every((jogo) => partida.jogos.includes(jogo));
        } else {
          return true;
        }
      })
      .filter((partida) => {
        if (selectedLocais.length !== 0) {
          return selectedLocais.includes(partida.local);
        } else {
          return true;
        }
      });
    setFilteredPartidas(filtered);

    filterJogadoresOptions();
    filterJogoOptions();
    filterLocaisOptions();
  }, [selectedJogadores, selectedJogos, selectedLocais]);

  useEffect(() => {
    let classificacaoAux = [];
    if (selectedJogadores.length > 0) {
      selectedJogadores.map((j) =>
        classificacaoAux.push({ jogador: j, pontos: 0 }),
      );
    } else {
      jogadoresOptions.map((jogador) => {
        classificacaoAux.push({
          jogador: jogador.jogador,
          pontos: 0,
        });
      });
    }

    filteredPartidas.forEach((partida) => {
      const numPosicoes = Math.max(
        ...partida.classificacoes.reduce((acc, classificacao) => {
          if (!acc.includes(classificacao.posicao)) {
            acc.push(classificacao.posicao);
          }
          return acc;
        }, []),
      );

      // const numJogadores = partida.jogadores.length;
      partida.classificacoes.forEach((classificacao) => {
        // const pontos = (numJogadores - classificacao.posicao + 1) * 10;
        let pontos;
        const jogadorIndex = classificacaoAux.findIndex(
          (j) => j.jogador === classificacao.nome,
        );
        if (jogadorIndex !== -1) {
          if (numPosicoes % 2 === 0) {
            if (classificacao.posicao <= numPosicoes / 2) {
              pontos = numPosicoes / 2 - classificacao.posicao + 1;
            } else {
              pontos = numPosicoes / 2 - classificacao.posicao;
            }
          } else {
            if (classificacao.posicao < Math.ceil(numPosicoes / 2)) {
              pontos = Math.ceil(numPosicoes / 2) - classificacao.posicao;
            } else if (classificacao.posicao > Math.ceil(numPosicoes / 2)) {
              pontos = Math.ceil(numPosicoes / 2) - classificacao.posicao;
            } else {
              pontos = 0;
            }
          }
          classificacaoAux[jogadorIndex].pontos += pontos;
        }
      });
    });
    setClassificacao(classificacaoAux);
  }, [filteredPartidas]);

  return (
    <div className="p-4">
      <h1>Estatísticas</h1>
      <CRow>
        <CCol lg={4} sm={12}>
          <Select
            id="jogadores"
            name="jogadores"
            className="form-input bg-secondary text-black"
            placeholder="Filtrar os jogadores..."
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
            options={jogadoresOptions}
            getOptionLabel={(option) => option.jogador}
            getOptionValue={(option) => option.jogador}
            onChange={filterJogadores}
          />
        </CCol>
        <CCol lg={4} sm={12}>
          <Select
            id="jogos"
            name="jogos"
            className="form-input bg-secondary text-black"
            placeholder="Filtrar os jogos..."
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
            options={jogosOptions}
            getOptionLabel={(option) => option.jogo}
            getOptionValue={(option) => option.jogo}
            onChange={filterJogos}
          />
        </CCol>
        <CCol lg={4} sm={12}>
          <Select
            id="locais"
            name="locais"
            className="form-input bg-secondary text-black"
            placeholder="Filtrar os locais..."
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
            options={locaisOptions}
            getOptionLabel={(option) => option.local}
            getOptionValue={(option) => option.local}
            onChange={filterLocais}
          />
        </CCol>
      </CRow>
      <div className="p-3 bg-darkgray rounded shadow">
        <CTable
          color="dark"
          align="middle"
          className="text-white bg-darkgray"
          hover
        >
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">Posição</CTableHeaderCell>
              <CTableHeaderCell scope="col">Nome</CTableHeaderCell>
              <CTableHeaderCell scope="col">Pontos</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {classificacao
              .sort((a, b) => b.pontos - a.pontos)
              .map((c, index) => (
                <CTableRow key={c.jogador}>
                  <CTableDataCell>{index + 1}º</CTableDataCell>
                  <CTableDataCell>{c.jogador}</CTableDataCell>
                  <CTableDataCell>{c.pontos}</CTableDataCell>
                </CTableRow>
              ))}
          </CTableBody>
        </CTable>
        <CButton color="secondary" onClick={() => setShowGames(!showGames)}>
          {showGames ? "Ocultar Partidas" : "Mostrar Partidas"}
        </CButton>
        {showGames && (
          <>
            <h2 className="mt-3">Partidas</h2>
            <CTable
              color="dark"
              align="middle"
              className="text-white bg-darkgray"
              hover
            >
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">Jogo</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Data</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Local</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Jogadores</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredPartidas.map((partida) => (
                  <CTableRow key={partida.id}>
                    <CTableDataCell>{partida.jogo}</CTableDataCell>
                    <CTableDataCell>
                      {new Date(partida.dataPartida).toLocaleDateString()}
                    </CTableDataCell>
                    <CTableDataCell>{partida.local}</CTableDataCell>
                    <CTableDataCell>
                      <CTable
                        color="dark"
                        align="middle"
                        className="text-white bg-darkgray"
                        hover
                      >
                        <CTableBody>
                          {partida.classificacoes
                            .sort((a, b) => a.posicao - b.posicao)
                            .map((classificacao, index) => (
                              <CTableRow key={index}>
                                <CTableDataCell>{index + 1}º</CTableDataCell>
                                <CTableDataCell>
                                  {classificacao.nome}
                                </CTableDataCell>
                              </CTableRow>
                            ))}
                        </CTableBody>
                      </CTable>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </>
        )}
      </div>
    </div>
  );
}

export default Statistics;
