import {
  CContainer,
  CNavbar,
  CNavbarBrand,
  CNavbarNav,
  CNavItem,
  CNavLink,
  CCollapse,
  CNavbarToggler,
  CDropdown,
  CDropdownToggle,
  CAvatar,
  CDropdownMenu,
  CDropdownItem,
} from "@coreui/react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useUserStore from "../store/userStore";
import CIcon from "@coreui/icons-react";
import { cilOptions } from "@coreui/icons";
import api from "../api";

function NavBar() {
  const [visible, setVisible] = useState(false);
  const user = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clearUser);
  const navigate = useNavigate();

  const logOutAux = () => {
    localStorage.clear();
    clearUser();
    setVisible(!visible);
    navigate("/");
  };

  const handleLogOut = async () => {
    await api.post("api/auth/logout/").catch((error) => alert(error));
    logOutAux();
  };

  const handleLogOutAll = async () => {
    await api.post("api/auth/logout-all/").catch((error) => alert(error));
    logOutAux();
  };

  return (
    <CNavbar
      expand="lg"
      id="navbar"
      className="bg-dark d-lg-none"
      colorScheme="dark"
    >
      <CContainer fluid>
        <CNavbarBrand>
          <Link to="/" className="nav-link">
            Board Game Statistics
          </Link>
        </CNavbarBrand>
        <CNavbarToggler
          aria-label="Toggle navigation"
          aria-expanded={visible}
          onClick={() => setVisible(!visible)}
        />
        <CCollapse className="navbar-collapse" visible={visible}>
          <CNavbarNav>
            <CNavItem>
              <Link
                to="/estatisticas"
                className="nav-link"
                onClick={() => setVisible(!visible)}
              >
                Estatisticas
              </Link>
            </CNavItem>
            <CNavItem>
              <Link
                to="/partidas"
                className="nav-link"
                onClick={() => setVisible(!visible)}
              >
                Partidas
              </Link>
            </CNavItem>
            <CNavItem>
              <Link
                to="/jogos"
                className="nav-link"
                onClick={() => setVisible(!visible)}
              >
                Jogos
              </Link>
            </CNavItem>
            <CNavItem>
              <Link
                to="/jogadores"
                className="nav-link"
                onClick={() => setVisible(!visible)}
              >
                Jogadores
              </Link>
            </CNavItem>
            <CNavItem>
              <Link
                to="/locais"
                className="nav-link"
                onClick={() => setVisible(!visible)}
              >
                Locais
              </Link>
            </CNavItem>
            {user !== null && user.is_staff ? (
              <CNavItem>
                <Link
                  to="/admin"
                  className="nav-link"
                  onClick={() => setVisible(!visible)}
                >
                  Admin
                </Link>
              </CNavItem>
            ) : null}
            {user === null || user.id === null ? (
              <CNavItem>
                <Link
                  to="/login"
                  className="nav-link"
                  onClick={() => setVisible(!visible)}
                >
                  Login
                </Link>
              </CNavItem>
            ) : (
              <CDropdown portal dark direction="dropup" alignment="end">
                <CDropdownToggle
                  className="text-start dropdown-noarrow"
                  color="secondary"
                >
                  <CAvatar
                    className="fw-bold fs-6 me-2"
                    color="cornflowerblue"
                    size="sm"
                    textColor="black"
                  >
                    {user.username[0].toUpperCase()}
                  </CAvatar>
                  <span className="align-middle">{user.username}</span>
                  <CIcon
                    className="align-middle position-absolute top-50 end-0 translate-middle-y me-2"
                    icon={cilOptions}
                    size="lg"
                  />
                </CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem onClick={handleLogOut}>Logout</CDropdownItem>
                  <CDropdownItem onClick={handleLogOutAll}>
                    Logout All
                  </CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            )}
          </CNavbarNav>
        </CCollapse>
      </CContainer>
    </CNavbar>
  );
}

export default NavBar;
