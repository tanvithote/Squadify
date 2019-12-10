import React, { Component } from "react";
import { singleGroup, remove, joinGroup, unjoinGroup } from "./apiGroup";
import { listEventByGroup } from "../event/apiEvent";
import { Link, Redirect } from "react-router-dom";
import DefaultPost from "../images/tea.png";
import { isAuthenticated } from "../auth";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { MdLocationOn } from "react-icons/md";
import { TiTags } from "react-icons/ti";
import { IoMdPeople } from "react-icons/io";
import { MdPersonOutline } from "react-icons/md";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Menu from "../core/Menu";

class GroupCalendar extends Component {
  state = {
    group: "",
    redirectToGroups: false,
    redirectToSignin: false,
    joined: false,
    members: [],
    tags: [],
    // events: [],
    group_events: [],
    redirectToEvent: false,
    eventId: ""
  };

  updateMembers = members => {
    this.setState({ members });
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

  renderEvents = group_events => {
    return (
      <div>
        <h4 className="display-4 mt-3 ml-3">
          {" "}
          <small class="text-muted">Events:</small>
        </h4>
        {group_events.map((event, i) => {
          return (
            <div className="col-md-4 col-xs-6 mb-2" key={i}>
              <div class="card bwm-card">
                <div class="card-block">
                  <h4 class="card-title">{event.name}</h4>
                  <h6 class="card-subtitle mb-4 text-muted">
                    {event.description.substring(0, 100)}
                  </h6>
                  <p class="card-text">
                    Date:{" "}
                    <Link to={`${event.creatorId}`}>
                      {event.createdBy._id}{" "}
                    </Link>
                    {new Date(event.eventdate).toDateString()}{" "}
                  </p>
                  <p class="card-text">
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
                <Link
                  to={`/event/${event._id}`}
                  className="btn btn-raised btn-info btn-sm text-center"
                >
                  Explore Event
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    );
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
          style={{ flex :1 , height: 500, width: 1200, resizeMode: "contain"}}
        />

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
              {/* <Link className="nav-link text-info" color="text-info">Create Event</Link> */}
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
        </div>
        <p className="card-text">{group.about}</p> */}
        <br />
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

  handleEventClicked = event => {
    this.setState({ eventId: event.id, redirectToEvent: true });
  };

  renderCalender = group_events => {
    moment.locale("en-US");
    const localizer = momentLocalizer(moment);
    let eventsList = []; // Will push events to this list later

    let i = 0;
    for (i = 0; i < group_events.length; i++) {
      if (group_events[i] !== undefined) {
        // console.log(group_events[i].eventdate);
        let temp = {
          start: group_events[i].starttime,
          end: group_events[i].endtime,
          title: group_events[i].name,
          id: group_events[i]._id
        };
        eventsList.push(temp);
      }
    }

    const MyCalendar = props => (
      <Calendar
        localizer={localizer}
        events={eventsList}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "500px", width: "100%" }}
        step={60}
        showMultiDayTimes
        defaultDate={new Date()}
        onSelectEvent={event => this.handleEventClicked(event)}
      />
    );

    return (
      <div>
        <MyCalendar />
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
      redirectToEvent,
      eventId,
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
    } else if (redirectToEvent) {
      return <Redirect to={`/event/${eventId}`} />;
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
          <div class="card card-body">{this.renderCalender(group_events)}</div>
        </div>
      </div>
    );
  }
}

export default GroupCalendar;
