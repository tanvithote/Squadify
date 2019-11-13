import React from "react";
import { Link, withRouter } from "react-router-dom";
import { signout, isAuthenticated } from "../auth";

const isActive = (history, path) => {
  if (history.location.pathname === path) {
    return { color: "#ff9900" };
  } else {
    return { color: "#ffffff" };
  }
};

const Menu = ({ history }) => (
//   <nav className='navbar navbar-dark bg-dark navbar-expand-lg'>
//     <div className='container'>
//       <a className='navbar-brand' href=''>SQUADIFY</a>
//       <img src="/docs/4.3/assets/brand/bootstrap-solid.svg" width="30" height="30" alt=""></img>
//       <form className='form-inline my-2 my-lg-0'>
//         <input className='form-control mr-sm-2 bwm-search' type='search' placeholder="Search Groups" aria-label='Search'></input>
//         <button className='btn btn-outline-success my-2 my-sm-0 btn-bwm-search' type='submit'>Search</button>
//       </form>
//       <button className='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbarNavAltMarkup' aria-controls='navbarNavAltMarkup' aria-expanded='false' aria-label='Toggle navigation'>
//         <span className='navbar-toggler-icon'></span>
//       </button>
//       <div className='collapse navbar-collapse' id='navbarNavAltMarkup'>
//         <div className='navbar-nav ml-auto'>
//           <a className='nav-item nav-link active' href=''>Login <span className='sr-only'>(current)</span></a>
//           <a className='nav-item nav-link' href=''>Register</a>
//         </div>
//       </div>
//     </div>
// </nav>
  <div>
    <ul className="navbar navbar-dark bg-dark navbar-expand-lg">
      <li className="navbar-brand color:white">
        <Link className="nav-link text-color:" style={isActive(history, "/home")} to="/home">
          HOME
        </Link>
      </li>

       <li className="nav-item">
        <Link className="nav-link" style={isActive(history, "/users")} to="/users">
          Users
        </Link>
      </li> 
.
      {!isAuthenticated() && (
        <>
          <li className="nav-item nav-link active text-right">
            <Link
              className="nav-link"
              style={isActive(history, "/signin")}
              to="/signin"
            >
              Sign In
            </Link>
          </li>
          <li className="nav-item nav-link">
            <Link
              className="nav-link"
              style={isActive(history, "/signup")}
              to="/signup"
            >
              Sign Up
            </Link>
          </li>
        </>
      )}

      {isAuthenticated() && (
        <>
          <li className="nav-item">
            <Link
              className="nav-link"
              to={"/post/create"}
              style={isActive(history, "/post/create")}
            >
              Create new Post
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link"
              to={`/user/${isAuthenticated().user._id}`}
              style={isActive(history, `/user/${isAuthenticated().user._id}`)}
            >
              My Profile
            </Link>
          </li>
          <li className="nav-item">
            <span
              className="nav-link"
              style={
                (isActive(history, "/signout"),
                { cursor: "pointer", color: "#fff" })
              }
              onClick={() => signout(() => history.push("/"))}
            >
              Sign Out
            </span>
          </li>
        </>
      )}
    </ul>
  </div>
);

export default withRouter(Menu);
