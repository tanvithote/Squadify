import React, { Component } from "react";
import { isAuthenticated, signout } from "../auth";
import { remove } from "./apiEvent";
import { Redirect } from "react-router-dom";

class DeleteEvent extends Component {
  state = {
    redirectToGroup: false
  };

  deleteEvent = () => {
    const EventId = this.props.eventId;
    const token = isAuthenticated().token;
    remove(eventId, token).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({redirectToGroup: true});
      }
    });
  };

  deleteConfirmed = () => {
    let answer = window.confirm("Are you sure to delete this Event?");
    if (answer) {
      this.deleteEvent();
    }
  };

  render() {
    if (this.state.redirectToPosts) {
      return <Redirect to="/group" />;
    } 
    return (
      <button
        onClick={this.deleteConfirmed }
        className="btn btn-raised btn-danger mr-3"
      >
        Delete Event
      </button>
    );
  }
}

export default DeleteEvent;
