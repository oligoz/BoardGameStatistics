import {
  CSidebar,
  CSidebarHeader,
  CSidebarNav,
  CNavItem,
  CSidebarFooter,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CAvatar,
} from "@coreui/react";
import { CIcon, CIconSvg } from "@coreui/icons-react";
import {
  cilCasino,
  cilLocationPin,
  cilList,
  cilPeople,
  cilChart,
  cilUser,
  cilOptions,
} from "@coreui/icons";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import useUserStore from "../store/userStore";

function SideBar() {
  const user = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clearUser);
  const navigate = useNavigate();

  const logOutAux = () => {
    localStorage.clear();
    clearUser();
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
    <CSidebar id="mySidebar" className="border-end vh-100" colorScheme="dark">
      <CSidebarHeader className="border-bottom">
        <Link to="/" className="nav-link">
          <h4>Board Game Statistics</h4>
        </Link>
      </CSidebarHeader>
      <CSidebarNav variant="underline" className="flex-grow-1">
        <CNavItem>
          <Link to="/estatisticas" className="nav-link">
            <CIcon customClassName="nav-icon" icon={cilChart} />
            Estatísticas
          </Link>
        </CNavItem>
        <CNavItem>
          <Link to="/jogos" className="nav-link">
            <CIcon customClassName="nav-icon" icon={cilCasino} />
            Jogos
          </Link>
        </CNavItem>
        <CNavItem>
          <Link to="/jogadores" className="nav-link">
            <CIcon customClassName="nav-icon" icon={cilPeople} />
            Jogadores
          </Link>
        </CNavItem>
        <CNavItem>
          <Link to="/locais" className="nav-link">
            <CIcon customClassName="nav-icon" icon={cilLocationPin} />
            Locais
          </Link>
        </CNavItem>
        <CNavItem>
          <Link to="/partidas" className="nav-link">
            <CIcon customClassName="nav-icon" icon={cilList} />
            Partidas
          </Link>
        </CNavItem>
        {user !== null && user.is_staff ? (
          <CNavItem>
            <Link to="/admin" className="nav-link">
              <CIcon customClassName="nav-icon" icon={cilUser} />
              Admin
            </Link>
          </CNavItem>
        ) : null}
      </CSidebarNav>
      <CSidebarFooter className="border-top p-0">
        <CSidebarNav className="flex-grow-1">
          {user === null || user.id === null ? (
            <CNavItem>
              <Link to="/login" className="nav-link">
                <CIconSvg size="xl">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 640 640"
                    >
                      <path d="M240 192C240 147.8 275.8 112 320 112C364.2 112 400 147.8 400 192C400 236.2 364.2 272 320 272C275.8 272 240 236.2 240 192zM448 192C448 121.3 390.7 64 320 64C249.3 64 192 121.3 192 192C192 262.7 249.3 320 320 320C390.7 320 448 262.7 448 192zM144 544C144 473.3 201.3 416 272 416L368 416C438.7 416 496 473.3 496 544L496 552C496 565.3 506.7 576 520 576C533.3 576 544 565.3 544 552L544 544C544 446.8 465.2 368 368 368L272 368C174.8 368 96 446.8 96 544L96 552C96 565.3 106.7 576 120 576C133.3 576 144 565.3 144 552L144 544z" />
                    </svg>
                  </svg>
                </CIconSvg>
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
        </CSidebarNav>
      </CSidebarFooter>
    </CSidebar>
  );
}

export default SideBar;
