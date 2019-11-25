import React, { Component } from "react";
import { singlePost, like, unlike } from "./apiPost";
import { Link, Redirect } from "react-router-dom";
import DefaultPost from "../images/tea.jpg";
import { isAuthenticated } from "../auth";
import DeletePost from "./DeletePost";
import Comment from "./Comment";

class SinglePost extends Component {
  state = {
    post: "",
    redirectToPosts: false,
    redirectToSignin: false,
    like: false,
    likes: 0,
    comments: []
  };

  updateComments = comments => {
    this.setState({ comments });
  };

  likeToggle = () => {
    if (!isAuthenticated()) {
      this.setState({ redirectToSignin: true });
      return false;
    }

    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;
    const postId = this.state.post._id;

    let callApi = this.state.like ? unlike : like; // call unlike/like method accordingly
    callApi(userId, token, postId).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({
          like: !this.state.like,
          likes: data.likes.length
        });
      }
    });
  };

  // Check if the user exists in the likes array or not. If exists, return true, else return false
  checkLike = likes => {
    const userId = isAuthenticated() && isAuthenticated().user._id;
    let match = likes.indexOf(userId) !== -1; // if this user exists in the likes array, then its index is not -1, return true; else return false
    return match;
  };

  componentDidMount = () => {
    const postId = this.props.match.params.postId;
    this.groupId = this.props.match.params.groupId;
    singlePost(postId).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({
          post: data,
          likes: data.likes.length,
          like: this.checkLike(data.likes),
          comments: data.comments
        });
      }
    });
  };

  renderPost = post => {
    const posterId = post.postedBy ? `/user/{post.postedBy._id}` : "";
    const posterName = post.postedBy ? post.postedBy.name : " Unknown";
    const userId = post.postedBy ? post.postedBy._id : " Unknown";
    const { like, likes } = this.state;

    return (
      <div className="card-body">
        <img
          src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
          alt={post.title}
          onError={i => (i.target.src = `${DefaultPost}`)}
          className="img-thumbnail mb-3"
          style={{ height: "300px", width: "100%", objectFit: "cover" }}
        />

        {like ? (
          <h5 onClick={this.likeToggle}>
            <i
              class="fas fa-thumbs-up text-success bg-dark"
              style={{
                padding: "10px",
                borderRadius: "50%",
                cursor: "pointer",
                color: "#fff"
              }}
            />{" "}
            {likes} Like
          </h5>
        ) : (
          <h5 onClick={this.likeToggle}>
            {" "}
            <i
              class="fas fa-thumbs-up text-warning bg-dark"
              style={{
                padding: "10px",
                borderRadius: "50%",
                cursor: "pointer",
                color: "#fff"
              }}
            />{" "}
            {likes} Like
          </h5>
        )}

        <p className="card-text">{post.body}</p>
        <br />
        <div class="card-footer text-muted">
          <p>
            Posted by <Link to={`/user/${posterId}`}>{posterName} </Link>
            on {new Date(post.created).toDateString()}
          </p>
          <div className="d-inline-block">
            {isAuthenticated().user && isAuthenticated().user._id === userId && (
              <>
                <Link
                  to={`/group/${this.groupId}/post/edit/${post._id}`}
                  className="btn btn-raised btn-info btn-sm mr-3"
                >
                  Edit post
                </Link>
                <DeletePost postId={post._id} />
              </>
            )}
            <Link to={`group/${this.groupId}/posts`} className="btn btn-raised btn-primary btn-sm">
              Back to all posts
            </Link>
          </div>
        </div>
      </div>
    );
  };

  render() {
    const { post, redirectToPosts, redirectToSignin, comments } = this.state;

    if (redirectToPosts) {
      return <Redirect to={`/group/${this.groupId}/posts`} />;
    } else if (redirectToSignin) {
      return <Redirect to={`/signin`} />;
    }

    return (
      <div className="container">
        <h2 className="display-2 mt-5 ml-3">{post.title}</h2>
        {this.renderPost(post)}

        <Comment
          postId={post._id}
          comments={comments.reverse()}
          updateComments={this.updateComments}
        />
      </div>
    );
  }
}

export default SinglePost;
