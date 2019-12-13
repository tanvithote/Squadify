import React, { Component } from "react";
import { Link } from "react-router-dom";
import Menu from "./Menu";
import image from "../images/home2 (1).png";
import image2 from "../images/home.png";
import { Container } from "@material-ui/core";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { isAuthenticated } from "../auth";
import DefaultPost from "../images/tea.jpg";

class Home extends Component {
  constructor() {
    super();
    this.state = { paramlist: [], reloadPage: false, groups:[] };
  }

  componentDidMount() {
    const { reloadPage } = this.state;
    if (reloadPage) {
      window.location.reload();
    }

    const token = isAuthenticated().token;
    const user = isAuthenticated().user;

    console.log(user._id);
    fetch(`${process.env.REACT_APP_API_URL}/groupsbyTags?id=${user._id}`)
      .then(res => res.json())
      .then(jsonData => {
        //console.log(jsonData);
        this.setState({ groups: jsonData });
        console.log(this.state.groups);
      });
  }

  renderGroups = groups => {
    return (
      <div className="col">
        {groups.map((group, i) => {
          const creatorId = group.createdBy
            ? group.createdBy._id
            : "";
          const creatorName = group.createdBy
            ? group.createdBy.name
            : " Unknown";

          return (
            <div className="col-md-4 col-xs-6 mb-2" key={i}>
              
                <div class="card bwm-card" style={{ width: "350px" }}>
                  
                  <img
                    src={`${process.env.REACT_APP_API_URL}/group/photo/${group._id}`}
                    alt={group.name}
                    onError={i => (i.target.src = `${DefaultPost}`)}
                    className="card-img-top"
                    style={{ height: "200px", width: "350px" }}
                  />

                  <div class="card-block" style={{height:"30vh", width: "350px" }}>
                    <h6 class="card-subtitle">{group.name}</h6>
                    <h4 class="card-title">{group.about.substring(0, 100)}</h4>
                    <p class="card-text">
                      Created by <Link to={`/user/${creatorId}`}>{creatorName} </Link>
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
              {/* </Link> */}
            </div>
          );
        })}
      </div>
    );
  };

  render() {
    return (
      <>
        <div>
          <Menu />
        </div>
        <div>
          <Container>
            <Row>
              <Col xl={3}>
                {/* insert event and calender related function here */}
              </Col>
              <Col xl={6}>{/* insert latests posts here */}</Col>
              <Col xl={3}>{this.renderGroups(this.state.groups)}</Col>
            </Row>
          </Container>
        </div>
      </>
    );
  }
}

export default Home;
