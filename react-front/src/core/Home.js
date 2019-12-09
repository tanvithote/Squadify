import React, { Component } from "react";
import { Link } from "react-router-dom";
import Menu from "./Menu";
import image from '../images/home2 (1).png';
import image2 from '../images/home.png';
import { Container } from "@material-ui/core";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Cookies from 'js-cookie';
import { isAuthenticated } from "../auth";

class Home extends Component{

  constructor(){
    super();
    this.state ={paramlist: []};
    reloadPage: false
}
  
  
  componentDidMount() {
    const { reloadPage } = this.state;
    if (reloadPage) {
      window.location.reload();
    }

    const token = isAuthenticated().token;
    const user = isAuthenticated().user;
    this.setState({paramlist: user});
    console.log(user);
    console.log( this.state.paramlist);
    fetch('http://localhost:8080/groupsbyTags',{
      method: 'POST',
      body: JSON.stringify(user),
      headers: {"Content-Type": "application/json"}
    })
      .then(res =>  res.json())
      .then((jsonData) =>{
          
      }
      )
   }

  render(){
      return(
        <>
      <div>
        <Menu/>
      </div>
      <div>
      <Container>
        <Row>
          <Col lg = {3} >sssss</Col>
          <Col lg = {6}>dddddddd</Col>
          <Col lg = {3}>ssssaaaa</Col>
        </Row>
      </Container>
      </div>
      </>
      );
    }
}

export default Home;
