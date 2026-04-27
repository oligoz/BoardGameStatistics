import {
  CContainer,
  CNavbar,
  CNavbarBrand,
  CNavbarNav,
  CNavItem,
  CNavLink,
} from "@coreui/react";

function NavBar() {
  return (
    <CNavbar id="navbar" className="bg-dark d-lg-none" colorScheme="dark">
      <CContainer fluid className="d-flex justify-content-start">
        <CNavbarBrand href="#">Board Game Statistics</CNavbarBrand>
        <CNavbarNav className="d-flex flex-row gap-3">
          <CNavItem>
            <CNavLink href="#">Estatisticas</CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">Partidas</CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">Jogos</CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">Jogadores</CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">Locais</CNavLink>
          </CNavItem>
        </CNavbarNav>
      </CContainer>
    </CNavbar>
  );
}

export default NavBar;
