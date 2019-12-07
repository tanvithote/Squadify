import React, { Component } from "react";
import { singleGroup, remove, joinGroup, unjoinGroup } from "./apiGroup";
import { listEventByGroup } from "../event/apiEvent";
import { Link, Redirect } from "react-router-dom";
import DefaultPost from "../images/tea.jpg";
import { isAuthenticated } from "../auth";
import { MdLocationOn } from "react-icons/md";
import { TiTags } from "react-icons/ti";
import { IoMdPeople } from "react-icons/io";
import { MdPersonOutline } from "react-icons/md";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Menu from "../core/Menu";
// import DeletePost from "./DeletePost";
// import Comment from "./Comment";
// import SwipeableViews from 'react-swipeable-views';
// import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
// import AppBar from '@material-ui/core/AppBar';
// import Tabs from '@material-ui/core/Tabs';
// import Tab from '@material-ui/core/Tab';
// import Typography from '@material-ui/core/Typography';
// import Box from '@material-ui/core/Box';

class About extends Component {
  state = {
    group: "",
    redirectToGroups: false,
    redirectToSignin: false,
    joined: false,
    members: [],
    tags: [],
    events: [],
    group_events: []
  };

  updateMembers = members => {
    this.setState({ members });
  };

  updateTags = tags => {
    this.setState({ tags });
  };

