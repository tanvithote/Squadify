import React, { Component } from "react";
import { isAuthenticated, signout } from "../auth";
import { remove } from "./apiPost";
import { Redirect } from "react-router-dom";

class DeletePost extends Component {
  state = {
    redirectToPosts: false
  };

  deletePost = () => {
    const postId = this.props.postId;
    const token = isAuthenticated().token;
    remove(postId, token).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({redirectToPosts: true});
      }
    });
  };

  deleteConfirmed = () => {
    let answer = window.confirm("Are you sure to delete this post?");
    if (answer) {
      this.deletePost();
    }
  };

  render() {
    if (this.state.redirectToPosts) {
      return <Redirect to="/posts" />;
    }
    return (
      <button
        onClick={this.deleteConfirmed }
        className="btn btn-raised btn-danger mr-3"
      >
        Delete Post
      </button>
    );
  }
}

export default DeletePost;
