import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import Menu from "./Menu";
import { read } from "../user/apiUser";
import image from "../images/homebg.png";
import image2 from "../images/home.png";
import { listEventByUser } from "../event/apiEvent";
import { isAuthenticated } from "../auth";
import { groupsByUserTags } from "../group/apiGroup";
import { listByUserGroup } from "../post/apiPost";
import { Container } from "@material-ui/core";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import DefaultPost from "../images/tea.jpg";
import Paper from "@material-ui/core/Paper";
import { TiTags } from "react-icons/ti";

class Home extends Component {
  state = {
    events: [],
    groups: [],
    posts: [],
    user: "",
    redirectToSignin: false,
    error: "",
    reloadPage: false
  };

  componentDidMount() {
    const { reloadPage } = this.state;
    if (reloadPage) {
      window.location.reload();
    }
    const userId = isAuthenticated().user._id;
    this.init(userId);
  }

  init = userId => {
    const token = isAuthenticated().token;
    read(userId, token).then(data => {
      if (data.error) {
        this.setState({ redirectToSignin: true });
      } else {
        this.setState({ user: data });
        //this.loadPosts(data._id); // pass userId to loadPosts by this user

        this.loadEvents(data._id);
        this.loadGroups(data._id);
        this.loadPosts(data._id);
      }
    });
  };

