import React from "react";
import { Link } from "react-router-dom";
import Menu from "./Menu";

 const Background = "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80";

const Home = () => (
  <>
  <div>
    {/* <Menu/> */}
    </div>
    <div
      style={{
        backgroundImage: `url("${Background}")`,
        height: "100%", 
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "50vh"
      }}
    >
      <h1> Welcome to Squadify</h1>
    </div>
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      {/* <Link to="/signin">
        <button className="btn btn-raised btn-warning">
          <span style={{fontWeight:"bold"}}>Join Free</span>
        </button>
      </Link> */}
    </div>
  </>
);

export default Home;
