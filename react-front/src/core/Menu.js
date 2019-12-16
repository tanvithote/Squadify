import React from "react";
import { Link, withRouter } from "react-router-dom";
import { signout, isAuthenticated } from "../auth";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import Profile from "../user/Profile";
import image from "../images/avatar.png";

const isActive = (history, path) => {
  if (history.location.pathname === path) {
    return { color: "#ff9900" };
  } else {
    return { color: "#ffffff" };
  }
};

var userId = "";
if (isAuthenticated() !== undefined && isAuthenticated().user !== undefined) {
  userId = isAuthenticated().user._id;
}
var userName = "";
if (isAuthenticated() !== undefined && isAuthenticated().user !== undefined) {
  userName = isAuthenticated().user.name;
}
var token = "";
if (isAuthenticated() !== undefined && isAuthenticated().token !== undefined) {
  token = isAuthenticated().token;
}

const Menu = ({ history }) => (
  <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
    <li className="navbar-brand" color="info">
      <Link
        className="nav-link text-info"
        color="text-info"
        style={isActive(history, "/home")}
        to="/home"
      >
        SQUADIFY
      </Link>
    </li>
    {/* <Navbar.Brand href="#home">SQUADIFY</Navbar.Brand> */}
    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
    <Navbar.Collapse id="responsive-navbar-nav">
      <Nav className="mr-auto">
        <Nav.Link href="/group/create">Start a new group</Nav.Link>
        <Nav.Link href="/groups">Explore Groups</Nav.Link>
        <Form className="ml-3" inline>
          {/* <FormControl type="text" placeholder="Search" className="justify-content-left" /> */}
          {/* <Button variant="outline-info">Search
        </Button> */}
        </Form>
      </Nav>

      <NavDropdown
        className=""
        title={<span className="text-info my-auto">{userName}</span>}
        id="collasible-nav-dropdown"
      >
        <NavDropdown.Item>
          <Link to={`/user/${userId}`}>Profile</Link>
        </NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item>
          <Link to={`/signout`}>Log out</Link>
        </NavDropdown.Item>
      </NavDropdown>
    </Navbar.Collapse>
  </Navbar>
);

export default withRouter(Menu);
