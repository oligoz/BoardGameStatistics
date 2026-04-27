import { use, useEffect, useState } from "react";
import api from "../api";
import Button from "react-bootstrap/Button";
import UserCard from "../components/cards/UserCard";
import { Link } from "react-router-dom";
import { CButton } from "@coreui/react";

function Admin() {
  const [users, setUsers] = useState([]);
  const [codigoConvite, setCodigoConvite] = useState(null);

  useEffect(() => {
    getUsers();
    getCodigoConvite();
  }, []);

  const getUsers = () => {
    api
      .get("/api/users/")
      .then((res) => res.data)
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => alert(error));
  };

  const getCodigoConvite = () => {
    api
      .get("/api/codigo-convite/")
      .then((res) => res.data)
      .then((data) => {
        setCodigoConvite(data);
      })
      .catch((error) => alert(error));
  };

  return (
    <div className="p-4">
      <h1>Admin</h1>
      <div className="bg-dark border rounded p-2">
        <div className="d-flex gap-3">
          {codigoConvite && (
            <div className="align-items-center p-2">
              <span>Código de Convite: {codigoConvite.codigo}</span>
            </div>
          )}
          <CButton
            color="cornflowerblue"
            className="fw-bold"
            onClick={getCodigoConvite}
          >
            Gerar novo código de convite
          </CButton>
          <Link to="/bgg-games">
            <CButton color="cornflowerblue" className="fw-bold">
              Atualizar tabela BGG Games
            </CButton>
          </Link>
        </div>
        <hr />
        <div className="mb-3 p-3 d-flex flex-wrap gap-3 bg-dark justify-content-center">
          {users.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Admin;
