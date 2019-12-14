import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import Menu from "./Menu";
import { read } from "../user/apiUser";
import image from '../images/home2 (1).png';
import image2 from '../images/home.png';
import { listEventByUser } from "../event/apiEvent";
import { isAuthenticated } from "../auth";
import { groupsByUserTags } from "../group/apiGroup";

class Home extends Component {
  state = {
    events: [],
    groups:[],
    user: "",
    redirectToSignin: false,
    error: ""
  };

  componentDidMount() {
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
        console.log("events :",data);
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

  renderEvents = group_events => {
    if (group_events.length == false) {
      //const groupId = this.state.group._id;
      //const { joined, members } = this.state;
      return (
        <div>
            <div>
              <br />
              <h2>No Upcomming Events</h2>
              <br />
            </div>
        </div>
      );
    } else {
      //console.log(group_events);
      //const groupId = this.state.group._id;
      //const { joined, members } = this.state;
      return (
        <div>
          <br />
          {/* <h4 className="display-4 mt-3 ml-3"> <small class="text-muted">Events:</small></h4> */}
          <div className="row">
            <div className="col-12 .col-sm-6 .col-md-8" >
          <ul class="list-group">
            {group_events.map((event, i) => {
              return (
                
                <li>
                <div className="col-md-6 col-xs-6 mb-2" key={i}>
                  
                  <div class="card bwm-card">
                    <div class="card-block">
                    <Link
                      to={`/event/${event._id}`}
                      >
                      <h4 class="card-title">{event.name}</h4>
                      </Link>
                      <h6 class="card-subtitle mb-2 text-muted">
                        {event.description.substring(0, 100)}
                      </h6>
                      <p class="card-text h3">
                        Event on {new Date(event.eventdate).toDateString()}{" "}
                      </p>
                      <p class="card-text h5 font-italic">
                        Timings - {new Date(event.starttime).getHours()} :{" "}
                        {new Date(event.starttime).getMinutes()}
                      </p>
                    </div>
                    
                    </div>
                 
                </div>
                </li>
                
              );
            })}
            </ul>
            </div>
          </div>
        </div>
      );
    }
  };

  
  render(){
    const {
      redirectToSignin,
      user,
      events,
      groups
    } = this.state;

    if (redirectToSignin) {
      return <Redirect to="/signin" />;
    }

    return(
    <div>
    <Menu/>
    {this.renderEvents(events)}
    <div
      style={{
        backgroundImage: `url("${image}")`,
        height: "100%", 
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "70vh"
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
        height: "20vh"
      }}
    >
    {/* <h2 m class="heroPrimary">Find your next event</h2> */}
    {/* backgroundImage: `url("${image}")`; */}
    
    
   </div>
   </div>
    );

  }

}

export default Home;
