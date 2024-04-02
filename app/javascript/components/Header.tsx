import React from "react";
import { Container, Navbar, Dropdown, Nav, NavDropdown } from "react-bootstrap";
import { MdOutlineHandshake } from "react-icons/md";
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
          <MdOutlineHandshake className="me-2" size={40} />
          <div className="d-flex flex-column mx-2 h3 font-weight-bold">
            EquiTrack
          </div>
        </Navbar.Brand>
      </Container>
      <Navbar.Collapse className="mx-5">
        <Nav className="me-auto">
          <Nav.Link
            onClick={() => setPage("currentTable")}
            className={
              page === "currentTable"
                ? "text-decoration-underline mx-3 text-nowrap"
                : "mx-3 text-nowrap"
            }
          >
            Current Cap Table
          </Nav.Link>
          <Nav.Link
            onClick={() => setPage("safesandNotes")}
            className={
              page === "safesandNotes"
                ? "text-decoration-underline mx-3 text-nowrap"
                : "mx-3 text-nowrap"
            }
          >
            SAFEs and Notes
          </Nav.Link>
          <Nav.Link
            onClick={() => setPage("modelNextRound")}
            className={
              page === "modelNextRound"
                ? "text-decoration-underline mx-3 text-nowrap"
                : "mx-3 text-nowrap"
            }
          >
            Model Next Round
          </Nav.Link>
          <Nav.Link
            onClick={() => setPage("projectedTable")}
            className={
              page === "projectedTable"
                ? "text-decoration-underline mx-3 text-nowrap"
                : "mx-3 text-nowrap"
            }
          >
            Projected Cap Table
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
