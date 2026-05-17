import { useEffect, useState } from "react";
import api from "../../api";
import { CButton, CSpinner } from "@coreui/react";
import JogadorCard from "../../components/cards/JogadorCard";
import useUserStore from "../../store/userStore";
import { useNavigate } from "react-router-dom";
import useJogadoresStore from "../../store/jogadoresStore";

function ListJogadores() {
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();
  // const [jogadores, setJogadores] = useState(null);
  // const [loading, setLoading] = useState(false);
  const jogadores = useJogadoresStore((state) => state.jogadores);
  const loading = useJogadoresStore((state) => state.loading);
  const fetchJogadores = useJogadoresStore((state) => state.fetchJogadores);

  useEffect(() => {
    getJogadores();
  }, []);

  const getJogadores = () => {
    if (!jogadores) {
      fetchJogadores();
    }
  };

  return (
    <div className="p-4">
      <h1>Lista de Jogadores</h1>
      <div className="border rounded mt-3 mb-3 p-3 d-flex flex-wrap gap-3 bg-dark justify-content-center">
        {loading ? (
          <CSpinner />
        ) : jogadores && jogadores.length > 0 ? (
          jogadores.map((jogador) => (
            <JogadorCard
              key={jogador.id}
              id={jogador.id}
              nome={jogador.nome}
              handleClick={() => navigate("/jogador/update/" + jogador.id)}
            />
          ))
        ) : (
          <h3>Nenhum jogador encontrado.</h3>
        )}
      </div>
      {user !== null && user.id !== null && (
        <CButton
          className="fw-bold"
          color="cornflowerblue"
          onClick={() => navigate("/jogador/create")}
        >
          Criar novo jogador
        </CButton>
      )}
    </div>
  );
}

export default ListJogadores;