  loadEvents = userId => {
    const token = isAuthenticated().token;
    listEventByUser(userId, token).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ events: data });
        console.log("events :", data);
      }
    });
  };

  loadGroups = userId => {
    const token = isAuthenticated().token;
    groupsByUserTags(userId, token).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ groups: data });
        console.log(data);
      }
    });
  };

  loadPosts = userId => {
    const token = isAuthenticated().token;
    listByUserGroup(userId, token).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ posts: data });
        console.log("posts: ", data);
      }
    });
  };

  renderEvents = group_events => {
    if (group_events.length == false) {
      return (
        <div>
          <div>
            <br />
            <h4
              style={{
                fontFamily: "Roboto sans-serif",
                fontWeight: "bold"
                // fontStyle: "italic"
              }}
            >
              No Upcoming Events
            </h4>
            <br />
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <br />
          <h4
            className="text-center"
            style={{
              fontFamily: "Roboto sans-serif",
              fontWeight: "bold"
              // fontStyle: "italic"
            }}
          >
            Upcoming Events
          </h4>
          <br />
          <div className="col">
            <div>
              {group_events.map((event, i) => {
                return (
                  <div key={i}>
                    <div
                      className="card bwm-card"
                      style={{ width: "17rem", marginBottom: "8px" }}
                    >
                      <div className="card-block">
                        <Link to={`/event/${event._id}`}>
                          <h4 class="card-title">{event.name}</h4>
                        </Link>
                        <br/>
                        <h6 class="card-subtitle mb-2 text-muted">
                          {event.description.substring(0, 100)}
                        </h6>
                        <br />
                        <p class="card-text">
                          Date: {new Date(event.eventdate).toDateString()}
                          <br/>
                          Time:{" "}
                          {new Date(event.starttime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit"
                          })}{" "}
                          to{" "}
                          {new Date(event.endtime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }
  };

  renderPosts = posts => {
    if (posts === null || posts.length == false) {
      return (
        <div>
          <div>
            <br />
            <h4
              style={{
                fontFamily: "Roboto sans-serif",
                fontWeight: "bold"
                // fontStyle: "italic"
              }}
            >
              No Posts in Your Groups Yet.
            </h4>
            <br />
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <br />
          <h4
            class="text-center"
            style={{
              fontFamily: "Montserrat sans-serif",
              fontWeight: "bold"
              // fontStyle: "italic"
            }}
          >
            Latest Posts
          </h4>
          <br />
          <div className="col">
            <div>
              {posts.map((post, i) => {
                const posterId = post.postedBy
                  ? `/user/{post.postedBy._id}`
                  : "";
                const posterName = post.postedBy
                  ? post.postedBy.name
                  : " Unknown";
                return (
                  <div key={i}>
                    <div
                      className="card bwm-card"
                      style={{ width: "18rem", marginBottom: "8px" }}
                    >
                      <div className="card-block">
                        <Link to={`/group/${post.group._id}`}>
                          <h4 class="card-title">{post.group.name}</h4>
                        </Link>
                        <img
                          src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
                          alt={post.title}
                          onError={i => (i.target.src = `${DefaultPost}`)}
                          className="img-thumbnail mb-3"
                          style={{ height: "200px", width: "800px" }}
                        />
                        <h5 className="card-title">{post.title}</h5>
                        <p className="card-text">
                          {post.body.substring(0, 100)}
                        </p>
                        <Link
                          to={`post/${post._id}`}
                          className="btn btn-raised btn-primary btn-sm"
                        >
                          Read more
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }
  };

  renderGroups = groups => {
    if (groups === null || groups.length == false) {
      return (
        <div>
          <div>
            <br />
            <h4
              style={{
                fontFamily: "Roboto sans-serif",
                fontWeight: "bold"
                // fontStyle: "italic"
              }}
            >
              No Group Recommendation.
            </h4>
            <Link to={`/group/create`}>
              {" "}
              <h3>
                <span className="badge badge-primary">Create A New Group!</span>
              </h3>
            </Link>
            <br />
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <br />
          <h4
            class="text-center"
            style={{
              fontFamily: "Roboto sans-serif",
              fontWeight: "bold"
              // fontStyle: "italic"
            }}
          >
            Recommended Groups For You
          </h4>
          <br />
          <div className="col">
            <div>
              {groups.map((group, i) => {
                const creatorId = group.createdBy ? group.createdBy._id : "";
                const creatorName = group.createdBy
                  ? group.createdBy.name
                  : " Unknown";
                return (
                  <div key={i}>
                    <div
                      className="card bwm-card"
                      style={{ width: "23rem", marginBottom: "8px" }}
                    >
                      <div className="card-block">
                        <img
                          src={`${process.env.REACT_APP_API_URL}/group/photo/${group._id}`}
                          alt={group.name}
                          onError={i => (i.target.src = `${DefaultPost}`)}
                          // className="card-img-top"
                          style={{ height: "150px", width: "300px" }}
                          className="img-thumbnail mb-3 align-items-center"
                        />

                        <h4 class="card-title">{group.name}</h4>

                        <TiTags />

                        {group.tags.map((tag, i) => {
                          return (
                            <span
                              key={i}
                              className="badge badge-pill badge-info mr-2 ml-2 display-3"
                            >
                              {tag}
                            </span>
                          );
                        })}
                        <br />
                        <br />
                        <h5 class="card-subtitle">
                          {group.about.substring(0, 100)}
                        </h5>
                        <p class="card-text">
                          <br />
                          Created by{" "}
                          <Link to={`/user/${creatorId}`}>{creatorName} </Link>
                          on {new Date(group.created).toDateString()}
                        </p>
                        <br />
                        <Link
                          to={`/group/${group._id}`}
                          className="btn btn-raised btn-primary btn-sm text-center"
                        >
                          Read More About This Group
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }
  };

  render() {
    const { redirectToSignin, user, events, groups, posts } = this.state;

    if (redirectToSignin) {
      return <Redirect to="/signin" />;
    }

    return (
      <>
        <div>
          <Menu />
        </div>
        <div
          style={{
            backgroundImage: `url(${image})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            width: "100%",
            height: "600px"
          }}
        >
          <Container>
            <Row>
              <Col>
                <div
                  className="card"
                  style={{ padding: "5px", marginTop: "10px", width: "20rem" }}
                >
                  {this.renderEvents(events)}
                </div>
              </Col>
              <Col>
                <div
                  className="card"
                  style={{ padding: "5px", marginTop: "10px", width: "20rem" }}
                >
                  {this.renderPosts(posts)}{" "}
                </div>
              </Col>
              <Col>
                <div
                  className="card"
                  style={{ padding: "5px", marginTop: "10px", width: "25rem" }}
                >
                  {this.renderGroups(groups)}
                </div>
              </Col>
            </Row>
          </Container>
          {/* </div> */}
        </div>
      </>
    );
  }
}

export default Home;
