import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import Menu from "./Menu";
import { read } from "../user/apiUser";
import image from '../images/homebg.png';
import image2 from '../images/home.png';
import { listEventByUser } from "../event/apiEvent";
import { isAuthenticated } from "../auth";
import { groupsByUserTags } from "../group/apiGroup";
import { listByUserGroup} from "../post/apiPost";
import { Container } from "@material-ui/core";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import DefaultPost from "../images/tea.jpg";
import Paper from '@material-ui/core/Paper';
import { TiTags } from "react-icons/ti";

class Home extends Component {
  state = {
    events: [],
    groups:[],
    posts: [],
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

  loadPosts = userId => {
    const token = isAuthenticated().token;
    listByUserGroup(userId, token).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ posts: data });
        console.log("posts: ",data);
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
              <h4>No Upcomming Events</h4>
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
      <h4 class="text-center">Upcoming Events</h4>
          <br />
          {/* <h4 className="display-4 mt-3 ml-3"> <small class="text-muted">Events:</small></h4> */}
          <div className="col">
            <div  >
          
            {group_events.map((event, i) => {
              return (
                
                
                <div className="col-md-11 col-xs-6 mb-2" style={{ width: "500px", padding: 5 }} key={i}>
                  
                  <div class="card bwm-card" style={{ width: "300px" }}>
                    <div class="card-block">
                    <Link
                      to={`/event/${event._id}`}
                      >
                      <h4 class="card-title">{event.name}</h4>
                      </Link>
                      <h6 class="card-subtitle mb-2 text-muted">
                        {event.description.substring(0, 100)}
                      </h6>
                      <p class="card-text h5">
                        Event on {new Date(event.eventdate).toDateString()}{" "}
                      </p>
                      <p class="card-text h5 font-italic">
                        Timings - {new Date(event.starttime).getHours()} :{" "}
                        {new Date(event.starttime).getMinutes()}
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
    return (
      <div className="col">
        <h4 class="text-center">Latest Posts</h4>
        {posts.map((post, i) => {
          const posterId = post.postedBy ? `/user/{post.postedBy._id}` : "";
          const posterName = post.postedBy ? post.postedBy.name : " Unknown";

          return (
            <div className="card col-md-8 mb-2" style={{margin: 20, borderWidth: 5, border: '1px solid black'}} key={i}>
              <div className="card-title"><h4 style={{marginTop:20, marginLeft:20}}>{post.group.name}</h4></div>
              <div className="card-body" style={{ width: "400px" }}>
                
                <img
                  src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
                  alt={post.title}
                  onError={i => (i.target.src = `${DefaultPost}`)}
                  className="img-thumbnail mb-3"
                  style={{ height: "200px", width: "800px" }}
                />
                <h5 className="card-title">{post.title}</h5>
                <p className="card-text">{post.body.substring(0, 100)}</p>
                <br />
                <div class="card-footer text-muted">
                  <p>
                    Posted by <Link to={`${posterId}`}>{posterName} </Link>
                    on {new Date(post.created).toDateString()}
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
    );
  };

  renderGroups = groups => {
    return (
      <div>
        <br/>
        <h4 class="text-center">Recommended Groups</h4>
        {groups.map((group, i) => {
          const creatorId = group.createdBy
            ? group.createdBy._id
            : "";
          const creatorName = group.createdBy
            ? group.createdBy.name
            : " Unknown";

          return (
              
            <div className="col-md-11 col-xs-4 mb-2" style={{width: "400px",margin: 20}} key={i}>
              
                <div class="card bwm-card" style={{ width: "300px", margin:5 }}>
                  
                  <img
                    src={`${process.env.REACT_APP_API_URL}/group/photo/${group._id}`}
                    alt={group.name}
                    onError={i => (i.target.src = `${DefaultPost}`)}
                    className="card-img-top"
                    style={{ height: "150px", width: "300px" }}
                  />

                  <div class="card-block" style={{height:"30vh", width: "300px" }}>
                    <h6 class="card-subtitle">{group.name}</h6><br/>
                    <h5 class="card-subtitle">{group.about.substring(0, 100)}</h5 >
                    <p class="card-text">
                      <br/>Created by <Link to={`/user/${creatorId}`}>{creatorName} </Link>
                      on {new Date(group.created).toDateString()}
                    </p>
                    <div className="ml-3 mt-3">
            <TiTags />

                {
                group.tags.map((tag, i) => {
                  
                  return (
                    <span
                      key={i}
                      className="badge badge-pill badge-info mr-2 ml-2 display-3"
                    >
                      {tag}
                    </span>
                  );
                })}
                <br/>
              </div>
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
        <br/>
      </div>
    );
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
      <>
      <div>
        <Menu />
      </div>
      <div className="row" style={{backgroundImage: `url(${image})`}}>
          <div className="col-3"><Paper style={{ padding: "10px", margin: "20px", width: "390px"}}> {this.renderEvents(events)}</Paper></div>
            <div className="col-6"><Paper style={{ padding: "10px", margin: "20px", width: "820px"}}> {this.renderPosts(this.state.posts)}</Paper></div>
            <div className="col-3" ><Paper style={{ padding: "10px", margin: "20px", width: "390px"}}> {this.renderGroups(this.state.groups)}</Paper></div>
      </div>
      
      </>
          );

        }

      }

export default Home;
