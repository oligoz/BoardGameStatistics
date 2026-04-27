import { useState, useEffect } from "react";
import api from "../../api";
import JogoCard from "../../components/cards/JogoCard";
import { CButton } from "@coreui/react";
import useUserStore from "../../store/userStore";
import { useNavigate } from "react-router-dom";

function ListJogos() {
  const user = useUserStore((state) => state.user);
  const [jogos, setJogos] = useState([]);
  const navigate = useNavigate();

  const getJogos = () => {
    api
      .get("/api/jogos/")
      .then((res) => res.data)
      .then((data) => {
        setJogos(data);
      })
      .catch((error) => alert(error));
  };

  useEffect(() => {
    getJogos();
  }, []);

  return (
    <div className="p-4">
      <h1>Lista de Jogos</h1>
      <div className="border rounded mt-3 mb-3 p-3 d-flex flex-wrap gap-3 bg-dark justify-content-center">
        {jogos.map((jogo) => (
          <JogoCard
            key={jogo.id}
            id={jogo.id}
            nome={jogo.nome}
            anoLancamento={jogo.anoLancamento}
            expansao={jogo.isExpansao}
            handleClick={() => navigate("/jogo/" + jogo.id)}
          />
        ))}
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
