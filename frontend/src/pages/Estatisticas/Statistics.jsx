import { useState, useEffect } from "react";
import Select from "react-select";
import api from "../../api";
import {
  CButton,
  CCol,
  CRow,
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
  const [firstDate, setFirstDate] = useState(null);
  const [today, setToday] = useState(null);
  const [custom, setCustom] = useState(false);
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");

  useEffect(() => {
    api
      .get("api/partidas/")
      .then((res) => res.data)
      .then((data) => {
        if (data.length > 0) {
          let earliestDate = new Date(data[0].dataPartida + "T00:00:00");
          data.forEach((partida) => {
            const partidaDate = new Date(partida.dataPartida + "T00:00:00");
            if (partidaDate < earliestDate) {
              earliestDate = partidaDate;
            }
          });
          setFirstDate(earliestDate);
          const todayDate = new Date();
          const todayDay = todayDate.getDate();
          const todayMonth = todayDate.getMonth();
          const todayYear = todayDate.getFullYear();
          setToday(
            String(todayYear) +
              "-" +
              String(todayMonth + 1).padStart(2, "0") +
              "-" +
              String(todayDay).padStart(2, "0"),
          );
          setDateStart(earliestDate.toISOString().split("T")[0]);
          setDateEnd(
            String(todayYear) +
              "-" +
              String(todayMonth + 1).padStart(2, "0") +
              "-" +
              String(todayDay).padStart(2, "0"),
          );
        }
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

  useEffect(() => {
    const newJogadoresOptions = jogadores.filter((jogador) => {
      return partidas.some((partida) => {
        return (
          [jogador.jogador, ...selectedJogadores].every((j) =>
            partida.jogadores.includes(j),
          ) &&
          (selectedJogos.length === 0 ||
            selectedJogos.every((jogo) => partida.jogos.includes(jogo))) &&
          (selectedLocais.length === 0 ||
            selectedLocais.includes(partida.local)) &&
          (dateStart === "" ||
            dateEnd === "" ||
            (new Date(partida.dataPartida + "T00:00:00") >=
              new Date(dateStart + "T00:00:00") &&
              new Date(partida.dataPartida + "T00:00:00") <=
                new Date(dateEnd + "T00:00:00")))
        );
      });
    });
    setJogadoresOptions(newJogadoresOptions);
  }, [
    partidas,
    jogadores,
    selectedJogadores,
    selectedJogos,
    selectedLocais,
    dateStart,
    dateEnd,
  ]);

  useEffect(() => {
    const newJogosOptions = jogos.filter((jogo) => {
      return partidas.some((partida) => {
        return (
          [jogo.jogo, ...selectedJogos].every((j) =>
            partida.jogos.includes(j),
          ) &&
          (selectedJogadores.length === 0 ||
            selectedJogadores.every((jogador) =>
              partida.jogadores.includes(jogador),
            )) &&
          (selectedLocais.length === 0 ||
            selectedLocais.includes(partida.local)) &&
          (dateStart === "" ||
            dateEnd === "" ||
            (new Date(partida.dataPartida + "T00:00:00") >=
              new Date(dateStart + "T00:00:00") &&
              new Date(partida.dataPartida + "T00:00:00") <=
                new Date(dateEnd + "T00:00:00")))
        );
      });
    });
    setJogosOptions(newJogosOptions);
  }, [
    partidas,
    jogos,
    selectedJogadores,
    selectedJogos,
    selectedLocais,
    dateStart,
    dateEnd,
  ]);

  useEffect(() => {
    const newLocaisOptions = locais.filter((local) => {
      return partidas.some((partida) => {
        return (
          partida.local === local.local &&
          (selectedJogadores.length === 0 ||
            selectedJogadores.every((jogador) =>
              partida.jogadores.includes(jogador),
            )) &&
          (selectedJogos.length === 0 ||
            selectedJogos.every((jogo) => partida.jogos.includes(jogo))) &&
          (dateStart === "" ||
            dateEnd === "" ||
            (new Date(partida.dataPartida + "T00:00:00") >=
              new Date(dateStart + "T00:00:00") &&
              new Date(partida.dataPartida + "T00:00:00") <=
                new Date(dateEnd + "T00:00:00")))
        );
      });
    });
    setLocaisOptions(newLocaisOptions);
  }, [
    partidas,
    locais,
    selectedJogadores,
    selectedJogos,
    selectedLocais,
    dateStart,
    dateEnd,
  ]);

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
      })
      .filter((partida) => {
        if (!dateStart || !dateEnd) {
          return true;
        }

        const partidaDate = new Date(partida.dataPartida + "T00:00:00");
        const dataInicioInput = new Date(dateStart + "T00:00:00");
        const dataFimInput = new Date(dateEnd + "T00:00:00");
        return partidaDate >= dataInicioInput && partidaDate <= dataFimInput;
      });
    setFilteredPartidas(filtered);
  }, [
    partidas,
    selectedJogadores,
    selectedJogos,
    selectedLocais,
    dateStart,
    dateEnd,
  ]);

  useEffect(() => {
    let classificacaoAux = [];
    if (selectedJogadores.length > 0) {
      selectedJogadores.forEach((j) => {
        classificacaoAux.push({ jogador: j, pontos: 0 });
      });
    } else {
      jogadoresOptions.forEach((jogador) => {
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
  }, [filteredPartidas, selectedJogadores, jogadoresOptions]);

  const changeDateSelection = (e) => {
    setCustom(e.value === 4);
    if (e.value === 0) {
      setDateStart(firstDate ? firstDate.toISOString().split("T")[0] : "");
      setDateEnd(today || "");
    } else if (e.value === 1) {
      const last30Days = new Date(today + "T00:00:00");
      last30Days.setDate(last30Days.getDate() - 30);
      setDateStart(last30Days.toISOString().split("T")[0]);
      setDateEnd(today || "");
    } else if (e.value === 2) {
      const startOfYear = new Date(today + "T00:00:00");
      startOfYear.setMonth(0);
      startOfYear.setDate(1);
      setDateStart(startOfYear.toISOString().split("T")[0]);
      setDateEnd(today || "");
    } else if (e.value === 3) {
      const startOfLastYear = new Date(today + "T00:00:00");
      startOfLastYear.setFullYear(startOfLastYear.getFullYear() - 1);
      startOfLastYear.setMonth(0);
      startOfLastYear.setDate(1);
      const endOfLastYear = new Date(startOfLastYear);
      endOfLastYear.setMonth(11);
      endOfLastYear.setDate(31);
      setDateStart(startOfLastYear.toISOString().split("T")[0]);
      setDateEnd(endOfLastYear.toISOString().split("T")[0]);
    }
  };

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
      <CRow>
        <CCol>
          <Select
            className="form-input bg-secondary"
            options={[
              { label: "Todas as datas", value: 0 },
              { label: "Últimos 30 dias", value: 1 },
              { label: "Este ano", value: 2 },
              { label: "Ano passado", value: 3 },
              { label: "Personalizado", value: 4 },
            ]}
            defaultValue={{ label: "Todas as datas", value: 0 }}
            onChange={(selectedOption) => changeDateSelection(selectedOption)}
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
              singleValue: (base) => ({
                ...base,
                color: "white",
              }),
            }}
          />
        </CCol>
      </CRow>
      <CRow>
        <CCol>
          <input
            type="date"
            id="data-inicio"
            name="data-inicio"
            className="form-input bg-secondary text-white"
            value={dateStart}
            disabled={!custom}
            onChange={(e) => setDateStart(e.target.value)}
          />
        </CCol>
        <CCol>
          <input
            type="date"
            id="data-fim"
            name="data-fim"
            className="form-input bg-secondary text-white"
            value={dateEnd}
            disabled={!custom}
            onChange={(e) => setDateEnd(e.target.value)}
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
              ? classificacao
                  .sort((a, b) => b.pontos - a.pontos)
                  .map((c, index) => (
                    <CTableRow key={c.jogador}>
                      <CTableDataCell>{index + 1}º</CTableDataCell>
                      <CTableDataCell>{c.jogador}</CTableDataCell>
                      <CTableDataCell>{c.pontos}</CTableDataCell>
                    </CTableRow>
                  ))
              : null}
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
              responsive
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
                    <CTableDataCell>{partida.jogos.join(", ")}</CTableDataCell>
                    <CTableDataCell>
                      {new Date(
                        partida.dataPartida + "T00:00:00",
                      ).toLocaleDateString()}
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
