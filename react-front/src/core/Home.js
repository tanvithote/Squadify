import React from "react";
import { Link } from "react-router-dom";
import Menu from "./Menu";
import image from '../images/home2.png';
import image2 from '../images/home.png';



const Home = () => (
  <>
  <div>
    <Menu/>
    </div>
    <div
      style={{
        backgroundImage: `url("${image}")`,
        height: "100%", 
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "50vh"
      }}
    >

    </div>
    <div
      style={{
        backgroundImage: `url("${image2}")`,
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "50vh"
      }}
    >
    {/* <h2 m class="heroPrimary">Find your next event</h2> */}
    {/* backgroundImage: `url("${image}")`; */}
    
    
    </div>
  </>
);

export default Home;
