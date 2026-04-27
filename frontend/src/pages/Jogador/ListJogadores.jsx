import { useEffect, useState } from "react";
import api from "../../api";
import { CButton } from "@coreui/react";
import JogadorCard from "../../components/cards/JogadorCard";
import useUserStore from "../../store/userStore";
import { useNavigate } from "react-router-dom";

function ListJogadores() {
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();
  const [jogadores, setJogadores] = useState([]);

  useEffect(() => {
    getJogadores();
  }, []);

  const getJogadores = () => {
    api
      .get("/api/jogadores/")
      .then((res) => res.data)
      .then((data) => {
        setJogadores(data);
      })
      .catch((error) => alert(error));
  };

  return (
    <div className="p-4">
      <h1>Lista de Jogadores</h1>
      <div className="border rounded mt-3 mb-3 p-3 d-flex flex-wrap gap-3 bg-dark justify-content-center">
        {jogadores.map((jogador) => (
          <JogadorCard
            key={jogador.id}
            id={jogador.id}
            nome={jogador.nome}
            handleClick={() => navigate("/jogador/update/" + jogador.id)}
          />
        ))}
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
