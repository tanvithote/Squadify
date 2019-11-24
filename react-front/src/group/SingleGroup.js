import React, { Component } from "react";
import { singleGroup, remove, joinGroup, unjoinGroup } from "./apiGroup";
import{listEventByGroup} from "../event/apiEvent";
import { Link, Redirect } from "react-router-dom";
import DefaultPost from "../images/tea.jpg";
import { isAuthenticated } from "../auth";
// import DeletePost from "./DeletePost";
// import Comment from "./Comment";
// import SwipeableViews from 'react-swipeable-views';
// import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
// import AppBar from '@material-ui/core/AppBar';
// import Tabs from '@material-ui/core/Tabs';
// import Tab from '@material-ui/core/Tab';
// import Typography from '@material-ui/core/Typography';
// import Box from '@material-ui/core/Box';

class SingleGroup extends Component {
  state = {
    group: "",
    redirectToGroups: false,
    redirectToSignin: false,
    joined: false,
    members: [],
    tags: [],
    events: [],
    group_events:[]
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
    listEventByGroup(groupId,token).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({
          group_events: data,
          
        });
      }
    });

  };

  renderEvents = group_events =>{
    return(
      <div>
        <h4 className="display-4 mt-3 ml-3"> <small class="text-muted">Events:</small></h4>
    {group_events.map((event,i)=>{
      return(
        <div className='col-md-4 col-xs-6 mb-2' key={i}>
                <div class='card bwm-card'>
                
                  <div class='card-block'>
                    <h4 class='card-title'>{event.name}</h4>
                    <h6 class='card-subtitle mb-4 text-muted'>{event.description.substring(0, 100)}</h6>
                    <p class='card-text'>Event <Link to={`${event.creatorId}`}>{event.createdBy._id} </Link>
                     on {new Date(event.eventdate).toDateString()} </p>
                     <p class='card-text'>Timings  {new Date(event.starttime).getHours()} : {new Date(event.starttime).getMinutes()}  to 
                         {new Date(event.endtime).getHours()} : {new Date(event.endtime).getMinutes()} </p>
                  </div>
                  <Link
                     to={`/event/${event._id}`}
                     className="btn btn-raised btn-info btn-sm text-center"
                   >
                     Read More About This Event
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
    const { joined, members } = this.state;
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

        {joined ? (
          <div className="float-right">
            <span>{members.length} Members </span>
            <button
              className="btn btn-raised btn-danger"
              onClick={this.joinToggle}
            >
              Exit the group
            </button>
          </div>
        ) : (
          <div className="float-right">
            <span>{members.length} Members </span>
            <button
              className="btn btn-raised btn-primary"
              onClick={this.joinToggle}
            >
              Join the group
            </button>
          </div>
        )}

        <br />
        <br />
        <br />
        <div className="float-right">
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
        <p className="card-text">{group.about}</p>
        <br />
        <div class="card-footer text-muted">
          <p>
            Group Administrator <Link to={`/user/${creatorId}`}>{creatorName} </Link>
            {/* on {new Date(group.created).toDateString()} */}
          </p>
          <div className="d-inline-block">
            {isAuthenticated().user &&
              isAuthenticated().user._id === creatorId && (
                <>
                  <Link
                    to={`/group/edit/${group._id}`}
                    className="btn btn-raised btn-info btn-sm mr-3"
                  >
                    Edit group
                  </Link>

                  <button
                    onClick={this.deleteConfirmed}
                    className="btn btn-raised btn-danger mr-3"
                  >
                    Delete Group
                  </button>
                </>
              )}
            <Link to={`/groups`} className="btn btn-raised btn-primary btn-sm">
              Back to all groups
            </Link>
          </div>
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
      tags
    } = this.state;

    if (redirectToGroups) {
      return <Redirect to={`/groups`} />;
      //   let userId = isAuthenticated().user._id;
      //   return <Redirect to={`/user/${userId}`} />;
    } else if (redirectToSignin) {
      return <Redirect to={`/signin`} />;
    }

    return (
      <div className="container">
        <h2 className="display-2 mt-5 ml-3">{group.name}</h2>
        <h5 className="ml-3 mt-3">{group.location}</h5>
        <div className="ml-3 mt-3">
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
        </div>

        {this.renderGroup(group)}
        {this.renderEvents(group_events)}
        {/* <Comment
          postId={post._id}
          comments={comments.reverse()}
          updateComments={this.updateComments}
        /> */}
      </div>
      
    );
  }
}

export default SingleGroup;
