// import React from "react";
// import { Link, withRouter } from "react-router-dom";
// import { signout, isAuthenticated } from "../auth";

// const isActive = (history, path) => {
//   if (history.location.pathname === path) {
//     return { color: "#ff9900" };
//   } else {
//     return { color: "#ffffff" };
//   }
// };

// const Menu = ({ history }) => (
//   //   <nav className='navbar navbar-dark bg-dark navbar-expand-lg'>
//   //     <div className='container'>
//   //       <a className='navbar-brand' href=''>SQUADIFY</a>
//   //       <img src="/docs/4.3/assets/brand/bootstrap-solid.svg" width="30" height="30" alt=""></img>
//   //       <form className='form-inline my-2 my-lg-0'>
//   //         <input className='form-control mr-sm-2 bwm-search' type='search' placeholder="Search Groups" aria-label='Search'></input>
//   //         <button className='btn btn-outline-success my-2 my-sm-0 btn-bwm-search' type='submit'>Search</button>
//   //       </form>
//   //       <button className='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbarNavAltMarkup' aria-controls='navbarNavAltMarkup' aria-expanded='false' aria-label='Toggle navigation'>
//   //         <span className='navbar-toggler-icon'></span>
//   //       </button>
//   //       <div className='collapse navbar-collapse' id='navbarNavAltMarkup'>
//   //         <div className='navbar-nav ml-auto'>
//   //           <a className='nav-item nav-link active' href=''>Login <span className='sr-only'>(current)</span></a>
//   //           <a className='nav-item nav-link' href=''>Register</a>
//   //         </div>
//   //       </div>
//   //     </div>
//   // </nav>
//   <div>
//     <ul className="navbar navbar-dark bg-dark navbar-expand-lg">
//       <li className="navbar-brand color:white">
//         <Link
//           className="nav-link text-info"
//           style={isActive(history, "/home")}
//           to="/home"
//         >
//           SQUADIFY
//         </Link>
//       </li>
//       {isAuthenticated() && (
//         <>
//           <li className="nav-item">
//             <Link
//               className="nav-link"
//               to={"/post/create"}
//               style={isActive(history, "/post/create")}
//             >
//               Create new Post
//             </Link>
//           </li>
//           <li className="nav-item">
//             <Link
//               className="nav-link"
//               to={"/group/create"}
//               style={isActive(history, "/group/create")}
//             >
//               Create new group
//             </Link>
//           </li>
//           <li className="nav-item">
//             <Link
//               className="nav-link"
//               to={`/user/${isAuthenticated().user._id}`}
//               style={isActive(history, `/user/${isAuthenticated().user._id}`)}
//             >
//               My Profile
//             </Link>
//           </li>
//           <li className="nav-item">
//             <span
//               className="nav-link"
//               style={
//                 (isActive(history, "/signout"),
//                 { cursor: "pointer", color: "#fff" })
//               }
//               onClick={() => signout(() => history.push("/"))}
//             >
//               Sign Out
//             </span>
//           </li>
//         </>
//       )}
     
//     </ul>
//   </div>
// );

// export default withRouter(Menu);





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
      <FormControl type="text" placeholder="Search" className="justify-content-left" />
      <Button variant="outline-info">Search</Button>
      
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

