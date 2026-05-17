import { useState, useEffect } from "react";
import api from "../../api";
import JogoCard from "../../components/cards/JogoCard";
import { CButton, CSpinner } from "@coreui/react";
import useUserStore from "../../store/userStore";
import { useNavigate } from "react-router-dom";
import useJogosStore from "../../store/jogosStore";

function ListJogos() {
  const user = useUserStore((state) => state.user);
  // const [jogos, setJogos] = useState(null);
  // const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const jogos = useJogosStore((state) => state.jogos);
  const loading = useJogosStore((state) => state.loading);
  const fetchJogos = useJogosStore((state) => state.fetchJogos);

  const getJogos = () => {
    if (!jogos) {
      fetchJogos();
    }
  };

  useEffect(() => {
    getJogos();
  }, []);

  return (
    <div className="p-4">
      <h1>Lista de Jogos</h1>
      <div className="border rounded mt-3 mb-3 p-3 d-flex flex-wrap gap-3 bg-dark justify-content-center">
        {loading ? (
          <CSpinner />
        ) : jogos && jogos.length > 0 ? (
          jogos.map((jogo) => (
            <JogoCard
              key={jogo.id}
              id={jogo.id}
              nome={jogo.nome}
              anoLancamento={jogo.anoLancamento}
              expansao={jogo.isExpansao}
              handleClick={() => navigate("/jogo/" + jogo.id)}
            />
          ))
        ) : (
          <h3>Nenhum jogo encontrado.</h3>
        )}
      </div>
      {user !== null && user.id !== null && (
        <CButton
          className="fw-bold"
          color="cornflowerblue"
          onClick={() => navigate("/jogos/create")}
        >
          Criar novo jogo
        </CButton>
      )}
    </div>
  );
}

export default ListJogos;
