import { useState, useEffect } from "react";
import { CButton } from "@coreui/react";
import api from "../../api";
import LocalCard from "../../components/cards/LocalCard";
import useUserStore from "../../store/userStore";
import { useNavigate } from "react-router-dom";

function ListLocais() {
  const user = useUserStore((state) => state.user);
  const [locais, setLocais] = useState([]);
  const navigate = useNavigate();

  const getLocais = () => {
    api
      .get("/api/locais/")
      .then((res) => res.data)
      .then((data) => {
        setLocais(data);
      })
      .catch((error) => alert(error));
  };

  useEffect(() => {
    getLocais();
  }, []);

  return (
    <div className="p-4">
      <h1>Lista de Locais</h1>
      <div className="border rounded mt-3 mb-3 p-3 d-flex flex-wrap gap-3 bg-dark justify-content-center">
        {locais.map((local) => (
          <LocalCard
            key={local.id}
            id={local.id}
            nome={local.nome}
            handleClick={() => navigate("/local/update/" + local.id)}
          />
        ))}
      </div>
      {user !== null && user.id !== null && (
        <CButton
          className="fw-bold"
          color="cornflowerblue"
          onClick={() => navigate("/local/create")}
        >
          Criar novo local
        </CButton>
      )}
    </div>
  );
}

export default ListLocais;
