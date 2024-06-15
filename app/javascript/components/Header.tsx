import React from "react";
import { Container, Navbar, Dropdown, Nav, NavDropdown } from "react-bootstrap";
import { MdOutlineHandshake } from "react-icons/md";
import { useNavigate } from "react-router-dom";

type HeaderProps = {
  page?: string;
  setPage?: (page: string) => void;
  showNav: boolean;
};

const Header: React.FC<HeaderProps> = ({ page, setPage, showNav }) => {
  return (
    <Navbar className="bg-white px-5 border-bottom">
      <Container>
        <Navbar.Brand
          className="d-flex align-items-center"
          onClick={() => setPage && setPage("/")}
        >
          <MdOutlineHandshake className="me-2" size={40} />
          <div className="d-flex flex-column mx-2 h3 font-weight-bold">
            Equify
          </div>
        </Navbar.Brand>
      </Container>
      <Navbar.Collapse className="mx-5">
        {showNav && (
          <Nav className="me-auto">
            <Nav.Link
              onClick={() => !!setPage && setPage("currentTable")}
              className={
                page === "currentTable"
                  ? "text-decoration-underline mx-3 text-nowrap"
                  : "mx-3 text-nowrap"
              }
            >
              Current Cap Table
            </Nav.Link>
            <Nav.Link
              onClick={() => !!setPage && setPage("safesandNotes")}
              className={
                page === "safesandNotes"
                  ? "text-decoration-underline mx-3 text-nowrap"
                  : "mx-3 text-nowrap"
              }
            >
              SAFEs and Notes
            </Nav.Link>
            <Nav.Link
              onClick={() => !!setPage && setPage("modelNextRound")}
              className={
                page === "modelNextRound"
                  ? "text-decoration-underline mx-3 text-nowrap"
                  : "mx-3 text-nowrap"
              }
            >
              Model Next Round
            </Nav.Link>
            <Nav.Link
              onClick={() => !!setPage && setPage("proFormCapTable")}
              className={
                page === "proFormCapTable"
                  ? "text-decoration-underline mx-3 text-nowrap"
                  : "mx-3 text-nowrap"
              }
            >
              Pro Forma Cap Table
            </Nav.Link>
          </Nav>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
