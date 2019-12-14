import React, { Component } from "react";
import { isAuthenticated } from "../auth";
import { Redirect, Link } from "react-router-dom";
import { read } from "./apiUser";
import DefaultProfile from "../images/avatar.png";
import DeleteUser from "./DeleteUser";
import { listByUser } from "../post/apiPost";
import { groupsByUserJoined } from "../group/apiGroup";
import ProfileTabs from "../user/ProfileTabs";
import { listEventByUser } from "../event/apiEvent";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Menu from "../core/Menu";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      user: "",
      redirectToSignin: false,
      error: "",
      posts: [],
      groups: [],
      events: [],
      redirectToEvent: false,
      eventId: ""
    };
  }

  init = userId => {
    const token = isAuthenticated().token;
    read(userId, token).then(data => {
      if (data.error) {
        this.setState({ redirectToSignin: true });
      } else {
        this.setState({ user: data });
        this.loadPosts(data._id); // pass userId to loadPosts by this user
        this.loadGroups(data._id);
        this.loadEvents(data._id);
      }
    });
  };

  componentDidMount() {
    const userId = this.props.match.params.userId;
    this.init(userId);
  }

  loadPosts = userId => {
    const token = isAuthenticated().token;
    listByUser(userId, token).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ posts: data });
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
      }
    });
  };

  loadGroups = userId => {
    const token = isAuthenticated().token;
    groupsByUserJoined(userId, token).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ groups: data });
        console.log(data);
      }
    });
  };

  componentWillReceiveProps(props) {
    const userId = props.match.params.userId;
    this.init(userId);
  }

  handleEventClicked = event => {
    this.setState({ eventId: event.id, redirectToEvent: true });
  };

  renderCalender = events => {
    moment.locale("en-US");
    const localizer = momentLocalizer(moment);
    let eventsList = []; // Will push events to this list later

    let i = 0;
    for (i = 0; i < events.length; i++) {
      if (events[i] !== undefined) {
        // console.log(group_events[i].eventdate);
        let temp = {
          start: events[i].starttime,
          end: events[i].endtime,
          title: events[i].name,
          id: events[i]._id
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
      redirectToSignin,
      user,
      posts,
      events,
      groups,
      redirectToEvent,
      eventId
    } = this.state;

    if (redirectToSignin) {
      return <Redirect to="/signin" />;
    } else if (redirectToEvent) {
      return <Redirect to={`/event/${eventId}`} />;
    }

    const photoUrl = user._id
      ? `${process.env.REACT_APP_API_URL}/user/photo/${
          user._id
        }?${new Date().getTime()}`
      : DefaultProfile;

    return (
      <div>
        <Menu />
      
      <div className="container">
        <h2 className="mt-5 mb-5">Profile</h2>
        <div className="row">
          <div className="col-md-4">
            <img
              style={{ height: "200px", width: "auto" }}
              className="img-thumbnail"
              src={photoUrl}
              onError={i => (i.target.src = `${DefaultProfile}`)}
              alt={user.name}
            />
          </div>
          <div className="col-md-8">
            <div className="lead mt-2">
              <p>Name: {user.name}</p>
              <p>Email: {user.email}</p>
              <p>{`Joined on: ${new Date(user.created).toDateString()}`}</p>
            </div>
            {isAuthenticated().user && isAuthenticated().user._id === user._id && (
              <div className="d-inline-block">
                {/* <Link
                  className="btn btn-raised btn-info mr-3"
                  to={`/post/create`}
                >
                  Create New Post
                </Link> */}

                <Link
                  className="btn btn-raised btn-info mr-3"
                  to={`/user/edit/${user._id}`}
                >
                  Edit Profile
                </Link>
                <DeleteUser userId={user._id} />
              </div>
            )}
          </div>
        </div>
        <br/>
        <br/>

            {/* <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <Link
                
                className="nav-link text-info"
                color="text-info"
              >
                My Groups
              </Link>
              {/* <Nav.Link href="/group/create">About</Nav.Link> */}
              {/* <Link
                
                className="nav-link text-info"
                color="text-info"
              >
                My Events
              </Link>
              <Link
                
                className="nav-link text-info"
                color="text-info"
              >
                My Calendar
              </Link>
              
              {/* <Link className="nav-link text-info" color="text-info">Create Event</Link> */}
              {/* <Nav.Link className="nav-link text-info" color="text-info" href="/groups">Past Events</Nav.Link> */}
            {/* </Nav>
          </Navbar.Collapse>
        </Navbar>  */}






        <div className="row">
          <div className="col md-12 mt-5 mb-5">
            <hr />
            {/* <p className="lead">{user.about}</p> */}
            <hr />
            <ProfileTabs groups={groups} posts={posts} />
          </div>
        </div>

        <div className="row">
          {isAuthenticated().user && isAuthenticated().user._id === user._id && (
            <div>
              <button
                className="btn btn-outline-info"
                type="button"
                data-toggle="collapse"
                data-target="#collapseCalendar"
                aria-expanded="false"
                aria-controls="collapseCalendar"
              >
                View My Calendar
              </button>
              <div class="collapse" id="collapseCalendar">
                <div class="card card-body">{this.renderCalender(events)}</div>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    );
  }
}

export default Profile;
