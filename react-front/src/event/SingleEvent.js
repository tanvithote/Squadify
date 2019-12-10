import React, { Component } from "react";
import { singleEvent, remove, attendEvent, notAttendEvent } from "./apiEvent";
//import{listEventByGroup} from "../event/apiEvent";
import { Link, Redirect } from "react-router-dom";
import DefaultPost from "../images/tea.png";
import { isAuthenticated } from "../auth";
import Menu from "../core/Menu";
import { MdLocationOn } from "react-icons/md";
import { IoMdPeople } from "react-icons/io";
import { MdPersonOutline } from "react-icons/md";
import {TiGroup} from "react-icons/ti"
import { TiTags } from "react-icons/ti";
// import Comment from "./Comment";
// import SwipeableViews from 'react-swipeable-views';
// import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
// import AppBar from '@material-ui/core/AppBar';
// import Tabs from '@material-ui/core/Tabs';
// import Tab from '@material-ui/core/Tab';
// import Typography from '@material-ui/core/Typography';
// import Box from '@material-ui/core/Box';

class SingleEvent extends Component {
  state = {
    event: "",
    redirectToGroup: false,
    redirectToSignin: false,
    attend: false,
    attendes: [],
    tags: [],
    group:""
  };

  updateAttendes = attendes => {
    this.setState({ attendes });
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
    const eventId = this.state.event._id;

    let callApi = this.state.attend ? notAttendEvent : attendEvent; // call unlike/like method accordingly
    callApi(userId, token, eventId).then(data => {
      console.log(token);
      if (data.error) {
        console.log("error in api :", data.error);
      } else {
        console.log(data);
        this.setState({
        attend: !this.state.attend,
        attendes: data.event.attendes,
        tags: data.event.tags
        });
      }
    });
  };

  // Check if the user exists in the likes array or not. If exists, return true, else return false
  checkJoined = attendes => {
    const userId = isAuthenticated() && isAuthenticated().user._id;
    let match = attendes.indexOf(userId) !== -1; // if this user exists in the members array, then its index is not -1, return true; else return false
    // console.log(match);
    return match;
  };

  deleteEvent = () => {
    // const groupId = this.props.groupId;
    const eventId = this.props.match.params.eventId;
    const token = isAuthenticated().token;
    remove(eventId, token).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ redirectToGroup: true });
      }
    });
  };

  deleteConfirmed = () => {
    let answer = window.confirm("Are you sure to delete this group?");
    if (answer) {
      this.deleteEvent();
    }
  };

  componentDidMount = () => {
    const eventId = this.props.match.params.eventId;
    const token = isAuthenticated().token;
    singleEvent(eventId,token).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({
          event: data,
          attendes: data.attendes,
          tags: data.tags,
          attend: this.checkJoined(data.attendes)
          //   comments: data.comments
        });
        // console.log(this.state.tags);
      }
    });
  };

//   renderEvents = group_events =>{
//     return(
//       <div>
//         <h4 className="display-4 mt-3 ml-3"> <small class="text-muted">Events:</small></h4>
//     {group_events.map((event,i)=>{
//       return(
//         <div className='col-md-4 col-xs-6 mb-2' key={i}>
//                 <div class='card bwm-card'>
                
