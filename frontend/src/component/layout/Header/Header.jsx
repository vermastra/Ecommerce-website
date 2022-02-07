import React from "react";
import { Link } from "react-router-dom"
import ManageSearchSharpIcon from '@mui/icons-material/ManageSearchSharp';
import AccountBoxRoundedIcon from '@mui/icons-material/AccountBoxRounded';
import { Navbar, Container, Nav } from 'react-bootstrap'
import logo from "../../../images/logo.png"

const Header = () => {
  return (
    <>
      <Navbar bg="dark" expand="lg" variant="dark">
        <Container>
          <Navbar.Brand href="/"><img style={{width:"2rem"}} src={logo} alt="" /> Shopii</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav>
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/products">Products</Nav.Link>
              <Nav.Link href="/about">About</Nav.Link>
              <Nav.Link href="/contact">Contact</Nav.Link>

              {/* <Nav.Link href="/login">Login</Nav.Link> */}
            </Nav>
            <div style={{ width: "4rem", justifyContent: "space-between", display: "flex" }}>

              {/* <Nav.Link href="/search"><ManageSearchSharpIcon /></Nav.Link> */}
              {/* <Nav.Link href="/login"><AccountBoxRoundedIcon /></Nav.Link> */}
              <Link to="/search"><ManageSearchSharpIcon /></Link>
              <Link to="/login"><AccountBoxRoundedIcon /></Link>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  )
};

export default Header;

