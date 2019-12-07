import React from "react";
import { Link, withRouter } from "react-router-dom";
import { signout, isAuthenticated } from "../auth";
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Profile from "../user/Profile";
import image from '../images/avatar.png';

const isActive = (history, path) => {
  if (history.location.pathname === path) {
    return { color: "#ff9900" };
  } else {
    return { color: "#ffffff" };
  }
};


const Menu = ({ history }) => (
  <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
  <li className="navbar-brand" color="info">
         <Link className="nav-link text-info" color="text-info" style={isActive(history, "/home")} to="/home">
           SQUADIFY
         </Link>
       </li>
  {/* <Navbar.Brand href="#home">SQUADIFY</Navbar.Brand> */}
  <Navbar.Toggle aria-controls="responsive-navbar-nav" />
  <Navbar.Collapse id="responsive-navbar-nav">
    <Nav className="mr-auto">
      <Nav.Link href="/group/create">Start a new group</Nav.Link>
      <Nav.Link href="/groups">Explore</Nav.Link>
      <Form className='ml-3' inline>
      {/* <FormControl type="text" placeholder="Search" className="justify-content-left" /> */}
      {/* <Button variant="outline-info">Search
        </Button> */}
      
    </Form>
      
    </Nav>
   
    <Nav>
    </Nav>
<NavDropdown className="" title={<span className="text-info my-auto">Curry</span>} id="collasible-nav-dropdown">
    
    
    <NavDropdown.Item>Profile</NavDropdown.Item>
    
        <li className="nav-item">
             <span
               className="nav-link"
               style={
                 (isActive(history, "/signout"),
                 { cursor: "pointer", color: "#fff" })
               }
               onClick={() => signout(() => history.push("/"))}
             >
              <NavDropdown.Item>Log Out</NavDropdown.Item>
             </span>
        </li>
        {/* <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item> */}
      </NavDropdown>
  </Navbar.Collapse>
</Navbar>
);

export default withRouter(Menu);

