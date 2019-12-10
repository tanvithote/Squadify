import React, { Component } from "react";
import { Link } from "react-router-dom";
import Menu from "./Menu";
import image from '../images/home2 (1).png';
import image2 from '../images/home.png';
import { Container } from "@material-ui/core";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { isAuthenticated } from "../auth";
import DefaultPost from "../images/tea.jpg";

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
    
    console.log(user);
    fetch('http://localhost:8080/groupsbyTags',{
      method: 'POST',
      body: JSON.stringify(user),
      headers: {"Content-Type": "application/json"}
    })
      .then(res =>  res.json())
      .then((jsonData) =>{
          console.log(jsonData);
          this.setState({groups: jsonData})
      }
      )
   }

   renderGroups = groups => {
    return (
      <div className="row">
        {groups.map((group, i) => {
          const creatorId = group.createdBy
            ? `/user/{group.createdBy._id}`
            : "";
          const creatorName = group.createdBy
            ? group.createdBy.name
            : " Unknown";

          return (
            <div key={i}>
              <Link to="/events/details/1234">
                <div class="card bwm-card">
                  {/* <img class='card-img-top' src='http://via.placeholder.com/350x250' alt=''></img> */}
                  <img
                    src={`${process.env.REACT_APP_API_URL}/group/photo/${group._id}`}
                    alt={group.name}
                    onError={i => (i.target.src = `${DefaultPost}`)}
                    className="card-img-top"
                    style={{ height: "200px", width: "300px" }}
                  />

                  <div class="card-block">
                    <h6 class="card-subtitle">{group.name}</h6>
                    <h4 class="card-title">{group.about.substring(0, 100)}</h4>
                    <p class="card-text">
                      Created by <Link to={`${creatorId}`}>{creatorName} </Link>
                      on {new Date(group.created).toDateString()}
                    </p>
                  </div>
                  <Link
                    to={`/group/${group._id}`}
                    className="btn btn-raised btn-info btn-sm text-center"
                  >
                    Read More About This Group
                  </Link>
                </div>
              </Link>
            </div>

          );
        })}
      </div>
    );
  };

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
          <Col lg = {3}>{this.renderGroups(this.state.groups)}</Col>
        </Row>
      </Container>
      </div>
      </>
      );
    }
}

export default Home;
