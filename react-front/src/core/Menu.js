import React, { Component } from "react";
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

class Menu extends Component {
  constructor() {
    super();
    this.state = {
      reloadPage: false
    };
  }

  componentDidMount = () => {
    // const isActive = (history, path) => {
    //   if (history.location.pathname === path) {
    //     return { color: "#ff9900" };
    //   } else {
    //     return { color: "#ffffff" };
    //   }
    // };

    if (!isAuthenticated()) {
      this.setState({ reloadPage: true });
    }
  };

  render() {
    const userId = isAuthenticated().user ? isAuthenticated().user._id : "";
    const userName = isAuthenticated().user ? isAuthenticated().user.name : "";
    const token = isAuthenticated().token ? isAuthenticated().token : "";
    if (this.state.reloadPage) {
      window.location.reload();
    }
    return (
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <li className="navbar-brand" color="info">
          <Link
            className="nav-link text-info"
            color="text-info"
            // style={isActive(history, "/home")}
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
            <Nav.Link href="/groups">Explore</Nav.Link>
            <Form className="ml-3" inline>
              {/* <FormControl type="text" placeholder="Search" className="justify-content-left" /> */}
              {/* <Button variant="outline-info">Search
        </Button> */}
            </Form>
          </Nav>

          <NavDropdown
            className=""
            title={<span className="text-info my-auto">Hello, {userName}</span>}
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
  }
}

export default withRouter(Menu);