  joinToggle = () => {
    if (!isAuthenticated()) {
      this.setState({ redirectToSignin: true });
      return false;
    }

    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;
    const groupId = this.state.group._id;

    let callApi = this.state.joined ? unjoinGroup : joinGroup; // call unlike/like method accordingly
    callApi(userId, token, groupId).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({
          joined: !this.state.joined,
          members: data.members,
          tags: data.tags
        });
      }
    });
  };

  // Check if the user exists in the likes array or not. If exists, return true, else return false
  checkJoined = members => {
    const userId = isAuthenticated() && isAuthenticated().user._id;
    let match = members.indexOf(userId) !== -1; // if this user exists in the members array, then its index is not -1, return true; else return false
    return match;
  };

  deleteGroup = () => {
    // const groupId = this.props.groupId;
    const groupId = this.props.match.params.groupId;
    const token = isAuthenticated().token;
    remove(groupId, token).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ redirectToGroups: true });
      }
    });
  };

  deleteConfirmed = () => {
    let answer = window.confirm("Are you sure to delete this group?");
    if (answer) {
      this.deleteGroup();
    }
  };

  componentDidMount = () => {
    const groupId = this.props.match.params.groupId;
    const token = isAuthenticated().token;
    singleGroup(groupId).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({
          group: data,
          members: data.members,
          tags: data.tags,
          joined: this.checkJoined(data.members)
          //   comments: data.comments
        });
      }
    });
    listEventByGroup(groupId, token).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({
          group_events: data
        });
      }
    });
  };

  renderGroup = group => {
    const creatorName = group.createdBy ? group.createdBy.name : " Unknown";
    const creatorId = group.createdBy ? group.createdBy._id : " Unknown";
    const { joined, members, group_events } = this.state;
    const groupId = group._id;

    return (
      <div className="card-body">
        <img
          src={`${process.env.REACT_APP_API_URL}/group/photo/${groupId}`}
          alt={group.name}
          onError={i => (i.target.src = `${DefaultPost}`)}
          className="img-thumbnail mb-3"
          style={{ height: "300px", width: "100%", objectFit: "cover" }}
        />

        <br />
        <br />
        <br />

        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <Link
                to={`/group/${groupId}/about`}
                className="nav-link text-info"
                color="text-info"
              >
                About
              </Link>
              {/* <Nav.Link href="/group/create">About</Nav.Link> */}
              <Link
                to={`/group/${groupId}/events`}
                className="nav-link text-info"
                color="text-info"
              >
                Events
              </Link>
              <Link
                to={`/group/${groupId}/posts`}
                className="nav-link text-info"
                color="text-info"
                href="/group/${groupId}/Posts"
              >
                Posts
              </Link>
              <Link
                to={`/group/${groupId}/calendar`}
                className="nav-link text-info"
                color="text-info"
              >
                Calendar
              </Link>
              {/* <Link
                to={`/group/${groupId}/events`}
                className="nav-link text-info"
                color="text-info"
                href="/group/${groupId}/Members"
              >
                Members
              </Link> */}
              {/* <Nav.Link className="nav-link text-info" color="text-info" href="/groups">Past Events</Nav.Link> */}
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        {/* <div className="float-right">
        <Link
            to={`/group/${groupId}/posts`}
            className="btn btn-raised btn-primary btn-sm mr-2"
          >
            Discussion Forum
          </Link>
          <Link
            to={`/group/${groupId}/post/create`}
            className="btn btn-raised btn-primary btn-sm mr-2"
          >
            Create a post
          </Link>

          <Link
            to={`/group/${groupId}/event/create`}
            className="btn btn-raised btn-primary btn-sm"
          >
            Create Event
          </Link>
        </div>*/}
        <br />
        <p className="card-text">{group.about}</p>
        <br />
        {/* {this.renderEvents(group_events)} */}

        <div class="card-footer text-muted">
          {/* <p>
            Group Administrator <Link to={`/user/${creatorId}`}>{creatorName} </Link>
            {/* on {new Date(group.created).toDateString()} */}
          {/* </p>  */}

          {isAuthenticated().user && isAuthenticated().user._id === creatorId && (
            <>
              <Link
                to={`/group/edit/${group._id}`}
                className="btn btn-raised btn-info btn-sm mr-3"
              >
                Edit group
              </Link>

              <button
                onClick={this.deleteConfirmed}
                className="btn btn-raised btn-danger btn-sm mr-3"
              >
                Delete Group
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  render() {
    const {
      group,
      redirectToGroups,
      redirectToSignin,
      members,
      group_events,
      tags,
      joined
    } = this.state;

    const creatorName = group.createdBy ? group.createdBy.name : " Unknown";
    const creatorId = group.createdBy ? group.createdBy._id : " Unknown";

    if (redirectToGroups) {
      return <Redirect to={`/groups`} />;
      //   let userId = isAuthenticated().user._id;
      //   return <Redirect to={`/user/${userId}`} />;
    } else if (redirectToSignin) {
      return <Redirect to={`/signin`} />;
    }

    return (
      <div>
        <Menu />

        <div className="container">
          {" "}
          {/* original */}
          <h2 className="display-2 mt-5 ml-3 text-dark">{group.name}</h2>
          {/* <div><MdLocationOn/><h5 className="ml-3 mt-3">{group.location}</h5></div> */}
          <div class="flex flex--row ml-3 mr-3 flex--alignCenter organizer-row">
            <MdLocationOn />
            <span> {group.location}</span>
          </div>
          <div class="flex flex--row ml-3 flex--alignCenter organizer-row">
            <IoMdPeople />
            <span>
              {" "}
              {members.length} members
              {joined ? (
                <div className="float-right">
                  {/* <span>{members.length} Members </span> */}
                  <button
                    className="btn btn-raised btn-danger btn-sm mr-3"
                    onClick={this.joinToggle}
                  >
                    Exit the group
                  </button>
                </div>
              ) : (
                <div className="float-right ml-0">
                  {/* <span>{members.length} Members </span> */}
                  <button
                    className="btn btn-raised btn-info"
                    onClick={this.joinToggle}
                  >
                    Join the group
                  </button>
                </div>
              )}
            </span>
          </div>
          <div class="flex flex--row ml-3 flex--alignCenter organizer-row">
            <MdPersonOutline />
            <span>
              {" "}
              Created by <Link to={`/user/${creatorId}`}>
                {creatorName}{" "}
              </Link>{" "}
            </span>
          </div>
          <div className="ml-3 mt-3">
            <TiTags />
            {tags.map((tag, i) => {
              return (
                <span
                  key={i}
                  className="badge badge-pill badge-info mr-2 ml-2 display-3"
                >
                  {tag}
                </span>
              );
            })}
          </div>
          {this.renderGroup(group)}
          {/* <Comment
          postId={post._id}
          comments={comments.reverse()}
          updateComments={this.updateComments}
        /> */}
        </div>
      </div>
    );
  }
}

export default About;
