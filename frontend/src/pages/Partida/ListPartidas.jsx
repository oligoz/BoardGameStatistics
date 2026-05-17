import { useState, useEffect } from "react";
import { CButton, CSpinner } from "@coreui/react";
import api from "../../api";
import useUserStore from "../../store/userStore";
import { useNavigate } from "react-router-dom";
import PartidaCard from "../../components/cards/PartidaCard";
import usePartidasStore from "../../store/partidasStore";

function ListPartidas() {
  const user = useUserStore((state) => state.user);
  // const [partidas, setPartidas] = useState(null);
  // const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const partidas = usePartidasStore((state) => state.partidas);
  const loading = usePartidasStore((state) => state.loading);
  const fetchPartidas = usePartidasStore((state) => state.fetchPartidas);

  const getPartidas = () => {
    if (!partidas) {
      fetchPartidas();
    }
  };

  useEffect(() => {
    getPartidas();
  }, []);

  return (
    <div className="p-4">
      <h1>Lista de Partidas</h1>
      <div className="border rounded mt-3 mb-3 p-3 d-flex flex-wrap gap-3 bg-dark justify-content-center">
        {loading ? (
          <CSpinner />
        ) : partidas && partidas.length > 0 ? (
          partidas.map((partida) => (
            <PartidaCard
              key={partida.id}
              id={partida.id}
              jogos={partida.jogos}
              local={partida.local}
              dataPartida={partida.dataPartida}
              jogadores={partida.jogadores}
              handleClick={() => navigate("/partida/update/" + partida.id)}
            />
          ))
        ) : (
          <h3>Nenhuma partida encontrada.</h3>
        )}
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