//                   <div class='card-block'>
//                     <h4 class='card-title'>{event.name}</h4>
//                     <h6 class='card-subtitle mb-4 text-muted'>{event.description.substring(0, 100)}</h6>
//                     <p class='card-text'>Event <Link to={`${event.creatorId}`}>{event.createdBy._id} </Link>
//                      on {new Date(event.eventdate).toDateString()} </p>
//                      <p class='card-text'>Timings  {new Date(event.starttime).getHours()} : {new Date(event.starttime).getMinutes()}  to 
//                          {new Date(event.endtime).getHours()} : {new Date(event.endtime).getMinutes()} </p>
//                   </div>
//                   <Link
//                      to={`/event/${event._id}`}
//                      className="btn btn-raised btn-info btn-sm text-center"
//                    >
//                      Read More About This Event
//                    </Link>
//                 </div>
//             </div>
//       );
//     })}
//     </div>
//     );
//  };
 
  renderEvent = event => {
    const creatorName = event.createdBy ? event.createdBy.name : " Unknown";
    const creatorId = event.createdBy ? event.createdBy._id : " Unknown";
    const { attend, attendes } = this.state;
    const eventId = event._id;
    const groupId = event.group;

    return (
      <div className="card-body">
        <img
          src={`${process.env.REACT_APP_API_URL}/event/photo/${eventId}`}
          alt={event.name}
          onError={i => (i.target.src = `${DefaultPost}`)}
          className="img-thumbnail mb-3"
          style={{ flex :1 , height: 500, width: 1200, resizeMode: "contain" }}
        />

        {/* {attend ? (
          <div className="float-right">
            <span> Attendes  {attendes.length}</span>
            <button
              className="btn btn-raised btn-danger"
              onClick={this.joinToggle}
            >
              Not Attend
            </button>
          </div>
        ) : (
          <div className="float-right">
            
            <button
              className="btn btn-raised btn-primary"
              onClick={this.joinToggle}
            >
              Attend 
            </button>
          </div>
        )} */}

        <br />
        
        <h4> Description : </h4>
        <p className="card-text">{event.description}</p>
        <br />
        <p class="card-text">
                        Event on {new Date(event.eventdate).toDateString()}{" "}
                      </p>
                      <p class="card-text">
                        Timings {new Date(event.starttime).getHours()} :{" "}
                        {new Date(event.starttime).getMinutes()} to {" "}
                        {new Date(event.endtime).getHours()} :{" "}
                        {new Date(event.endtime).getMinutes()}{" "}
                      </p>
        <div className="card-footer text-muted">
          {/* <p>
            Group Administrator <Link to={`/user/${creatorId}`}>{creatorName} </Link>
            on {new Date(group.created).toDateString()}
          </p> */}
          <div className="d-inline-block">
            {isAuthenticated().user &&
              isAuthenticated().user._id === creatorId && (
                <>
                  <Link
                    to={`/event/edit/${eventId}`}
                    className="btn btn-raised btn-info btn-sm mr-3"
                  >
                    Edit Event
                  </Link>

                  <button
                    onClick={this.deleteConfirmed}
                    className="btn btn-raised btn-danger btn-sm mr-3"
                  >
                    Delete Event
                  </button>
                </>
              )}
            {/* <Link to={`/group/${groupId}`} className="btn btn-raised btn-primary btn-sm mr-3">
              Back to group
            </Link> */}
          </div>
        </div>
      </div>

    );
  };


  render() {
    const {
      event,
      redirectToGroup,
      redirectToSignin,
      tags,
      attendes,
      attend,
      group
    } = this.state;
    const groupId = event.group;
    const creatorName = event.createdBy ? event.createdBy.name : " Unknown";
    const creatorId = event.createdBy ? event.createdBy._id : " Unknown";

    if (redirectToGroup) {
      return <Redirect to={`/group/${event.group}`} />;
      //   let userId = isAuthenticated().user._id;
      //   return <Redirect to={`/user/${userId}`} />;
    } else if (redirectToSignin) {
      return <Redirect to={`/signin`} />;
    }

    return (
      <div><Menu/>
      <div className="container">
        <h2 className="display-2 mt-5 ml-3">{event.name}</h2>
        {/* <h5 className="ml-3 mt-3">{event.location}</h5> */}
        <div class="flex flex--row ml-3 mr-3 flex--alignCenter organizer-row">
            <MdLocationOn />
            <span> {event.location}</span>
          </div>
          <div class="flex flex--row ml-3 flex--alignCenter organizer-row">
            <IoMdPeople />
            <span>    {attendes.length} Attending</span>
          </div>
          <div class="flex flex--row ml-3 flex--alignCenter organizer-row">
            <MdPersonOutline />
            <span>
              {" "}
              Organized by <Link to={`/user/${creatorId}`}>
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
          <br/>
          <div class="float-right">
            {/* <TiGroup /> */}
            <span>
              {" "}
              <Link to={`/group/${groupId}`} className="btn btn-raised btn-info btn-sm mr-3">
              Back to group
            </Link>{" "}
            </span>
          </div>
          {attend ? (
          <div className="flex flex--row ml-3 flex--alignCenter organizer-row">
            {/* <span> Attendes  {attendes.length}</span> */}
            <button
              className="btn btn-raised btn-danger btn-sm mr-3"
              onClick={this.joinToggle}
            >
              Not Attend
            </button>
          </div>
        ) : (
          <div className="flex flex--row ml-3 flex--alignCenter organizer-row">
            
            <button
              className="btn btn-raised btn-danger btn-sm mr-3"
              onClick={this.joinToggle}
            >
              Attend 
            </button>
          </div>
        )}
        {/* <div className="ml-3 mt-3">
          {tags.map((tag, i) => {
            return (
              <span
                key={i}
                className="badge badge-pill badge-success mr-2 display-3"
              >
                {tag}
              </span>
            );
          })}
        </div> */}

        {this.renderEvent(event)}
        {/* {this.renderEvents(group_events)} */}
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

export default SingleEvent;
