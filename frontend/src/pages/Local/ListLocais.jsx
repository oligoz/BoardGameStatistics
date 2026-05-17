import { useState, useEffect } from "react";
import { CButton, CSpinner } from "@coreui/react";
import api from "../../api";
import LocalCard from "../../components/cards/LocalCard";
import useUserStore from "../../store/userStore";
import { useNavigate } from "react-router-dom";
import useLocaisStore from "../../store/locaisStore";

function ListLocais() {
  const user = useUserStore((state) => state.user);
  // const [locais, setLocais] = useState(null);
  // const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const fetchLocais = useLocaisStore((state) => state.fetchLocais);
  const locais = useLocaisStore((state) => state.locais);
  const loading = useLocaisStore((state) => state.loading);

  const getLocais = () => {
    if (!locais) {
      fetchLocais();
    }
  };

  useEffect(() => {
    getLocais();
  }, []);

  return (
    <div className="p-4">
      <h1>Lista de Locais</h1>
      <div className="border rounded mt-3 mb-3 p-3 d-flex flex-wrap gap-3 bg-dark justify-content-center">
        {loading ? (
          <CSpinner />
        ) : locais && locais.length > 0 ? (
          locais.map((local) => (
            <LocalCard
              key={local.id}
              id={local.id}
              nome={local.nome}
              handleClick={() => navigate("/local/update/" + local.id)}
            />
          ))
        ) : (
          <h3>Nenhum local encontrado.</h3>
        )}
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
