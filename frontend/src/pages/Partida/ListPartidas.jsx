import { useState, useEffect } from "react";
import { CButton } from "@coreui/react";
import api from "../../api";
import useUserStore from "../../store/userStore";
import { useNavigate } from "react-router-dom";
import PartidaCard from "../../components/cards/PartidaCard";

function ListPartidas() {
  const user = useUserStore((state) => state.user);
  const [partidas, setPartidas] = useState([]);
  const navigate = useNavigate();

  const getPartidas = () => {
    api
      .get("/api/partidas/")
      .then((res) => res.data)
      .then((data) => {
        data.sort(
          (a, b) =>
            new Date(b.dataPartida + "T00:00:00") -
            new Date(a.dataPartida + "T00:00:00"),
        );
        setPartidas(data);
      })
      .catch((error) => alert(error));
  };

  useEffect(() => {
    getPartidas();
  }, []);

  return (
    <div className="p-4">
      <h1>Lista de Partidas</h1>
      <div className="border rounded mt-3 mb-3 p-3 d-flex flex-wrap gap-3 bg-dark justify-content-center">
        {partidas.map((partida) => (
          <PartidaCard
            key={partida.id}
            id={partida.id}
            jogos={partida.jogos}
            local={partida.local}
            dataPartida={partida.dataPartida}
            jogadores={partida.jogadores}
            handleClick={() => navigate("/partida/update/" + partida.id)}
          />
        ))}
      </div>
      {user !== null && user.id !== null && (
        <CButton
          className="fw-bold"
          color="cornflowerblue"
          onClick={() => navigate("/partida/create")}
        >
          Criar nova partida
        </CButton>
      )}
    </div>
  );
}

export default ListPartidas;
