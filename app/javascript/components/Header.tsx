import React from "react";
import { Container, Navbar, Dropdown, Nav, NavDropdown } from "react-bootstrap";
import { bookSharp } from "ionicons/icons";
import { useNavigate } from "react-router-dom";

type HeaderProps = {
  page: string;
  setPage: (page: string) => void;
};

const Header: React.FC<HeaderProps> = ({ page, setPage }) => {
  return (
    <Navbar className="bg-white">
      <Container>
        <Navbar.Brand
          className="d-flex align-items-center"
          onClick={() => setPage("/")}
        >
          <img
            alt="inspirit-logo"
            src={bookSharp}
            width="40"
            height="40"
            className="d-inline-block align-top mx-2"
          />
          <div className="d-flex flex-column mx-2 h2 font-weight-bold">
            EquiTrack
          </div>
        </Navbar.Brand>
      </Container>
      <Navbar.Collapse className="mx-5">
        <Nav className="me-auto">
          <Nav.Link onClick={() => setPage("currentTable")} className="mx-5">
            Current Cap Table
          </Nav.Link>
          <Nav.Link onClick={() => setPage("safeNotes")}>
            SAFEs and Notes
          </Nav.Link>
          <Nav.Link onClick={() => setPage("modelNextRound")}>
            Model Next Round
          </Nav.Link>
          <Nav.Link onClick={() => setPage("projectedTable")}>
            Projected Cap Table
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
